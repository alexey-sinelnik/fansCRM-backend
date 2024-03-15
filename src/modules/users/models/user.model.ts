import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Users extends Model<Users> {
  @Column
  name: string;

  @Column
  email: string;

  @Column
  password: string;
}
