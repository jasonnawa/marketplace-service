import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './models/cart.model';
import { CartItem } from './models/cart-item.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [SequelizeModule.forFeature([Cart, CartItem]), ProductsModule],
  controllers: [CartController],
  providers: [CartService],
  exports:[CartService]
})
export class CartModule {}
