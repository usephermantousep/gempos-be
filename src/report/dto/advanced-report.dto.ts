import { IsOptional, IsDateString, IsEnum, IsString, IsArray } from 'class-validator';

export enum ComparisonPeriod {
  PREVIOUS_PERIOD = 'previous_period',
  SAME_PERIOD_LAST_YEAR = 'same_period_last_year',
}

export enum GroupBy {
  DAY = 'day',
  WEEK = 'week', 
  MONTH = 'month',
  PRODUCT = 'product',
  CATEGORY = 'category',
  PAYMENT_METHOD = 'payment_method',
}

export class AdvancedReportDto {
  @IsEnum(['sales', 'inventory', 'products', 'customers'])
  reportType: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsEnum(ComparisonPeriod)
  comparison?: ComparisonPeriod;

  @IsOptional()
  @IsEnum(GroupBy)
  groupBy?: GroupBy;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

export interface AdvancedReportResponse {
  reportType: string;
  period: {
    start: string;
    end: string;
  };
  comparison?: {
    period: {
      start: string;
      end: string;
    };
    metrics: any;
  };
  data: any[];
  summary: {
    totalRevenue: number;
    totalTransactions: number;
    totalItems: number;
    averageOrderValue: number;
  };
}
