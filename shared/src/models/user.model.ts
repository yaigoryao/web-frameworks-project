import { Table, Column, Model, DataType } from 'sequelize-typescript';

/**
 * User модель — используется в user-service и data-service
 * Таблица: users
 * Содержит основные данные пользователя
 */
@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare password: string | null;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  declare createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  declare updatedAt: Date;
}
