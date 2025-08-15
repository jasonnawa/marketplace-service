import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Successful' })
  message?: string;

  @ApiPropertyOptional()
  data?: T;
}



export class GenericDataDto {

}
