import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

interface ShowroomAttributes {

  id: number;
  OwnerName:string,
  userId: number;
  ShowroomName: string;
  password: string;
}

interface ShowroomCreationAttributes extends Omit<ShowroomAttributes, "id"> {}

@Table({
  tableName: "showroom",
  timestamps: true,
})
export class Showroom extends Model<ShowroomAttributes, ShowroomCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique:true
  })
  declare userId: number;




  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare ShowroomName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique:false
  })
  declare OwnerName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;
}