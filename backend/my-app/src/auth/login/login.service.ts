import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../../models/user.model.js';
import { LoginDto } from '../../common/dto/login.dto.js';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { verify } from '@node-rs/argon2';
import { JwtService } from '@nestjs/jwt';
import { PasswordHasher } from '@nestjs/authentication';

@Injectable()
export class LoginService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,
         private readonly jwt:JwtService,
        private readonly passwordHasher:PasswordHasher){}

    async login(dto:LoginDto){
        try {
            
            
            const user = await this.userModel.findOne({
                where:{
                    [Op.or]:[
                        {email:dto.email},
                        {name:dto.email}
                    ]
                }
                
            })
            if(user != null){

const verify_pass = user.password.startsWith('$argon2') ? await verify(user.password, dto.password) : await this.passwordHasher.verify(dto.password, user.password);                if(verify_pass === true){
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
                    console.log('wrong password')
                    return {
                        status:401,
                        message:"wrong password, try again"
                    }
                }
            }else{

                console.log('accoutn not found')
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
