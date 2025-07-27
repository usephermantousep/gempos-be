import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Tenant } from '../tenant/tenant.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, User])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedsModule {}
