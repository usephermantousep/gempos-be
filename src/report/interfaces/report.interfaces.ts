export interface DashboardMetrics {
  today: {
    revenue: number;
    transactions: number;
  };
  month: {
    revenue: number;
    transactions: number;
  };
  inventory: {
    lowStock: number;
    outOfStock: number;
  };
}

export interface ProductSalesData {
  productId: string;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface SalesByDay {
  date: string;
  sales: number;
  transactions: number;
}

export interface PaymentMethodData {
  method: string;
  count: number;
  total: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  sku: string;
}

export interface OutOfStockProduct {
  id: string;
  name: string;
  sku: string;
}

export interface StockMovement {
  productId: string;
  productName: string;
  stockIn: number;
  stockOut: number;
  currentStock: number;
}
