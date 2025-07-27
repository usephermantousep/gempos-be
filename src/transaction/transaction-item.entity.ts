import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Product } from '../product/product.entity';

@Entity('transaction_items')
export class TransactionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Transaction, (transaction) => transaction.items)
  transaction: Transaction;

  @Column()
  transactionId: string;

  @ManyToOne(() => Product, (product) => product.transactionItems)
  product: Product;

  @Column()
  productId: string;

  // Store product data at transaction time (in case product changes later)
  @Column()
  productName: string;

  @Column({ nullable: true })
  productSku: string;
}
