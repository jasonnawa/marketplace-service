import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { Cart } from './cart.model';
import { Product } from '../../products/product.model';

export interface CartItemCreationAttrs {
  cartId: number;       
  productId: number;    
  quantity?: number;    
}

@Table({
  tableName: 'cartItems',
  timestamps: true,
})
export class CartItem extends Model<CartItem, CartItemCreationAttrs> {
  @ForeignKey(() => Cart)
  @Column
  cartId: number;

  @BelongsTo(() => Cart)
  cart: Cart;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId: number;

  @BelongsTo(() => Product)
  product: Product;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  quantity: number;
}
