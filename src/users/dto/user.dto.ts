import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CartDto } from 'src/cart/dto/cart.dto';

export class UserDto {
  @ApiPropertyOptional({ example: 1 })
  id?: number;

  @ApiProperty({ example: 'John' })
  firstname: string;

  @ApiProperty({ example: 'Doe' })
  lastname: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role: UserRole;

  @ApiPropertyOptional({ type: CartDto, description: 'User\'s active cart, if any' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CartDto)
  cart?: CartDto;

  @ApiPropertyOptional({ example: '2025-08-16T01:45:00Z', description: 'user creation timestamp' })
  createdAt?: Date;

  @ApiPropertyOptional({ example: '2025-08-16T01:45:00Z', description: 'user last updated timestamp' })
  updatedAt?: Date;
}
