import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { User } from '../../models/user.model.js';
 

@Injectable()
export class VerifyRoleService {

    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,
        private jwt:JwtService){}

    async VerifyRole(req:Request){
        try{

            const decoded = await this.jwt.decode(req.cookies?.access_token);

            const user = await this.userModel.findOne({
                where:{
                    id:decoded.id
                },
                
            })
            console.log(user?.role,'userrole')
            if(user?.role === "seller"){
                return true
            }
        else{

            return false;
        }
            
        }catch(err){
            return null;
        }
    }

}
