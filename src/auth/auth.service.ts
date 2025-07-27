import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { TenantService } from '../tenant/tenant.service';
import { User } from '../user/user.entity';
import { Tenant } from '../tenant/tenant.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

interface JwtPayload {
  email: string;
  sub: string;
  tenantId: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tenantService: TenantService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
    tenantId?: string,
  ): Promise<User | null> {
    const user = await this.userService.validateUser(email, password, tenantId);
    return user;
  }

  private generateTokens(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private formatUserResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenantId: user.tenantId,
      tenant: user.tenant,
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string; user: any }> {
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

    const tokens = this.generateTokens(user);

    return {
      ...tokens,
      user: this.formatUserResponse(user),
    };
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<{ access_token: string; refresh_token: string; user: any }> {
    // Find tenant by slug
    const tenant = await this.tenantService.findBySlug(registerDto.tenantSlug);

    // Create user
    const userData = {
      ...registerDto,
      tenantId: tenant.id,
    };

    const user = await this.userService.create(userData);

    const tokens = this.generateTokens(user);

    return {
      ...tokens,
      user: this.formatUserResponse(user),
    };
  }

  async refreshTokens(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = this.jwtService.verify(
        refreshTokenDto.refreshToken,
      ) as JwtPayload;

      // Find user to ensure they still exist
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
