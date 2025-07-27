import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { TenantModule } from '../tenant/tenant.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TenantModule, UserModule],
  controllers: [AdminController],
})
export class AdminModule {}
