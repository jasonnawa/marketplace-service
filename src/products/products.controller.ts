import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponseWrapper } from 'src/common/swagger/swagger-response';
import { Public } from 'src/common/decorators/public.decorator';
import { GetAllProductDataDto, GetUnitProductDataDto } from './dto/products-data.dto';
import { GetProductsQueryDto } from './dto/products-query.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get paginated products(catalogue)' })
    @ApiResponseWrapper(GetAllProductDataDto, 'paginaiton, products data')
    async getProducts(@Query() query: GetProductsQueryDto) {
        return this.productsService.getProducts(query);
    }


    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get specific product' })
    @ApiResponseWrapper(GetUnitProductDataDto, 'Specific Product')
    async getProduct(@Param('id', ParseIntPipe) id: number) {
        return await this.productsService.getProductById(id);
    }
}
