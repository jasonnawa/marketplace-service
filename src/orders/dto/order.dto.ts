import { ApiProperty } from '@nestjs/swagger';
import { OrderItemDto } from './order-item.dto';
import { OrderStatus } from '../enums/order-status.enum';

export class OrderDto {
  @ApiProperty({ example: 1, description: 'Order ID' })
  id: number;

  @ApiProperty({ example: 42, description: 'User ID who placed the order' })
  userId: number;

  @ApiProperty({ type: [OrderItemDto], description: 'List of items in the order' })
  items: OrderItemDto[];

  @ApiProperty({ example: 199.95, description: 'Subtotal of all items' })
  subtotal: number;

  @ApiProperty({ example: 19.99, description: 'Tax applied to order' })
  tax: number;

  @ApiProperty({ example: 219.94, description: 'Total amount (subtotal + tax)' })
  total: number;

  @ApiProperty({ example: OrderStatus.PLACED, enum: OrderStatus, description: 'Order status' })
  status: OrderStatus;

  @ApiProperty({ example: '2025-08-16T01:45:00Z', description: 'Order creation timestamp' })
  createdAt: Date;
}
