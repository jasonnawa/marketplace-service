import { Order } from '../models/order.model';
import { OrderDto } from '../dto/order.dto';
import { OrderItemDto } from '../dto/order-item.dto';

export function mapOrderToDto(order: Order): OrderDto {
  const items: OrderItemDto[] = (order.items || []).map((item) => ({
    productId: item.productId,
    productName: item.product?.name || '', 
    quantity: item.quantity,
    price: item.price,
    total: item.price * item.quantity,
  }));

  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    createdAt: order.createdAt,
    items,
  };
}
