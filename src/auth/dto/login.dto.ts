import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'master@gempos.dev',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'MasterDev123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    description: 'Tenant slug for multi-tenant login',
    example: 'master-dev',
  })
  @IsString()
  @IsOptional()
  tenantSlug?: string;
}
