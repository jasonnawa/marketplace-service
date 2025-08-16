import { Injectable } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custom.exception';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserDto } from './dto/user.dto';
import { GetUsersDataDto } from './dto/users-data.dto';

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

    const userDtos = users.map(user => {
      const plainUser = user.get({ plain: true });

      return {
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
    });
    return { success: true, message: "successful", data: { users: userDtos } };
  }

  async findById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { email },
      attributes: ['id', 'firstname', 'lastname', 'email', 'password', 'role', 'createdAt', 'updatedAt'],
    });
    return user?.get({ plain: true }) || null;
  }

}
