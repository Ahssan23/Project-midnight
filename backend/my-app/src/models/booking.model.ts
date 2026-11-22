import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
} from "sequelize-typescript";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

interface BookingAttributes {
  id: number;
  carId: number;
  userId: number;
  showroomId:number;
  startDate: string;
  endDate: string;
  bookingStatus: BookingStatus;
}

interface BookingCreationAttributes
  extends Omit<BookingAttributes, "id" | "bookingStatus"> {
  bookingStatus?: BookingStatus;
}

@Table({
  tableName: "bookings",
  timestamps: true,
})
export class Booking extends Model<BookingAttributes, BookingCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare carId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;
  
  @Column({type :DataType.INTEGER, allowNull:false})
  declare showroomId:number;


  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare startDate: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare endDate: string;

  @Column({
    type: DataType.ENUM(...Object.values(BookingStatus)),
    allowNull: false,
    defaultValue: BookingStatus.PENDING,
  })
  declare bookingStatus: BookingStatus;
}