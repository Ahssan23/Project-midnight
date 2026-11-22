import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../../models/user.model.js';
import { SignupDto } from '../../common/dto/signup.dto.js';
import { InjectModel } from '@nestjs/sequelize';
import  {hash} from "@node-rs/argon2";
import { EmailVerificationService } from '@nestjs/authentication';

@Injectable()
export class SignupService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,
        private readonly emailVerification:EmailVerificationService
    ){}

    async signup(dto:SignupDto){
        try{

            const hashed_pass = await hash(dto.password)
            
            
            const user = await this.userModel.create({
                role:dto.role,
                email:dto.email,
                password:hashed_pass,
                name:dto.name,
                phone:dto.phone,
                isVerified:false
            })

            await this.emailVerification.send({
                id:String(user.id),
                email:user.email
            })

            return {
                success:true,
                message:"Account created successfully"
            };
        }catch(err){
            console.log(err)
            throw new InternalServerErrorException({
                success:false,
                message:"something went wrong",
                code:"SIGNUP_FAILED"
            })
        }
    }
}
