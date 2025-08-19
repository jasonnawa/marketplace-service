import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { OrderItem } from './models/order-item.model';
import { ProductsModule } from 'src/products/products.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [SequelizeModule.forFeature([Order, OrderItem]), ProductsModule, CartModule],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
