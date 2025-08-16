import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CartItem } from './models/cart-item.model';
import { Cart } from './models/cart.model';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/product.model';
import { GetUnitCartDataDto } from './dto/cart-data.dto';
import { mapCartToDto } from './helper/cart-dto-mapper';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ReduceCartItemDto } from './dto/reduce-cart.dto';
import { CloneCartDto } from './dto/clone-cart.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart) private cartModel: typeof Cart,
        @InjectModel(CartItem) private cartItemModel: typeof CartItem,
        @Inject(ProductsService) private productsService: ProductsService,
    ) { }

    async getCart(userId: number): Promise<{ success: boolean; message: string; data: GetUnitCartDataDto }> {
        let cart = await this.cartModel.findOne({
            where: { userId },
            include: [{ model: CartItem, include: [Product] }],
        });

        if (!cart) {
            cart = await this.cartModel.create({ userId }, { include: [CartItem] });
        }

        const cartDto = mapCartToDto(cart);

        return {
            success: true,
            message: 'Cart fetched successfully',
            data: { cart: cartDto },
        };
    }

    async addItem(userId: number, dto: AddToCartDto): Promise<{ success: boolean; message: string; data: GetUnitCartDataDto }> {
        try {
            const getCartResponse = await this.getCart(userId)
            const cart = getCartResponse.data.cart
            const getProductResponse = await this.productsService.getProductById(dto.productId)
            if (!getProductResponse.success) throw new NotFoundException('Product not found')

            const existingItem = await this.cartItemModel.findOne({
                where: { cartId: cart.id, productId: dto.productId },
            });

            if (existingItem) {
                const plainItem = existingItem.get({ plain: true });
                await existingItem.update({
                    quantity: plainItem.quantity + dto.quantity,
                });
            } else {
                await this.cartItemModel.create({
                    cartId: cart.id,
                    productId: dto.productId,
                    quantity: dto.quantity,
                });
            }

            return this.getCart(userId);
        } catch (err) {
            throw new InternalServerErrorException('Failed to add item to cart');
        }
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

            await this.cartItemModel.destroy({ where: { cartId: cart.id } });

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


}
