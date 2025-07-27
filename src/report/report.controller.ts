import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { SalesReportDto } from './dto/sales-report.dto';
import { InventoryReportDto } from './dto/inventory-report.dto';

@Controller(':tenantSlug/reports')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('sales')
  getSalesReport(
    @Request() req: any,
    @Query() salesReportDto: SalesReportDto,
    @Param('tenantSlug') tenantSlug: string,
  ) {
    const tenantId = req.tenant.id;
    return this.reportService.getSalesReport(tenantId, salesReportDto);
  }

  @Get('inventory')
  getInventoryReport(
    @Request() req: any,
    @Query() inventoryReportDto: InventoryReportDto,
    @Param('tenantSlug') tenantSlug: string,
  ) {
    const tenantId = req.tenant.id;
    return this.reportService.getInventoryReport(tenantId, inventoryReportDto);
  }

  @Get('dashboard')
  getDashboardMetrics(
    @Request() req: any,
    @Param('tenantSlug') tenantSlug: string,
  ) {
    const tenantId = req.tenant.id;
    return this.reportService.getDashboardMetrics(tenantId);
  }
}
