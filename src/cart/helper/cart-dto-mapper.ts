import { Cart } from '../models/cart.model';
import { CartItemDto } from '../dto/cart-item.dto';
import { CartDto } from '../dto/cart.dto';

export function mapCartToDto(cart: Cart): CartDto {
  const plainCart = cart.get({ plain: true });

  return {
    id: plainCart.id!,
    userId: plainCart.userId,
    items: plainCart.items?.map(item => ({
      id: item.id!,
      quantity: item.quantity,
      product: {
        id: item.product.id!,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        stock: item.product.stock,
        category: item.product.category,
        images: item.product.images,
      },
    })) || [],
    subtotal: plainCart.subtotal,
    tax: plainCart.tax,
    total: plainCart.total,
  };
}
