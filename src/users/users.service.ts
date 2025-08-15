import { Injectable } from '@nestjs/common';
import { CustomHttpException } from 'src/common/exceptions/custom.exception';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) { }

  async create(dto: RegisterUserDto): Promise<User> {
    return this.userModel.create(dto);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
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
