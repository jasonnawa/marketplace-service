import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { LoginDataDto, RegisterUserDataDto } from './dto/data-dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterUserDto): Promise<{ success: boolean; message: string; data: RegisterUserDataDto; }> {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new BadRequestException('Email is already taken');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        let user = await this.usersService.create({
            firstname: dto.firstname,
            lastname: dto.lastname,
            email: dto.email,
            password: hashedPassword,
        });

        // Handle failure
        if (!user) {
            return { success: false, message: 'Error registering user', data: {} };
        }

        // Convert user to plain object
        const plainUser = user.get({ plain: true });

        // Map nested cart to match CartDto
        const userDto = {
            ...plainUser,
            cart: plainUser.cart
                ? {
                    id: plainUser.cart.id,      
                    userId: plainUser.cart.userId,
                    items: plainUser.cart.items?.map(item => ({
                        id: item.id,
                        product: item.product,     
                        quantity: item.quantity,
                    })) || [],
                }
                : undefined,
        };

        return {
            success: true,
            message: 'User registered successfully',
            data: { user: userDto },
        };
    }

    async login(dto: LoginDto): Promise<{ success: boolean; message: string; data: LoginDataDto; }> {
        const { email, password } = dto
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const token = await this.jwtService.signAsync(payload);

        return {
            success: true,
            message: 'Login successful',
            data: {
                access_token: token,
                expires_in: '30 days',
            },
        };
    }
}
