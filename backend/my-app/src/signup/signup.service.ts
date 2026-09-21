import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../models/user.model.js';
import { SignupDto } from '../dto/signup.dto.js';
import { InjectModel } from '@nestjs/sequelize';
import  {hash} from "@node-rs/argon2";

@Injectable()
export class SignupService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User){}

    async signup(dto:SignupDto){
        try{

            const hashed_pass = await hash(dto.password)
            
            
            await this.userModel.create({
                role:dto.role,
                email:dto.email,
                password:hashed_pass,
                name:dto.name,
                phone:dto.phone
            })
            return {
                success:true,
                message:"Account created successfully"
            };
        }catch(err){
            throw new InternalServerErrorException({
                success:false,
                message:"something went wrong",
                code:"SIGNUP_FAILED"
            })
        }
    }
}
