import { Table, Column, Model, DataType, HasMany, ForeignKey } from 'sequelize-typescript';
import { User } from './user.model';
import { Car } from './car.model';

@Table({ tableName: 'users_cars' })
export class UserCar extends Model<UserCar> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false })
  declare userId: number;

  @ForeignKey(() => Car)
  @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false })
  declare carId: number;
}