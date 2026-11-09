import {IsString, IsEmail, Length, IsOptional} from "class-validator"


export class SignupDto{

    
    @IsString()
    role!:string;

    
    @IsString()
    phone!:string;


    @IsEmail()
    email!:string;

    @IsString()
    name!:string;

    @IsString()

    password!:string;

}