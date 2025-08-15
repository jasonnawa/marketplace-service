import { Table, Column, Model, DataType, DefaultScope } from 'sequelize-typescript';
import { UserRole } from './enums/user-role.enum';

export interface UserCreationAttrs {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: UserRole;
}

@DefaultScope(() => ({
  attributes: { exclude: ['password'] },
}))
@Table({
  tableName: 'users',
  timestamps: true, 
})
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstname: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastname: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.USER,
  })
  role: UserRole;
}