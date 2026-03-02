import { Table, Column, Model, DataType, HasOne, ForeignKey, BelongsTo, BelongsToMany, HasMany } from 'sequelize-typescript';
import { Role } from './role.model';
import { UserCar } from './user-car.model';
import { Car } from './car.model';
import { Order } from './order.model';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare login: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;
 
  @Column({ type: DataType.STRING, allowNull: false })
  declare salt: string;
  
  @Column({ type: DataType.STRING, allowNull: false })
  declare refreshToken: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;

  @Column({ type: DataType.STRING, allowNull: false })
  declare surname: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare patronymic: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare phoneNumber: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare roleId: number;

  @BelongsTo(() => Role, 'roleId')
  declare role: Role;

  @BelongsToMany(() => Car, () => UserCar)
  declare cars: Car[];

  @HasMany(() => Order, 'userId')
  declare orders: Order[];
}
//   @Column({ type: DataType.STRING, allowNull: false })
//   declare email: string;

//   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
//   declare createdAt: Date;

//   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
//   declare updatedAt: Date;
