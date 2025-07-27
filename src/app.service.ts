import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to GemPOS - Multi-Tenant Point of Sales API for UMKM Indonesia! 🇮🇩';
  }
}
