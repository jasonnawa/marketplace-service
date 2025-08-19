import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getModelToken } from '@nestjs/sequelize';
import { CartItem } from './models/cart-item.model';

describe('CartService.addItem', () => {
  let service: CartService;
  let mockCartItemModel: any;
  let mockProductsService: any;

  const mockCart = { id: 1, items: [] };
  const mockProduct = { id: 10, stock: 5 };

  beforeEach(async () => {
    mockCartItemModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    mockProductsService = {
      getProductById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: getModelToken(CartItem), useValue: mockCartItemModel },
        { provide: 'ProductsService', useValue: mockProductsService },
      ],
    })
      .overrideProvider(CartService)
      .useValue({
        addItem: CartService.prototype.addItem,
        getCart: jest.fn().mockResolvedValue({
          data: { cart: mockCart },
          success: true,
        }),
        productsService: mockProductsService,
        cartItemModel: mockCartItemModel,
      })
      .compile();

    service = module.get<CartService>(CartService);
  });

  it('should throw NotFoundException if product does not exist', async () => {
    mockProductsService.getProductById.mockResolvedValue({ success: false });

    await expect(
      service.addItem(1, { productId: 99, quantity: 1 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should create a new cart item if none exists', async () => {
    mockProductsService.getProductById.mockResolvedValue({
      success: true,
      data: { product: mockProduct },
    });
    mockCartItemModel.findOne.mockResolvedValue(null);
    mockCartItemModel.create.mockResolvedValue({ id: 123 });

    await service.addItem(1, { productId: mockProduct.id, quantity: 2 });

    expect(mockCartItemModel.create).toHaveBeenCalledWith({
      cartId: mockCart.id,
      productId: mockProduct.id,
      quantity: 2,
    });
  });

  it('should throw BadRequestException if new quantity exceeds stock when creating', async () => {
    mockProductsService.getProductById.mockResolvedValue({
      success: true,
      data: { product: mockProduct },
    });
    mockCartItemModel.findOne.mockResolvedValue(null);

    await expect(
      service.addItem(1, { productId: mockProduct.id, quantity: 10 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update an existing cart item', async () => {
    mockProductsService.getProductById.mockResolvedValue({
      success: true,
      data: { product: mockProduct },
    });
    const existingItem = {
      get: () => ({ quantity: 2 }),
      update: jest.fn(),
    };
    mockCartItemModel.findOne.mockResolvedValue(existingItem);

    await service.addItem(1, { productId: mockProduct.id, quantity: 2 });

    expect(existingItem.update).toHaveBeenCalledWith({ quantity: 4 });
  });

  it('should throw BadRequestException if updated quantity exceeds stock', async () => {
    mockProductsService.getProductById.mockResolvedValue({
      success: true,
      data: { product: mockProduct },
    });
    const existingItem = {
      get: () => ({ quantity: 4 }),
      update: jest.fn(),
    };
    mockCartItemModel.findOne.mockResolvedValue(existingItem);

    await expect(
      service.addItem(1, { productId: mockProduct.id, quantity: 2 }),
    ).rejects.toThrow(BadRequestException);
  });
});
