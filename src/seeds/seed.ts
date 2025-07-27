import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  try {
    // Get command line arguments
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'master':
        await seedService.seedMasterData();
        break;
      case 'sample':
        await seedService.seedSampleData();
        break;
      case 'admin':
        await seedService.createSystemAdmin();
        break;
      case 'all':
        await seedService.seedMasterData();
        await seedService.createSystemAdmin();
        await seedService.seedSampleData();
        break;
      default:
        console.log('📋 Available seed commands:');
        console.log('  npm run seed master  - Create master tenant and user');
        console.log('  npm run seed admin   - Create system admin user');
        console.log('  npm run seed sample  - Create sample users');
        console.log('  npm run seed all     - Create all development data');
        break;
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await app.close();
  }
}

void bootstrap();
