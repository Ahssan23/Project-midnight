import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Showroom } from '../../models/showroom.model.js';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../models/user.model.js';

@Injectable()
export class CarGuard implements CanActivate {
    constructor(
      private jwt:JwtService,
      @InjectModel(Showroom)
      private showroomModel:typeof Showroom ,
      @InjectModel(User)
    private userModel:typeof User){}
 async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.access_token 
    
    if(!token){
      throw new UnauthorizedException();
      
    }
    try{
      const payload =  this.jwt.verify(token);
      (request as any).user = payload;
      
      const checkUser = await this.userModel.findOne({
        where:{email:payload.email}
      })
      const role = checkUser?.role;

      // checking role
      switch(role){
        case "seller":
          const checkShowroom = await this.showroomModel.findOne({
            where:{
              userId:checkUser?.id
            }
          })
          console.log(checkShowroom,'CHECKSHOWROOM')
          if(checkShowroom !== null){
            return true;
          }
          return false;

        case "buyer":
          return false;
      }

      return false;

    }catch(err){
      console.log(err)
      return false;
    }
    

    return true;                                                                                       
  }

}