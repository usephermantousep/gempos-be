import { IsOptional, IsNumber, Min } from 'class-validator';

export class InventoryReportDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  minStock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxStock?: number;
}

export interface InventoryReportResponse {
  totalProducts: number;
  lowStockProducts: Array<{
    id: string;
    name: string;
    currentStock: number;
    minStock: number;
    sku: string;
  }>;
  outOfStockProducts: Array<{
    id: string;
    name: string;
    sku: string;
  }>;
  inventoryValue: number;
  stockMovement: Array<{
    productId: string;
    productName: string;
    stockIn: number;
    stockOut: number;
    currentStock: number;
  }>;
}
