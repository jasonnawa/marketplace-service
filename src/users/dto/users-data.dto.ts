import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class GetUsersDataDto {
  @ApiProperty({ type: [UserDto] })
  users: UserDto[];
}
