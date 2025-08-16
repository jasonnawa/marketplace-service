import { IsInt, Min, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CloneCartItemDto {
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

export class CloneCartDto {
   @ApiProperty({
    example: [
      { productId: 1, quantity: 2 },
      { productId: 5, quantity: 3 },
    ],
    description: 'Cart items (products) to be cloned',
    type: [CloneCartItemDto],
  })
  @ArrayNotEmpty()
  @ArrayUnique((o: CloneCartItemDto) => o.productId)
  items: CloneCartItemDto[];
}
