import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

interface UserAttributes {

  id: number;
  role:string,
  phone:string
  email: string;
  name: string;
  password: string;
}

interface UserCreationAttributes extends Omit<UserAttributes, "id"> {}

@Table({
  tableName: "users",
  timestamps: true,
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique:false
  })
  declare role: string;


  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique:false
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique:true
  })
  declare phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;
}