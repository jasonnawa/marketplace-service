import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { GetAllProductDataDto, GetUnitProductDataDto } from './dto/products-data.dto';
import { GetProductsQueryDto } from './dto/products-query.dto';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product) private productModel: typeof Product) { }

    async getProducts(query: GetProductsQueryDto): Promise<{ success: boolean, message: string, data: GetAllProductDataDto }> {
        try {
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
            order: [['createdAt', 'DESC']],
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
    } catch (error) {
            console.error('Error fetching products:', error);
            throw new Error('Failed to fetch products');
        }
    }
    async getProductById(id: number): Promise<{ success: boolean, message: string, data: GetUnitProductDataDto }> {
        const product = await this.productModel.findByPk(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return { success: true, message: 'successfully fetched product', data: { product } };
    }

    async getProductByIdOrUndefined(id: number) {
        const product = await this.productModel.findByPk(id);
        return product
    }



}
