import { Table, Column, Model, ForeignKey, BelongsTo, HasMany, DataType } from 'sequelize-typescript';
import { User } from '../../users/user.model';
import { OrderItem } from './order-item.model';
import { OrderStatus } from '../enums/order-status.enum';

export interface OrderCreationAttrs {
    userId: number;
    subtotal: number;
    tax: number;
    total: number;
    status?: OrderStatus;
}

@Table({
    tableName: 'orders',
    timestamps: true
})
export class Order extends Model<Order, OrderCreationAttrs> {
    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @HasMany(() => OrderItem)
    items: OrderItem[];

    @Column(DataType.FLOAT)
    subtotal: number;

    @Column(DataType.FLOAT)
    tax: number;

    @Column(DataType.FLOAT)
    total: number;

    @Column({
        type: DataType.ENUM(...Object.values(OrderStatus)),
        defaultValue: OrderStatus.PLACED,
    })
    status: OrderStatus;
}
