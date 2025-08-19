import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { Order } from './order.model';
import { Product } from 'src/products/product.model';

export interface OrderItemCreationAttrs {
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}

@Table({ 
    tableName: 'orderItems',
    timestamps: false
 })
export class OrderItem extends Model<OrderItem, OrderItemCreationAttrs> {
  @ForeignKey(() => Order)
  @Column
  orderId: number;

  @BelongsTo(() => Order)
  order: Order;

  @ForeignKey(() => Product)
  @Column
  productId: number;

  @BelongsTo(() => Product)
  product: Product;

  @Column(DataType.INTEGER)
  quantity: number;

  @Column(DataType.FLOAT)
  price: number;
}
