import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import { CreateTenantDto } from '../tenant/dto/create-tenant.dto';
import { UpdateTenantDto } from '../tenant/dto/update-tenant.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@ApiTags('System Administration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly userService: UserService,
  ) {}

  // Tenant Management
  @Get('tenants')
  @ApiOperation({
    summary: 'Get all tenants (System Admin only)',
    description:
      'Retrieve all tenants in the system. Only system admins can access this endpoint.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all tenants retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied. System admin privileges required.',
  })
  async getAllTenants() {
    return this.tenantService.findAll();
  }

  @Get('tenants/:id')
  @ApiOperation({
    summary: 'Get tenant by ID (System Admin only)',
    description:
      'Retrieve a specific tenant by ID. Only system admins can access this endpoint.',
  })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  @ApiResponse({
    status: 200,
    description: 'Tenant retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Tenant not found',
  })
  async getTenantById(@Param('id') id: string) {
    return this.tenantService.findOne(id);
  }

  @Post('tenants')
  @ApiOperation({
    summary: 'Create new tenant (System Admin only)',
    description:
      'Create a new tenant. Only system admins can access this endpoint.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tenant created successfully',
  })
  async createTenant(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.create(createTenantDto);
  }

  @Patch('tenants/:id')
  @ApiOperation({
    summary: 'Update tenant (System Admin only)',
    description:
      'Update an existing tenant. Only system admins can access this endpoint.',
  })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  async updateTenant(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    return this.tenantService.update(id, updateTenantDto);
  }

  @Delete('tenants/:id')
  @ApiOperation({
    summary: 'Delete tenant (System Admin only)',
    description:
      'Delete a tenant. Only system admins can access this endpoint.',
  })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  async deleteTenant(@Param('id') id: string) {
    return this.tenantService.remove(id);
  }

  // Cross-tenant User Management
  @Get('users')
  @ApiOperation({
    summary: 'Get all users across all tenants (System Admin only)',
    description:
      'Retrieve all users from all tenants. Only system admins can access this endpoint.',
  })
  async getAllUsers() {
    return this.userService.findAllAcrossAllTenants();
  }

  @Get('tenants/:tenantId/users')
  @ApiOperation({
    summary: 'Get users by tenant ID (System Admin only)',
    description:
      'Retrieve all users for a specific tenant. Only system admins can access this endpoint.',
  })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  async getUsersByTenantId(@Param('tenantId') tenantId: string) {
    return this.userService.findAll(tenantId);
  }

  @Post('tenants/:tenantId/users')
  @ApiOperation({
    summary: 'Create user in specific tenant (System Admin only)',
    description:
      'Create a new user in a specific tenant. Only system admins can access this endpoint.',
  })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  async createUserInTenant(
    @Param('tenantId') tenantId: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    const userData = { ...createUserDto, tenantId };
    return this.userService.create(userData);
  }

  @Get('users/:userId')
  @ApiOperation({
    summary: 'Get user by ID across all tenants (System Admin only)',
    description:
      'Retrieve a specific user by ID from any tenant. Only system admins can access this endpoint.',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async getUserById(@Param('userId') userId: string) {
    return this.userService.findById(userId);
  }

  @Patch('users/:userId')
  @ApiOperation({
    summary: 'Update user across tenants (System Admin only)',
    description:
      'Update a user from any tenant. Only system admins can access this endpoint.',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userService.update(userId, updateUserDto, user.tenantId);
  }

  @Delete('users/:userId')
  @ApiOperation({
    summary: 'Delete user across tenants (System Admin only)',
    description:
      'Delete a user from any tenant. Only system admins can access this endpoint.',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async deleteUser(@Param('userId') userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userService.remove(userId, user.tenantId);
  }
}
