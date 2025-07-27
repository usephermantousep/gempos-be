import { Controller, Get, Request, UseGuards, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';

@Controller(':tenantSlug/products')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(@Request() req: any, @Param('tenantSlug') tenantSlug: string) {
    const tenantId = req.tenant.id;
    return this.productService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string, @Param('tenantSlug') tenantSlug: string) {
    const tenantId = req.tenant.id;
    return this.productService.findOne(id, tenantId);
  }
}
