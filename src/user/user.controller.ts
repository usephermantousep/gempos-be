import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller(':tenantSlug/users')
@UseGuards(JwtAuthGuard, TenantGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new user',
    description: 'Create a new user within the tenant',
  })
  @ApiParam({
    name: 'tenantSlug',
    description: 'Tenant slug for multi-tenant routing',
    example: 'master-dev',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User not allowed for this tenant',
  })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto, @Request() req: any) {
    // For now, we'll use the tenantId from the body
    // In a real implementation, you'd extract it from the authenticated user's context
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Request() req: any) {
    // Extract tenantId from authenticated user
    const tenantId = req.user.tenantId;
    return this.userService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user.tenantId;
    return this.userService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    const tenantId = req.user.tenantId;
    return this.userService.update(id, updateUserDto, tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user.tenantId;
    return this.userService.remove(id, tenantId);
  }
}
