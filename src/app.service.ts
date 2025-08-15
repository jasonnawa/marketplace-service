import { Injectable } from '@nestjs/common';
import { GenericDataDto } from './common/dto/api-response.dto';

@Injectable()
export class AppService {
  getHello(): { success: boolean, message: string , data: GenericDataDto} {
    return { success: true, message: 'Hello World!', data: {} };
  }
}
