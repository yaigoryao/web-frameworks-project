import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { OrderStatus } from './order-status.model';
import { Car } from './car.model';

@Table({ tableName: 'orders' })
export class Order extends Model<Order> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare totalPrice: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare description: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare startDate: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare endDate: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  declare plannedEndDate: Date;

  @ForeignKey(() => OrderStatus)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare orderStatusId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;
    
  @ForeignKey(() => Car)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare carId: number;

  @BelongsTo(() => OrderStatus, 'orderStatusId')
  declare orderStatus: OrderStatus;

  @BelongsTo(() => User, 'userId')
  declare user: User;

  @BelongsTo(() => Car, 'carId')
  declare car: Car;
}