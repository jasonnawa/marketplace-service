import { Injectable } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custom.exception';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserDto } from './dto/user.dto';
import { GetUsersDataDto } from './dto/users-data.dto';
import { mapUserToDto } from './helpers/user-dto-mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) { }

  async create(dto: RegisterUserDto): Promise<User> {
    return this.userModel.create(dto);
  }

  async findAll(): Promise<{
    success: boolean;
    message: string;
    data: GetUsersDataDto
  }> {
    const users = await this.userModel.findAll({
      include: [{ all: true, nested: true }],
    });

    const userDtos = users.map(user => mapUserToDto(user));
    return { success: true, message: "successful", data: { users: userDtos } };
  }

  async findById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { email },
      attributes: [
        'id',
        'firstname',
        'lastname',
        'email',
        'password',
        'role',
        'createdAt',
        'updatedAt',
      ],
      include: { all: true, nested: true },
    });

    return user;
  }


}
