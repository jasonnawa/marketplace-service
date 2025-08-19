import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderStatus } from './enums/order-status.enum';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    createOrderFromCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: OrdersService, useValue: mockOrdersService },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should checkout cart and return order response', async () => {
    const mockResponse = {
      success: true,
      message: 'Order created',
      data: {
        order: {
          id: 101,
          userId: 5,
          items: [],
          subtotal: 100,
          tax: 10,
          total: 110,
          status: OrderStatus.PLACED,
          createdAt: new Date(),
        },
      },
    };

    (service.createOrderFromCart as jest.Mock).mockResolvedValue(mockResponse);

    const req = { user: { id: 5 } };
    const result = await controller.createOrder(req);

    expect(service.createOrderFromCart).toHaveBeenCalledWith(5);
    expect(result).toEqual(mockResponse);
  });
});
