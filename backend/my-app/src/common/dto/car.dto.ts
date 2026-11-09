import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsInt,
} from 'class-validator';

export class carDto {
  @IsString()
  @IsNotEmpty()
  carName: string;

  @IsInt()
  @IsNotEmpty()
  carRent: number;

  @IsBoolean()
  available: boolean;


}