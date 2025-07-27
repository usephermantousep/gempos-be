import { Module, Global } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { TenantGuard } from './guards/tenant.guard';

@Global()
@Module({
  imports: [TenantModule],
  providers: [TenantGuard],
  exports: [TenantGuard],
})
export class CommonModule {}
