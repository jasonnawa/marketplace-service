import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWrapper } from 'src/common/swagger/swagger-response';
import { GetUnitCartDataDto } from './dto/cart-data.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ReduceCartItemDto } from './dto/reduce-cart.dto';
import { CloneCartDto } from './dto/clone-cart.dto';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @ApiBearerAuth('access-token')
    @Get()
    @ApiOperation({ summary: 'Get\s a user\s cart. If none, it creates one' })
    @ApiResponseWrapper(GetUnitCartDataDto, 'user\s cart')
    getCart(@Req() req) {
        return this.cartService.getCart(req.user.id);
    }

    @ApiBearerAuth('access-token')
    @Post('add')
    @ApiOperation({ summary: 'Adds an item to the cart or increments an already existing item in the cart' })
    @ApiResponseWrapper(GetUnitCartDataDto, 'user\s cart')
    addItem(@Req() req, @Body() dto: AddToCartDto) {
        return this.cartService.addItem(req.user.id, dto);
    }

    @ApiBearerAuth('access-token')
    @Post('reduce')
    @ApiOperation({ summary: 'Reduces an item in the cart or completely removes it if the quantity is <= 0' })
    @ApiResponseWrapper(GetUnitCartDataDto, 'user\s cart')
    reduceItem(@Req() req, @Body() dto: ReduceCartItemDto) {
        return this.cartService.reduceItem(req.user.id, dto);
    }

    @ApiBearerAuth('access-token')
    @Post('clone')
    @ApiOperation({ summary: 'Clones a guest cart after getting authenticated' })
    @ApiResponseWrapper(GetUnitCartDataDto, 'user\s cart')
    cloneCart(@Req() req, @Body() dto: CloneCartDto) {
        return this.cartService.cloneCart(req.user.id, dto);
    }

    @ApiBearerAuth('access-token')
    @Delete(':productId')
    @ApiOperation({ summary: 'Delete\'s an item from the cart' })
    @ApiResponseWrapper(GetUnitCartDataDto, 'user\s cart')
    removeItem(@Req() req, @Param('productId') productId: number) {
        return this.cartService.removeItem(req.user.id, productId);
    }
}
