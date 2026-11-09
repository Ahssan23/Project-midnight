import { Injectable, CanActivate, ExecutionContext,UnauthorizedException } from "@nestjs/common";
import  { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { User } from "../../models/user.model.js";
import { InjectModel } from "@nestjs/sequelize";



@Injectable()
export class ShowroomGuard implements CanActivate{

    constructor(
        @InjectModel(User)
        private userModel :typeof User,
        private jwt:JwtService){}
    async canActivate(context: ExecutionContext):   Promise<boolean>  {
        try{

            const request = context.switchToHttp().getRequest<Request>();
            const token= request.cookies?.access_token;
            // console.log(request)
            const decoded_token = await this.jwt.verify(token);

        // checking user type 
        const checkUser = await this.userModel.findOne({
            where:{
                id:decoded_token.id
            }
        })
        
        switch (checkUser?.role){
            case "seller":
            return true;

            case "buyer":
            return false;
        }
        
        return true
    }
    catch(err){
    return false;
    }
    }
}