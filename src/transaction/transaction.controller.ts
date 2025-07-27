import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';

@Controller(':tenantSlug/transactions')
@UseGuards(JwtAuthGuard, TenantGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req: any,
    @Param('tenantSlug') tenantSlug: string,
  ) {
    const tenantId = req.tenant.id;
    const userId = req.user.id;
    return this.transactionService.create(
      createTransactionDto,
      tenantId,
      userId,
    );
  }

  @Get()
  findAll(@Request() req: any, @Param('tenantSlug') tenantSlug: string) {
    const tenantId = req.tenant.id;
    return this.transactionService.findAll(tenantId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: any,
    @Param('tenantSlug') tenantSlug: string,
  ) {
    const tenantId = req.tenant.id;
    return this.transactionService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req: any,
    @Param('tenantSlug') tenantSlug: string,
  ) {
    const tenantId = req.tenant.id;
    return this.transactionService.update(id, updateTransactionDto, tenantId);
  }

  @Post(':id/complete')
  complete(
    @Param('id') id: string,
    @Request() req: any,
    @Param('tenantSlug') tenantSlug: string,
  ) {
    const tenantId = req.tenant.id;
    return this.transactionService.completeTransaction(id, tenantId);
  }

  @Post(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Request() req: any,
    @Param('tenantSlug') tenantSlug: string,
  ) {
    const tenantId = req.tenant.id;
    return this.transactionService.cancelTransaction(id, tenantId);
  }
}
