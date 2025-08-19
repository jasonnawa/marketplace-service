import { User } from '../user.model';
import { UserDto } from '../dto/user.dto';
import { mapCartToDto } from 'src/cart/helper/cart-dto-mapper';

export function mapUserToDto(user: User): UserDto {
  const plainUser = user.get({ plain: true });
  return {
    id: plainUser.id!,
    firstname: plainUser.firstname,
    lastname: plainUser.lastname,
    email: plainUser.email,
    role: plainUser.role,
    createdAt: plainUser.createdAt,
    updatedAt: plainUser.updatedAt,
    cart: user.cart ? mapCartToDto(user.cart) : undefined,
  };
}
