import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'An error has occurred' })
  message: string;

  @ApiProperty({ example: {}, nullable: true })
  data: Record<string, any> | null;
}
