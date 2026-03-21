import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Order } from './order.model';

@Table({ tableName: 'order_statuses' })
export class OrderStatus extends Model<OrderStatus> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare orderStatusName: string;

  @HasMany(() => Order, 'orderStatusId')
  declare orders: Order[];
}