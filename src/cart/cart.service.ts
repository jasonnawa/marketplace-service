import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CartItem } from './models/cart-item.model';
import { Cart } from './models/cart.model';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/product.model';
import { GetUnitCartDataDto } from './dto/cart-data.dto';
import { mapCartToDto } from './helper/cart-dto-mapper';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ReduceCartItemDto } from './dto/reduce-cart.dto';
import { CloneCartDto } from './dto/clone-cart.dto';
import { ConfigService } from '@nestjs/config';
import { Transaction } from 'sequelize';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart) private cartModel: typeof Cart,
        @InjectModel(CartItem) private cartItemModel: typeof CartItem,
        @Inject(ProductsService) private productsService: ProductsService,
        @Inject(ConfigService) private configService: ConfigService,
    ) { }

    async getCart(userId: number): Promise<{ success: boolean; message: string; data: GetUnitCartDataDto }> {
        let cart = await this.cartModel.findOne({
            where: { userId },
            include: [{ model: CartItem, include: [Product] }],
        });

        if (!cart) {
            cart = await this.cartModel.create({ userId }, { include: [CartItem] });
        }

        const plainCart = cart.get({ plain: true });
        let subtotal = 0;
        if (plainCart.items && plainCart.items.length > 0) {
            for (const item of plainCart.items) {
                if (item.product) {
                    subtotal += item.product.price * item.quantity;
                }
            }
        }

        const taxRate = this.configService.get<number>('taxOptions.taxRate') || 0.1;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        // Persist totals in the cart model
        await cart.update({ subtotal, tax, total });

        const cartDto = mapCartToDto(cart);

        return {
            success: true,
            message: 'Cart fetched successfully',
            data: { cart: cartDto },
        };
    }

    async addItem(userId: number, dto: AddToCartDto): Promise<{ success: boolean; message: string; data: GetUnitCartDataDto }> {
        const getCartResponse = await this.getCart(userId)
        const cart = getCartResponse.data.cart
        const getProductResponse = await this.productsService.getProductById(dto.productId)
        if (!getProductResponse.success) throw new NotFoundException('Product not found')

        const existingItem = await this.cartItemModel.findOne({
            where: { cartId: cart.id, productId: dto.productId },
        });

        const product = getProductResponse.data.product;
        if (existingItem) {
            const plainItem = existingItem.get({ plain: true });

            // validate quantity not exceeding product stock
            if (plainItem.quantity + dto.quantity > product.stock) {
                throw new BadRequestException('Quantity exceeds available stock');
            }

            await existingItem.update({
                quantity: plainItem.quantity + dto.quantity,
            });
        } else {
            // validate quantity not exceeding product stock
            if (dto.quantity > product.stock) {
                throw new BadRequestException('Quantity exceeds available stock');
            }
            await this.cartItemModel.create({
                cartId: cart.id,
                productId: dto.productId,
                quantity: dto.quantity,
            });
        }

        return this.getCart(userId);
    }

    async reduceItem(
        userId: number,
        dto: ReduceCartItemDto,
    ): Promise<{ success: boolean; message: string; data: GetUnitCartDataDto }> {
        try {
            const getCartResponse = await this.getCart(userId);
            const cart = getCartResponse.data.cart;

            const existingItem = await this.cartItemModel.findOne({
                where: { cartId: cart.id, productId: dto.productId },
            });

            if (!existingItem) {
                throw new NotFoundException('Item not found in cart');
            }

            const plainItem = existingItem.get({ plain: true });
            const newQuantity = plainItem.quantity - dto.quantity;

            if (newQuantity <= 0) {
                await existingItem.destroy();
            } else {
                await existingItem.update({ quantity: newQuantity });
            }

            return this.getCart(userId);
        } catch (err) {
            throw new InternalServerErrorException('Failed to reduce item from cart');
        }
    }

    async removeItem(userId: number, productId: number): Promise<{ success: boolean; message: string; data: GetUnitCartDataDto }> {
        try {
            const getCartResponse = await this.getCart(userId)
            const cart = getCartResponse.data.cart
            await this.cartItemModel.destroy({
                where: { cartId: cart.id, productId },
            });
            return this.getCart(userId);
        } catch (err) {
            throw new InternalServerErrorException('Failed to remove item from cart');
        }
    }

    async cloneCart(
        userId: number,
        dto: CloneCartDto,
    ): Promise<{ success: boolean; message: string; data: GetUnitCartDataDto }> {
        try {
            const getCartResponse = await this.getCart(userId);
            const cart = getCartResponse.data.cart;

            await this.clearCart(cart.id)

            let itemsToCreate: any = [];
            for (const item of dto.items) {
                const getProductResponse = await this.productsService.getProductByIdOrUndefined(item.productId)
                if (!getProductResponse) continue

                itemsToCreate.push({
                    cartId: cart.id,
                    productId: item.productId,
                    quantity: item.quantity,
                });
            }

            if (itemsToCreate.length > 0) {
                await this.cartItemModel.bulkCreate(itemsToCreate);
            }

            return this.getCart(userId);
        } catch (err) {
            console.error(err)
            throw new InternalServerErrorException('Failed to clone cart');
        }
    }

    async clearCart(cartId: number, transaction?: Transaction): Promise<number> {
        return this.cartItemModel.destroy({ where: { cartId }, transaction });
    }

}
