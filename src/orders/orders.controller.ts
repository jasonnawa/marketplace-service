import { Controller, Get, Post, Param, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { GetUserOrdersDataDto, GetUserUnitOrderDataDto } from './dto/order-data.dto';
import { ApiResponseWrapper } from 'src/common/swagger/swagger-response';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get()
    @ApiOperation({ summary: 'Gets all user orders' })
    @ApiResponseWrapper(GetUserOrdersDataDto, 'List of user orders')
    async getAllOrders(@Req() req) {
        return this.ordersService.getAllUsersOrders(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Gets a single user order' })
    @ApiResponseWrapper(GetUserUnitOrderDataDto, 'Specific user order')
    async getOneOrder(@Req() req, @Param('id') id: number) {
        return this.ordersService.getOneOrder(req.user.id, +id);
    }

    @Post('checkout')
    @ApiOperation({ summary: 'Checks out a user\s cart' })
    @ApiResponseWrapper(GetUserUnitOrderDataDto, 'checkout user\s cart')
    async createOrder(@Req() req) {
        return await this.ordersService.createOrderFromCart(req.user.id);
    }

}
