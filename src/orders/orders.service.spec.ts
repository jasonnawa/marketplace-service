import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Order } from './models/order.model';
import { OrderItem } from './models/order-item.model';
import { OrderStatus } from './enums/order-status.enum';
import { Sequelize } from 'sequelize-typescript';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';

describe('OrderService', () => {
  let service: OrdersService;

const mockSequelize = {
  transaction: jest.fn(async (cb) => {
    const t = { commit: jest.fn(), rollback: jest.fn() };
    return cb(t);
  }),
};


  const mockCartService = {
    getCart: jest.fn(),
    clearCart: jest.fn(),
  };

  const mockProductService = {
    findByIdWithLock: jest.fn(),
  };

  const mockOrderModel = {
    create: jest.fn(),
  };

  const mockOrderItemModel = {
    bulkCreate: jest.fn(),
  };

  const mockTransaction = jest.fn((callback) =>
    callback({
      commit: jest.fn(),
      rollback: jest.fn(),
    }),
  );


beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      OrdersService,
      { provide: Sequelize, useValue: mockSequelize },
      { provide: getModelToken(Order), useValue: mockOrderModel },
      { provide: getModelToken(OrderItem), useValue: mockOrderItemModel },
      { provide: CartService, useValue: mockCartService },
      { provide: ProductsService, useValue: mockProductService },
    ],
  }).compile()

    service = module.get<OrdersService>(OrdersService);

    // reset mocks before each test
    jest.clearAllMocks();
  });

  it('should throw if cart is empty', async () => {
    mockCartService.getCart.mockResolvedValue({ data: { cart: { items: [] } } });

    await expect(service.createOrderFromCart(1)).rejects.toThrow(NotFoundException);
  });

  it('should throw if product is missing', async () => {
    mockCartService.getCart.mockResolvedValue({
      data: { cart: { items: [{ product: { id: 10 }, quantity: 1 }] } },
    });
    mockProductService.findByIdWithLock.mockResolvedValue(null);

    await expect(service.createOrderFromCart(1)).rejects.toThrow(NotFoundException);
  });

  it('should throw if stock is insufficient', async () => {
    const fakeProduct = {
      get: () => ({ id: 10, stock: 1, price: 100, name: 'Test' }),
    };
    mockCartService.getCart.mockResolvedValue({
      data: { cart: { items: [{ product: { id: 10 }, quantity: 5 }] } },
    });
    mockProductService.findByIdWithLock.mockResolvedValue(fakeProduct);

    await expect(service.createOrderFromCart(1)).rejects.toThrow(BadRequestException);
  });

  it('should create order, order items, and clear cart', async () => {
    const fakeProduct = {
      get: () => ({ id: 10, stock: 5, price: 100, name: 'Test' }),
      update: jest.fn().mockResolvedValue({}),
    };
    const fakeOrder = { id: 99, userId: 1 };
    const fakeCart = { id: 77, items: [{ product: { id: 10 }, quantity: 2 }] };

    mockCartService.getCart.mockResolvedValue({ data: { cart: fakeCart } });
    mockProductService.findByIdWithLock.mockResolvedValue(fakeProduct);
    mockOrderModel.create.mockResolvedValue(fakeOrder);
    mockOrderItemModel.bulkCreate.mockResolvedValue([]);
    mockCartService.clearCart.mockResolvedValue(undefined);

    jest.spyOn(service, 'getOneOrder').mockResolvedValue({
      success: true,
      message: 'Order created',
      data: {
        order: {
          id: 99,
          userId: 1,
          items: [],
          subtotal: 200,
          total: 220,
          tax: 20,
          status: OrderStatus.PLACED,
          createdAt: new Date()
        },
      }
    });

    const result = await service.createOrderFromCart(1);

    expect(mockProductService.findByIdWithLock).toHaveBeenCalledWith(10, expect.anything());
    expect(fakeProduct.update).toHaveBeenCalledWith({ stock: 3 }, expect.anything());
    expect(mockOrderModel.create).toHaveBeenCalled();
    expect(mockOrderItemModel.bulkCreate).toHaveBeenCalled();
    expect(mockCartService.clearCart).toHaveBeenCalledWith(77, expect.anything());

    expect(result.success).toBe(true);
    expect(result.data.order.total).toBe(220);
  });
});
