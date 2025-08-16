import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from 'src/products/dto/product.dto';
import { IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ type: ProductDto })
  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;

  @ApiProperty({ example: 2, description: 'Quantity of the product in the cart' })
  @IsInt()
  @Min(1)
  quantity: number;
}
