import {IsString, IsEmail} from "class-validator"


export class LoginDto{

    @IsString()
    email!:string;

   
    @IsString()
    password!:string;

}