import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CartItemDto } from './cart-item.dto';
import { IsInt, IsOptional, ValidateNested, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CartDto {
  @ApiProperty({ example: 1, description: 'Cart ID' })
  @IsInt()
  id: number;

  @ApiPropertyOptional({ example: 1, description: 'User ID if logged in, null for guests' })
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiProperty({ type: [CartItemDto], description: 'Items in the cart' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @ApiProperty({ example: 200, description: 'Subtotal of items in the cart before tax' })
  @IsNumber()
  subtotal: number;

  @ApiProperty({ example: 20, description: 'Calculated tax for the cart' })
  @IsNumber()
  tax: number;

  @ApiProperty({ example: 220, description: 'Total amount including subtotal and tax' })
  @IsNumber()
  total: number;
}

