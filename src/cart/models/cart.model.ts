import { Table, Column, Model, ForeignKey, BelongsTo, HasMany, DataType } from 'sequelize-typescript';
import { User } from 'src/users/user.model';
import { CartItem } from './cart-item.model';
import { CartItemCreationAttrs } from './cart-item.model';

export interface CartCreationAttrs {
  userId?: number;               
  items?: CartItemCreationAttrs[];
}


@Table({
  tableName: 'carts',
  timestamps: true,
})
export class Cart extends Model<Cart, CartCreationAttrs> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  userId?: number;

  @BelongsTo(() => User)
  user?: User;

  @HasMany(() => CartItem)
  items?: CartItem[];

   @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  })
  subtotal: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  })
  tax: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  })
  total: number;
}
