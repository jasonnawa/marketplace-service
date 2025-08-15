import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponseWrapper } from 'src/common/swagger/swagger-response';
import { LoginDataDto, RegisterUserDataDto } from './dto/data-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registers a user' })
  @ApiResponseWrapper(RegisterUserDataDto, 'Reigstered user')
  register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponseWrapper(LoginDataDto, 'token')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
