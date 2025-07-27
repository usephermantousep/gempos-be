import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Basic CRUD methods will be implemented here
  async findAll(tenantId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { tenantId },
      relations: ['categories'],
    });
  }

  async findOne(id: string, tenantId: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id, tenantId },
      relations: ['categories'],
    });
  }
}
