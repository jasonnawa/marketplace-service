import { IsEnum, IsOptional, IsString, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCategory } from '../enums/product-category.enum';

export class GetProductsQueryDto {
    @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
    @IsOptional()
    @Type(() => Number)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Items per page', example: 10, default: 10 })
    @IsOptional()
    @Type(() => Number)
    @Max(50, { message: 'Limit cannot exceed 50' })
    limit?: number = 10;

    @ApiPropertyOptional({ description: 'Search term for product name or description', example: 'iPhone' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by product category', example: 'Electronics' })
    @IsOptional()
    @IsEnum(ProductCategory, { message: 'Invalid category' })
    category?: ProductCategory;

    @ApiPropertyOptional({ description: 'Minimum price filter', example: 100 })
    @IsOptional()
    @Type(() => Number)
    minPrice?: number;

    @ApiPropertyOptional({ description: 'Maximum price filter', example: 1000 })
    @IsOptional()
    @Type(() => Number)
    maxPrice?: number;
}
