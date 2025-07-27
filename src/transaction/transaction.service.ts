import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction, TransactionStatus } from './transaction.entity';
import { TransactionItem } from './transaction-item.entity';
import { Product } from '../product/product.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionItem)
    private readonly transactionItemRepository: Repository<TransactionItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    tenantId: string,
    userId: string,
  ): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate transaction number
      const transactionNumber = await this.generateTransactionNumber(tenantId);

      // Create transaction
      const transaction = queryRunner.manager.create(Transaction, {
        ...createTransactionDto,
        transactionNumber,
        tenantId,
        userId,
        status: TransactionStatus.PENDING,
      });

      const savedTransaction = await queryRunner.manager.save(transaction);

      // Create transaction items and update inventory
      let subtotal = 0;
      const transactionItems: TransactionItem[] = [];

      for (const itemDto of createTransactionDto.items) {
        // Get product and check stock
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: itemDto.productId, tenantId },
        });

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${itemDto.productId} not found`,
          );
        }

        if (product.trackStock && product.stock < itemDto.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.name}`,
          );
        }

        // Calculate item total
        const itemTotal = itemDto.quantity * itemDto.unitPrice;
        subtotal += itemTotal;

        // Create transaction item
        const transactionItem = queryRunner.manager.create(TransactionItem, {
          transactionId: savedTransaction.id,
          productId: itemDto.productId,
          productName: product.name,
          productSku: product.sku,
          quantity: itemDto.quantity,
          unitPrice: itemDto.unitPrice,
          totalPrice: itemTotal,
          discount: itemDto.discount || 0,
          notes: itemDto.notes,
        });

        transactionItems.push(transactionItem);

        // Update product stock if tracking is enabled
        if (product.trackStock) {
          product.stock -= itemDto.quantity;
          await queryRunner.manager.save(product);
        }
      }

      // Save transaction items
      await queryRunner.manager.save(transactionItems);

      // Update transaction totals
      savedTransaction.subtotal = subtotal;
      savedTransaction.tax = createTransactionDto.tax || 0;
      savedTransaction.discount = createTransactionDto.discount || 0;
      savedTransaction.total =
        subtotal + savedTransaction.tax - savedTransaction.discount;

      await queryRunner.manager.save(savedTransaction);

      await queryRunner.commitTransaction();

      // Return transaction with items
      return this.findOne(savedTransaction.id, tenantId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    tenantId: string,
    page = 1,
    limit = 10,
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where: { tenantId },
        relations: ['items', 'items.product', 'customer', 'user'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      },
    );

    return { transactions, total };
  }

  async findOne(id: string, tenantId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, tenantId },
      relations: ['items', 'items.product', 'customer', 'user'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    tenantId: string,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id, tenantId);

    // Only allow certain updates based on status
    if (transaction.status === TransactionStatus.COMPLETED) {
      throw new BadRequestException('Cannot update completed transaction');
    }

    Object.assign(transaction, updateTransactionDto);
    await this.transactionRepository.save(transaction);

    return this.findOne(id, tenantId);
  }

  async completeTransaction(
    id: string,
    tenantId: string,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id, tenantId);

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Transaction is not pending');
    }

    transaction.status = TransactionStatus.COMPLETED;
    await this.transactionRepository.save(transaction);

    return transaction;
  }

  async cancelTransaction(id: string, tenantId: string): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await this.findOne(id, tenantId);

      if (transaction.status === TransactionStatus.COMPLETED) {
        throw new BadRequestException('Cannot cancel completed transaction');
      }

      // Restore inventory
      for (const item of transaction.items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId, tenantId },
        });

        if (product && product.trackStock) {
          product.stock += item.quantity;
          await queryRunner.manager.save(product);
        }
      }

      // Update transaction status
      transaction.status = TransactionStatus.CANCELLED;
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async generateTransactionNumber(tenantId: string): Promise<string> {
    const today = new Date();
    const dateString = today.toISOString().slice(0, 10).replace(/-/g, '');

    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const count = await this.transactionRepository.count({
      where: {
        tenantId,
        createdAt: {
          gte: startOfDay,
        } as any,
      },
    });

    return `TRX-${dateString}-${String(count + 1).padStart(4, '0')}`;
  }

  async getTodaySales(
    tenantId: string,
  ): Promise<{ total: number; count: number }> {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.total)', 'total')
      .addSelect('COUNT(transaction.id)', 'count')
      .where('transaction.tenantId = :tenantId', { tenantId })
      .andWhere('transaction.status = :status', {
        status: TransactionStatus.COMPLETED,
      })
      .andWhere('transaction.createdAt >= :startOfDay', { startOfDay })
      .andWhere('transaction.createdAt < :endOfDay', { endOfDay })
      .getRawOne();

    return {
      total: parseFloat(result.total) || 0,
      count: parseInt(result.count) || 0,
    };
  }
}
