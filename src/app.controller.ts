import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';
import { ApiResponseWrapper } from './common/swagger/swagger-response';
import { ApiResponseDto, GenericDataDto } from './common/dto/api-response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Public()
  @Get()
  @ApiOperation({ summary: 'test' })
  @ApiResponseWrapper(GenericDataDto, 'hello message')
  getHello() {
    return this.appService.getHello();
  }
}
