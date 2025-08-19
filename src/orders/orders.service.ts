import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order, OrderCreationAttrs } from './models/order.model';
import { OrderItem, OrderItemCreationAttrs } from './models/order-item.model';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/product.model';
import { GetUserOrdersDataDto, GetUserUnitOrderDataDto } from './dto/order-data.dto';
import { mapOrderToDto } from './helper/order-mapper.helper';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order) private orderModel: typeof Order,
        @InjectModel(OrderItem) private orderItemModel: typeof OrderItem,
        private readonly cartService: CartService,
    ) { }

    async getAllUsersOrders(userId: number): Promise<{ success: boolean, message: string, data: GetUserOrdersDataDto }> {
        let allOrdersInstance = await this.orderModel.findAll({
            where: { userId },
            include: [{ model: OrderItem, include: [Product] }],
            order: [['createdAt', 'DESC']],
        });

        const ordersDto = allOrdersInstance.map((order) =>{
            order = order.get({plain: true})
            return mapOrderToDto(order)
        })

        return { success: true, message: 'orders fetched successfully', data: { orders: ordersDto } }
    }

    async getOneOrder(userId: number, orderId: number): Promise<{ success: boolean, message: string, data: GetUserUnitOrderDataDto }> {
        const orderInstance = await this.orderModel.findOne({
            where: { id: orderId, userId },
            include: [{ model: OrderItem, include: [Product] }],
        });
        if (!orderInstance) throw new NotFoundException('Order not found');
        const order = orderInstance.get({ plain: true });

        const plainOrder = mapOrderToDto(order)
        return { success: true, message: 'order fetched successfully', data: { order: plainOrder } };
    }


    async createOrderFromCart(userId: number): Promise<{ success: boolean, message: string, data: GetUserUnitOrderDataDto }> {
        try {
            const cartResponse = await this.cartService.getCart(userId);
            const cart = cartResponse.data.cart;

            if (!cart.items || cart.items.length === 0) {
                throw new NotFoundException('Cart is empty');
            }

            let subtotal = 0;
            const orderItemsData: any[] = [];

            for (const item of cart.items) {
                subtotal += item.quantity * item.product.price;
                orderItemsData.push({
                    orderId: null, // placeholder
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price,
                });
            }

            const tax = parseFloat((subtotal * 0.1).toFixed(2));
            const total = subtotal + tax;

            const orderAttrs: OrderCreationAttrs = {
                userId,
                subtotal,
                tax,
                total,
            };
            const order = await this.orderModel.create(orderAttrs);

            const itemsToCreate = orderItemsData.map((i) => ({ ...i, orderId: order.id }));
            await this.orderItemModel.bulkCreate(itemsToCreate);

            // clear user's cart
            await this.cartService.clearCart(cart.id);

            return this.getOneOrder(userId, order.id);
        } catch (err) {
            console.error(err);
            throw new InternalServerErrorException('Failed to create order from cart');
        }
    }

}
