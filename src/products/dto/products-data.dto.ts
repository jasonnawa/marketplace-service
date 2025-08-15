import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class GetUnitProductDataDto {
  @ApiProperty({ type: ProductDto })
  product: ProductDto;
}

export class GetAllProductDataDto {
  @ApiProperty({ type: [ProductDto] })
  products: ProductDto[];

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;
}