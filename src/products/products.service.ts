
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { GetAllProductDataDto, GetUnitProductDataDto } from './dto/products-data.dto';
import { GetProductsQueryDto } from './dto/products-query.dto';
import { Op, Transaction } from 'sequelize';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product) private productModel: typeof Product) { }

    async getProducts(query: GetProductsQueryDto): Promise<{ success: boolean, message: string, data: GetAllProductDataDto }> {
        const { page = 1, limit = 10, search, category, minPrice, maxPrice } = query;
        const where: any = {};

        if (search) {
            where.name = { [Op.iLike]: `%${search}%` };
        }

        if (category && category.length > 0) {
            where.category = { [Op.in]: category };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) where.price[Op.gte] = minPrice;
            if (maxPrice !== undefined) where.price[Op.lte] = maxPrice;
        }

        const offset = (page - 1) * limit;

        const { rows: products, count: total } = await this.productModel.findAndCountAll({
            where,
            offset,
            limit,
            order: [['createdAt', 'DESC'], ['id', 'DESC']],
        });

        let data = {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        }

        return { success: true, message: 'successfully retrieved products', data };
    }
    async getProductById(id: number): Promise<{ success: boolean, message: string, data: GetUnitProductDataDto }> {
        const product = await this.productModel.findByPk(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return { success: true, message: 'successfully fetched product', data: { product: product.get({ plain: true }) } };
    }

    async getProductByIdOrUndefined(id: number) {
        const product = await this.productModel.findByPk(id);
        return product
    }

    async findByIdWithLock(productId: number, transaction?: Transaction): Promise<Product | null> {
        return this.productModel.findByPk(productId, {
            transaction,
            lock: transaction?.LOCK.UPDATE,
        });
    }

}
