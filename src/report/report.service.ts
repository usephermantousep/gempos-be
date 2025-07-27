import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction, TransactionStatus } from '../transaction/transaction.entity';
import { TransactionItem } from '../transaction/transaction-item.entity';
import { Product } from '../product/product.entity';
import { SalesReportDto, SalesReportResponse, ReportPeriod } from './dto/sales-report.dto';
import { InventoryReportDto, InventoryReportResponse } from './dto/inventory-report.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionItem)
    private readonly transactionItemRepository: Repository<TransactionItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getSalesReport(
    tenantId: string,
    reportDto: SalesReportDto,
  ): Promise<SalesReportResponse> {
    const { period, startDate, endDate, productId, categoryId } = reportDto;
    
    // Calculate date range based on period
    const { start, end } = this.calculateDateRange(period, startDate, endDate);

    // Base query for transactions
    let transactionQuery = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('transaction.tenantId = :tenantId', { tenantId })
      .andWhere('transaction.status = :status', { status: TransactionStatus.COMPLETED })
      .andWhere('transaction.createdAt BETWEEN :start AND :end', { start, end });

    if (productId) {
      transactionQuery = transactionQuery.andWhere('items.productId = :productId', { productId });
    }

    if (categoryId) {
      transactionQuery = transactionQuery.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    const transactions = await transactionQuery.getMany();

    // Calculate metrics
    const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
    const totalTransactions = transactions.length;
    const totalItems = transactions.reduce((sum, t) => 
      sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const averageOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;

    // Top products
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    transactions.forEach(transaction => {
      transaction.items.forEach(item => {
        const key = item.productId;
        const existing = productSales.get(key);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.totalPrice;
        } else {
          productSales.set(key, {
            name: item.product.name,
            quantity: item.quantity,
            revenue: item.totalPrice,
          });
        }
      });
    });

    const topProducts = Array.from(productSales.entries())
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        quantitySold: data.quantity,
        totalRevenue: data.revenue,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    // Sales by day
    const salesByDay = await this.getSalesByDay(tenantId, start, end);

    // Payment methods
    const paymentMethods = await this.getPaymentMethodsReport(tenantId, start, end);

    return {
      period: `${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}`,
      totalSales,
      totalTransactions,
      totalItems,
      averageOrderValue,
      topProducts,
      salesByDay,
      paymentMethods,
    };
  }

  async getInventoryReport(
    tenantId: string,
    reportDto: InventoryReportDto,
  ): Promise<InventoryReportResponse> {
    const { minStock, maxStock } = reportDto;

    let productQuery = this.productRepository
      .createQueryBuilder('product')
      .where('product.tenantId = :tenantId', { tenantId })
      .andWhere('product.trackStock = :trackStock', { trackStock: true });

    if (minStock !== undefined) {
      productQuery = productQuery.andWhere('product.stock >= :minStock', { minStock });
    }

    if (maxStock !== undefined) {
      productQuery = productQuery.andWhere('product.stock <= :maxStock', { maxStock });
    }

    const products = await productQuery.getMany();

    // Low stock products
    const lowStockProducts = products
      .filter(p => p.stock <= p.minStock && p.stock > 0)
      .map(p => ({
        id: p.id,
        name: p.name,
        currentStock: p.stock,
        minStock: p.minStock,
        sku: p.sku,
      }));

    // Out of stock products
    const outOfStockProducts = products
      .filter(p => p.stock === 0)
      .map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
      }));

    // Inventory value
    const inventoryValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);

    // Stock movement (simplified - you might want to track actual movements)
    const stockMovement = products.map(p => ({
      productId: p.id,
      productName: p.name,
      stockIn: 0, // Would come from inventory movements
      stockOut: 0, // Would come from sales
      currentStock: p.stock,
    }));

    return {
      totalProducts: products.length,
      lowStockProducts,
      outOfStockProducts,
      inventoryValue,
      stockMovement,
    };
  }

  async getDashboardMetrics(tenantId: string) {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Today's sales
    const todaySales = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.tenantId = :tenantId', { tenantId })
      .andWhere('transaction.status = :status', { status: TransactionStatus.COMPLETED })
      .andWhere('transaction.createdAt BETWEEN :start AND :end', { 
        start: startOfDay, 
        end: endOfDay 
      })
      .getMany();

    const todayRevenue = todaySales.reduce((sum, t) => sum + t.total, 0);
    const todayTransactions = todaySales.length;

    // This month's sales
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthSales = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.tenantId = :tenantId', { tenantId })
      .andWhere('transaction.status = :status', { status: TransactionStatus.COMPLETED })
      .andWhere('transaction.createdAt >= :start', { start: startOfMonth })
      .getMany();

    const monthRevenue = monthSales.reduce((sum, t) => sum + t.total, 0);

    // Low stock count
    const lowStockCount = await this.productRepository
      .createQueryBuilder('product')
      .where('product.tenantId = :tenantId', { tenantId })
      .andWhere('product.trackStock = :trackStock', { trackStock: true })
      .andWhere('product.stock <= product.minStock')
      .andWhere('product.stock > 0')
      .getCount();

    // Out of stock count
    const outOfStockCount = await this.productRepository
      .createQueryBuilder('product')
      .where('product.tenantId = :tenantId', { tenantId })
      .andWhere('product.trackStock = :trackStock', { trackStock: true })
      .andWhere('product.stock = 0')
      .getCount();

    return {
      today: {
        revenue: todayRevenue,
        transactions: todayTransactions,
      },
      month: {
        revenue: monthRevenue,
        transactions: monthSales.length,
      },
      inventory: {
        lowStock: lowStockCount,
        outOfStock: outOfStockCount,
      },
    };
  }

  private calculateDateRange(
    period: ReportPeriod,
    startDate?: string,
    endDate?: string,
  ): { start: Date; end: Date } {
    const now = new Date();
    
    switch (period) {
      case ReportPeriod.DAILY:
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
        return { start: startOfDay, end: endOfDay };

      case ReportPeriod.WEEKLY:
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
        return { start: startOfWeek, end: endOfWeek };

      case ReportPeriod.MONTHLY:
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return { start: startOfMonth, end: endOfMonth };

      case ReportPeriod.YEARLY:
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
        return { start: startOfYear, end: endOfYear };

      case ReportPeriod.CUSTOM:
        if (!startDate || !endDate) {
          throw new Error('Start date and end date are required for custom period');
        }
        return { start: new Date(startDate), end: new Date(endDate) };

      default:
        throw new Error('Invalid report period');
    }
  }

  private async getSalesByDay(tenantId: string, start: Date, end: Date) {
    const transactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.tenantId = :tenantId', { tenantId })
      .andWhere('transaction.status = :status', { status: TransactionStatus.COMPLETED })
      .andWhere('transaction.createdAt BETWEEN :start AND :end', { start, end })
      .getMany();

    const salesByDay = new Map<string, { sales: number; transactions: number }>();
    
    transactions.forEach(transaction => {
      const date = transaction.createdAt.toISOString().split('T')[0];
      const existing = salesByDay.get(date);
      if (existing) {
        existing.sales += transaction.total;
        existing.transactions += 1;
      } else {
        salesByDay.set(date, { sales: transaction.total, transactions: 1 });
      }
    });

    return Array.from(salesByDay.entries()).map(([date, data]) => ({
      date,
      sales: data.sales,
      transactions: data.transactions,
    }));
  }

  private async getPaymentMethodsReport(tenantId: string, start: Date, end: Date) {
    const transactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.tenantId = :tenantId', { tenantId })
      .andWhere('transaction.status = :status', { status: TransactionStatus.COMPLETED })
      .andWhere('transaction.createdAt BETWEEN :start AND :end', { start, end })
      .getMany();

    const paymentMethods = new Map<string, { count: number; total: number }>();
    
    transactions.forEach(transaction => {
      const method = transaction.paymentMethod;
      const existing = paymentMethods.get(method);
      if (existing) {
        existing.count += 1;
        existing.total += transaction.total;
      } else {
        paymentMethods.set(method, { count: 1, total: transaction.total });
      }
    });

    return Array.from(paymentMethods.entries()).map(([method, data]) => ({
      method,
      count: data.count,
      total: data.total,
    }));
  }
}
