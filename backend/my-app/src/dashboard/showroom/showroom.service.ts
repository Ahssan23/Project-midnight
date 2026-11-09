import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Showroom } from '../../models/showroom.model.js';
import { ShowroomDto } from '../../common/dto/showroom.dto.js';
import { hash } from '@node-rs/argon2';
import { JwtService } from '@nestjs/jwt';
import { UniqueConstraintError } from 'sequelize';
import type { Request } from 'express';


@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Showroom)
    private readonly showroomModel: typeof Showroom,
    private jwt: JwtService,
  ) {}

  async registerShowroom(dto: ShowroomDto,req:Request) {
    try {
      const cookie = req.cookies.access_token;
      const user_id = await this.jwt.decode(cookie);
      const hashed_password = await hash(dto.password);

     return await this.showroomModel.create({
        OwnerName: dto.ownerName,
        ShowroomName: dto.ShowroomName,
        password: hashed_password,
        userId: user_id.id,
      });
      
    } catch (err) {
      console.log(err)
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException('This user already has a showroom');
      }

      throw new InternalServerErrorException(
        'some error occured, try again later',
      );
    }
    return dto;
  }

  async getShowroom(req: Request) {
    try{

      const cookie = req.cookies?.access_token;
      const token = await this.jwt.decode(cookie);
      console.log(token)
      const showroom = await this.showroomModel.findOne({
        where:{
          userId:token.id
        }
      })
      console.log(showroom)
      if(showroom === null || undefined){
        return false;
      }
      else {
        return showroom
      }
    }catch(err){
      console.log(err)
      return false;
    }
  }
  


  async getShowroomId(id:any) {
    try{
      const showroom = await this.showroomModel.findOne({
        where:{
          id:id
        }
      })
      console.log(showroom)
      return showroom;

  }catch(err){
    console.log(err)
    return false;
  }

  }
}
