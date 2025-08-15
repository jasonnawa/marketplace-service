import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory } from '../enums/product-category.enum';

export class ProductDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Apple iPhone 15' })
  name: string;

  @ApiProperty({ example: 'The latest iPhone with improved camera and battery life.' })
  description: string;

  @ApiProperty({ example: 999.99 })
  price: number;

  @ApiProperty({ example: 100 })
  stock: number;

  @ApiProperty({ example: 'Electronics' })
  category: ProductCategory;

  @ApiProperty({ example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'], type: [String] })
  images: string[];
}
