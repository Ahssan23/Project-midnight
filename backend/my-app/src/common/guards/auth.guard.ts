import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt:JwtService){}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.access_token 
    
    if(!token){
      throw new UnauthorizedException();

    }
    try{
      const payload =  this.jwt.verify(token);
      (request as any).user = payload;


    }catch(err){
    
      return false;
    }
    

    return true;                                                                                       
  }

}