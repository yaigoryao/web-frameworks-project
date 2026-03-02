import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'roles' })
export class Role extends Model<Role> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare roleName: string;

  @HasMany(() => User, 'roleId')
  declare users: User[];
}