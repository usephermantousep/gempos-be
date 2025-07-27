import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { User, UserRole } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seedMasterData() {
    console.log('🌱 Starting development data seeding...');

    // Check if master tenant already exists
    const existingTenant = await this.tenantRepository.findOne({
      where: { slug: 'master-dev' },
    });

    if (existingTenant) {
      console.log('✅ Master tenant already exists');

      // Check if master user exists
      const existingUser = await this.userRepository.findOne({
        where: {
          email: 'master@gempos.dev',
          tenant: { id: existingTenant.id },
        },
      });

      if (existingUser) {
        console.log('✅ Master user already exists');
        console.log('🎯 Development credentials:');
        console.log('📧 Email: master@gempos.dev');
        console.log('🔑 Password: MasterDev123!');
        console.log('🏢 Tenant Slug: master-dev');
        console.log('🌐 API Base: /api/v1/master-dev/');
        return;
      }
    }

    let masterTenant: Tenant;

    if (!existingTenant) {
      // Create master tenant
      masterTenant = this.tenantRepository.create({
        name: 'Master Development',
        subdomain: 'master-dev',
        slug: 'master-dev',
        businessName: 'GemPOS Master Store',
        businessType: 'Retail',
        businessAddress: 'Jl. Sudirman No. 123, Jakarta Pusat',
        businessPhone: '+62-21-1234-5678',
        businessEmail: 'master@gempos.dev',
        isActive: true,
      });

      masterTenant = await this.tenantRepository.save(masterTenant);
      console.log('✅ Master tenant created');
    } else {
      masterTenant = existingTenant;
    }

    // Hash password for master user
    const hashedPassword = await bcrypt.hash('MasterDev123!', 10);

    // Create master user
    const masterUser = this.userRepository.create({
      firstName: 'Master',
      lastName: 'Admin',
      email: 'master@gempos.dev',
      password: hashedPassword,
      role: UserRole.OWNER,
      isActive: true,
      tenant: masterTenant,
    });

    await this.userRepository.save(masterUser);
    console.log('✅ Master user created');

    console.log('🎉 Development data seeding completed!');
    console.log('');
    console.log('🎯 Development credentials:');
    console.log('📧 Email: master@gempos.dev');
    console.log('🔑 Password: MasterDev123!');
    console.log('🏢 Tenant Slug: master-dev');
    console.log('🌐 API Base: /api/v1/master-dev/');
    console.log('');
    console.log('🚀 You can now login with these credentials!');
  }

  async seedSampleData() {
    console.log('🌱 Starting sample data seeding...');

    const masterTenant = await this.tenantRepository.findOne({
      where: { slug: 'master-dev' },
    });

    if (!masterTenant) {
      console.log(
        '❌ Master tenant not found. Please run seedMasterData first.',
      );
      return;
    }

    // Create additional sample users
    const hashedPassword = await bcrypt.hash('SampleDev123!', 10);

    const sampleUsers = [
      {
        firstName: 'John',
        lastName: 'Cashier',
        email: 'cashier@gempos.dev',
        role: UserRole.CASHIER,
      },
      {
        firstName: 'Jane',
        lastName: 'Staff',
        email: 'staff@gempos.dev',
        role: UserRole.STAFF,
      },
    ];

    for (const userData of sampleUsers) {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email, tenant: { id: masterTenant.id } },
      });

      if (!existingUser) {
        const user = this.userRepository.create({
          ...userData,
          password: hashedPassword,
          isActive: true,
          tenant: masterTenant,
        });

        await this.userRepository.save(user);
        console.log(`✅ Sample user created: ${userData.email}`);
      } else {
        console.log(`⚠️  User already exists: ${userData.email}`);
      }
    }

    console.log('🎉 Sample data seeding completed!');
    console.log('');
    console.log('📝 Additional test credentials:');
    console.log('👤 Cashier - cashier@gempos.dev : SampleDev123!');
    console.log('👤 Staff - staff@gempos.dev : SampleDev123!');
  }
}
