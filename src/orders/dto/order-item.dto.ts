import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: number;

  @ApiProperty({ example: 'Awesome Widget', description: 'Product name' })
  productName: string;

  @ApiProperty({ example: 2, description: 'Quantity ordered' })
  quantity: number;

  @ApiProperty({ example: 49.99, description: 'Price at the time of order' })
  price: number;

  @ApiProperty({ example: 99.98, description: 'Total for this item (price * quantity)' })
  total: number;
}
