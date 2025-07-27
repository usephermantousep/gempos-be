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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller(':tenantSlug/transactions')
@UseGuards(JwtAuthGuard, TenantGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new transaction',
    description: 'Create a new POS transaction with items and payment details',
  })
  @ApiParam({
    name: 'tenantSlug',
    description: 'Tenant slug for multi-tenant routing',
    example: 'master-dev',
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    schema: {
      example: {
        id: 'uuid',
        transactionNumber: 'TXN-20250727-001',
        subtotal: 25000,
        tax: 2500,
        discount: 1000,
        total: 26500,
        paidAmount: 30000,
        change: 3500,
        paymentMethod: 'CASH',
        status: 'COMPLETED',
        items: [
          {
            id: 'uuid',
            productId: 'uuid',
            quantity: 2,
            unitPrice: 12500,
            total: 25000,
            product: {
              name: 'Nasi Goreng',
              sku: 'FD001',
            },
          },
        ],
      },
    },
  })
  @ApiBody({ type: CreateTransactionDto })
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
