import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantity of the product being added to the cart' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}