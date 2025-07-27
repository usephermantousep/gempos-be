import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '../../user/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Only system admins can pass this guard
    if (user.role !== UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException(
        'Access denied. System admin privileges required.',
      );
    }

    return true;
  }
}
