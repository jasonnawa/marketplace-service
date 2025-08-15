import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  firstname: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  lastname: string;

  @IsEmail()
  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'password123', description: 'User password with a minimum length of 6' })
  password: string;
}
