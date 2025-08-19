import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/user.model';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.model';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/models/cart.model';
import { CartItem } from './cart/models/cart-item.model';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/models/order.model';
import { OrderItem } from './orders/models/order-item.model';
import taxOptionsConfig from './config/tax-options.config';
import appConfig from './config/app.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, taxOptionsConfig, appConfig],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: seconds(60),
        limit: 10,
      },
    ]),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db = configService.get('database');
        const app = configService.get('app');
        return {
          dialect: db.dialect,
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.name,
          autoLoadModels: true,
          synchronize: true,
          dialectOptions: {
            ssl: app.nodeEnv === 'production'
              ? { require: true, rejectUnauthorized: false }
              : false,
          },
          models: [User, Product, Cart, CartItem, Order, OrderItem],
        };
      },
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    CartModule,
    OrdersModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule { }
