import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TenantService } from '../tenant/tenant.service';
import { User } from '../user/user.entity';
import { Tenant } from '../tenant/tenant.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tenantService: TenantService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
    tenantId?: string,
  ): Promise<User | null> {
    const user = await this.userService.validateUser(email, password, tenantId);
    return user;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: any }> {
    let tenant: Tenant | null = null;
    let tenantId: string | undefined = undefined;

    // If tenantSlug is provided, find tenant
    if (loginDto.tenantSlug) {
      tenant = await this.tenantService.findBySlug(loginDto.tenantSlug);
      tenantId = tenant.id;
    }

    const user = await this.validateUser(
      loginDto.email,
      loginDto.password,
      tenantId,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        tenant: user.tenant,
      },
    };
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<{ access_token: string; user: any }> {
    // Find tenant by slug
    const tenant = await this.tenantService.findBySlug(registerDto.tenantSlug);

    // Create user
    const userData = {
      ...registerDto,
      tenantId: tenant.id,
    };

    const user = await this.userService.create(userData);

    // Generate JWT
    const payload = {
      email: user.email,
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        tenant: user.tenant,
      },
    };
  }
}
