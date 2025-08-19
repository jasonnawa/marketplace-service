import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { LoginDataDto, RegisterUserDataDto } from './dto/data-dto';
import { mapUserToDto } from 'src/users/helpers/user-dto-mapper';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterUserDto): Promise<{ success: boolean; message: string; data: RegisterUserDataDto; }> {
        try{
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

        const userDto = mapUserToDto(user)

        return {
            success: true,
            message: 'User registered successfully',
            data: { user: userDto },
        };
    }catch(err){
        console.error(err)
        throw(err)
    }
    }

    async login(dto: LoginDto): Promise<{ success: boolean; message: string; data: LoginDataDto; }> {
        try{
        const { email, password } = dto
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const parsedUser = mapUserToDto(user)
        const isPasswordValid = await bcrypt.compare(password, user.dataValues.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: parsedUser.id,
            email: parsedUser.email,
            role: parsedUser.role,
        };

        const token = await this.jwtService.signAsync(payload);

        

        return {
            success: true,
            message: 'Login successful',
            data: {
                user: parsedUser,
                access_token: token,
                expires_in: '30 days',
            },
        };
    }catch(err){
        console.error(err)
        throw(err)
    }
    }
}
