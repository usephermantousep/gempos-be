import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists in the same tenant
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
        tenantId: createUserDto.tenantId,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists in this tenant');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findAll(tenantId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { tenantId, isActive: true },
      relations: ['tenant'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, tenantId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, tenantId, isActive: true },
      relations: ['tenant'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string, tenantId?: string): Promise<User | null> {
    const whereCondition: any = { email, isActive: true };
    if (tenantId) {
      whereCondition.tenantId = tenantId;
    }

    return this.userRepository.findOne({
      where: whereCondition,
      relations: ['tenant'],
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    tenantId: string,
  ): Promise<User> {
    const user = await this.findOne(id, tenantId);

    // Check if email is being changed and already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: {
          email: updateUserDto.email,
          tenantId,
        },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists in this tenant');
      }
    }

    // Hash password if provided
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const user = await this.findOne(id, tenantId);
    user.isActive = false;
    await this.userRepository.save(user);
  }

  async validateUser(
    email: string,
    password: string,
    tenantId?: string,
  ): Promise<User | null> {
    const user = await this.findByEmail(email, tenantId);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }
}
