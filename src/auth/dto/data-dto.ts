import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';

export class RegisterUserDataDto {
    @ApiPropertyOptional({ type: UserDto })
    user?: UserDto;
}

export class LoginDataDto {
    @ApiProperty({ type: String })
    access_token: string;
    @ApiProperty({ type: String })
    expires_in: string
}