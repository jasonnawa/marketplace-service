import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponseWrapper } from 'src/common/swagger/swagger-response';
import { GetUsersDataDto } from './dto/users-data.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponseWrapper(GetUsersDataDto, 'List of users')
  findAll() {
    return this.usersService.findAll();
  }

}
