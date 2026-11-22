import { IsInt, IsDateString } from "class-validator";

export class CreateBookingDto {
  @IsInt()
  carId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}