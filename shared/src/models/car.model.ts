import { Table, Column, Model, DataType, HasMany, BelongsToMany } from 'sequelize-typescript';
import { User } from './user.model';
import { Order } from './order.model';
import { UserCar } from './user-car.model';

@Table({ tableName: 'cars' })
export class Car extends Model<Car> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare carNumber: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare modelName: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare vin: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare color: number;

  @HasMany(() => Order, 'carId')
  declare orders: Order[];

  @BelongsToMany(() => User, { through: () => UserCar })
  declare users: User[];
}