import {
  IsArray,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../transaction.entity';

export class CreateTransactionItemDto {
  @ApiProperty({
    description: 'Product ID for the transaction item',
    example: 'uuid-product-id',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Unit price of the product',
    example: 15000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({
    description: 'Discount amount for this item',
    example: 1000,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  discount?: number;

  @ApiPropertyOptional({
    description: 'Additional notes for this item',
    example: 'Extra spicy',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Array of transaction items',
    type: [CreateTransactionItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionItemDto)
  items: CreateTransactionItemDto[];

  @ApiPropertyOptional({
    description: 'Tax amount for the transaction',
    example: 1500,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  tax?: number;

  @ApiPropertyOptional({
    description: 'Discount amount for the entire transaction',
    example: 2000,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  discount?: number;

  @ApiProperty({
    description: 'Payment method for the transaction',
    enum: PaymentMethod,
    example: PaymentMethod.CASH,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Amount paid by customer',
    example: 30000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  paidAmount: number;

  @ApiPropertyOptional({
    description: 'Customer ID if applicable',
    example: 'uuid-customer-id',
  })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional({
    description: 'Additional notes for the transaction',
    example: 'Customer requested extra packaging',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
