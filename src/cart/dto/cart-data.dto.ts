import { ApiProperty } from '@nestjs/swagger';
import { CartDto } from './cart.dto';

export class GetUnitCartDataDto {
  @ApiProperty({ type: CartDto })
  cart: CartDto;
}
