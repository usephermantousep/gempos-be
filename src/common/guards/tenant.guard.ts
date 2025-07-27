import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TenantService } from '../../tenant/tenant.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly tenantService: TenantService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantSlug = request.params.tenantSlug;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!tenantSlug) {
      throw new NotFoundException('Tenant slug not provided in URL');
    }

    try {
      // Find tenant by slug
      const tenant = await this.tenantService.findBySlug(tenantSlug);
      
      // Check if user belongs to this tenant
      if (user.tenantId !== tenant.id) {
        throw new ForbiddenException('User does not belong to this tenant');
      }

      // Add tenant info to request for easy access in controllers
      request.tenant = tenant;
      
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Tenant not found');
      }
      throw error;
    }
  }
}
