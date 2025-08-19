import { Injectable, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order, OrderCreationAttrs } from './models/order.model';
import { OrderItem } from './models/order-item.model';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/product.model';
import { GetUserOrdersDataDto, GetUserUnitOrderDataDto } from './dto/order-data.dto';
import { mapOrderToDto } from './helper/order-mapper.helper';
import { Sequelize } from 'sequelize-typescript';
import { ProductsService } from '../products/products.service';
import { Transaction } from 'sequelize';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order) private orderModel: typeof Order,
        @InjectModel(OrderItem) private orderItemModel: typeof OrderItem,
        @Inject(ProductsService) private productService: ProductsService,
        private readonly sequelize: Sequelize,
        private readonly cartService: CartService,
    ) { }

    async getAllUsersOrders(userId: number): Promise<{ success: boolean, message: string, data: GetUserOrdersDataDto }> {
        let allOrdersInstance = await this.orderModel.findAll({
            where: { userId },
            include: [{ model: OrderItem, include: [Product] }],
            order: [['createdAt', 'DESC']],
        });

        const ordersDto = allOrdersInstance.map((order) => {
            order = order.get({ plain: true })
            return mapOrderToDto(order)
        })

        return { success: true, message: 'orders fetched successfully', data: { orders: ordersDto } }
    }

    async getOneOrder(userId: number, orderId: number, transaction?: Transaction): Promise<{ success: boolean, message: string, data: GetUserUnitOrderDataDto }> {
        const orderInstance = await this.orderModel.findOne({
            where: { id: orderId, userId },
            include: [{ model: OrderItem, include: [Product] }],
            transaction
        });
        if (!orderInstance) throw new NotFoundException('Order not found');
        const order = orderInstance.get({ plain: true });

        const plainOrder = mapOrderToDto(order)
        return { success: true, message: 'order fetched successfully', data: { order: plainOrder } };
    }



    async createOrderFromCart(
        userId: number,
    ): Promise<{ success: boolean; message: string; data: GetUserUnitOrderDataDto }> {

        return this.sequelize.transaction(async (t) => {
            const cartResponse = await this.cartService.getCart(userId);
            const cart = cartResponse.data.cart;

            if (!cart.items || cart.items.length === 0) {
                throw new NotFoundException('Cart is empty');
            }

            let subtotal = 0;
            const orderItemsData: any[] = [];

            for (const item of cart.items) {
                const product = await this.productService.findByIdWithLock(item.product.id, t);

                if (!product) {
                    throw new NotFoundException(`Product ${item.product.id} not found`);
                }

                const plainProduct = product.get({ plain: true });

                // Validate stock
                if (item.quantity > plainProduct.stock) {
                    throw new BadRequestException(
                        `Not enough stock for ${product.name}. Available: ${product.stock}`,
                    );
                }

                // Deduct stock
                const newStock = plainProduct.stock - item.quantity;
                const updatedProduct = await product.update({ stock: newStock }, { transaction: t });

                subtotal += item.quantity * plainProduct.price;
                orderItemsData.push({
                    orderId: null, // placeholder
                    productId: plainProduct.id,
                    quantity: item.quantity,
                    price: plainProduct.price,
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

            // Create order in same transaction
            const order = await this.orderModel.create(orderAttrs, { transaction: t });

            // Create order items
            const itemsToCreate = orderItemsData.map((i) => ({ ...i, orderId: order.id }));
            await this.orderItemModel.bulkCreate(itemsToCreate, { transaction: t });

            // Clear cart
            await this.cartService.clearCart(cart.id, t);

            return this.getOneOrder(userId, order.id, t);
        });
    }

}
