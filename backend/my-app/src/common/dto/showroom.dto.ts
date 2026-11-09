import {IsString, IsEmail, Length, IsOptional} from "class-validator"


export class ShowroomDto{

    
    @IsString()
    ownerName!:string;

    @IsString()
    ShowroomName!:string;

    @IsString()
    password!:string;

}