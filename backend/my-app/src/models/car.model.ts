import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

interface CarAttributes {

  id: number;
  carName:string,
  carRent:number,
  showroomId:number,
  available: boolean;
  
}

interface CarCreationAttributes extends Omit<CarAttributes, "id"> {}

@Table({
  tableName: "cars",
  timestamps: true,
})
export class Car extends Model<CarAttributes, CarCreationAttributes> {
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
  declare carName: string;


  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique:false
  })
  declare carRent: number;


   @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: false,
  })
  declare showroomId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false,
  })
  declare available: boolean;

  
}