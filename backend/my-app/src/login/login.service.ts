import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../models/user.model.js';
import { LoginDto } from '../dto/login.dto.js';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { verify } from '@node-rs/argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User, private readonly jwt:JwtService){}

    async login(dto:LoginDto){
        try {
            
            
            const user = await this.userModel.findOne({
                where:{
                    [Op.or]:[
                        {email:dto.email},
                        {phone:dto.email}
                    ]
                }
                
            })
            if(user != null){

                const verify_pass =await verify(user.password, dto.password);
                if(verify_pass === true){
                    const payload = {
                        id:user.id,
                        email:user.email
                    }
                    const jwt_token = this.jwt.sign(payload)
                    return {status:200,
                        message:"Login successfull",
                        jwt_token
                    }
                }
                else{
                    return {
                        status:401,
                        message:"wrong password, try again"
                    }
                }
            }else{

                return {
                    status:401,
                    message:"Account not found."
                }
            }
            
            
        } catch (error) {
            console.log(error)
         return {
            status:500,
            message:"Internal server error"
         } 
        }
        // return dto;
    }
}
