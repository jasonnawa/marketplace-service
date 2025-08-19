import { ApiProperty } from "@nestjs/swagger";
import { OrderDto } from "./order.dto";

export class GetUserOrdersDataDto {
    @ApiProperty({ type: [OrderDto], description: 'List of user orders' })
    orders: OrderDto[];
}

export class GetUserUnitOrderDataDto {
    @ApiProperty({ type: OrderDto, description: 'Specific user order' })
    order: OrderDto;
}