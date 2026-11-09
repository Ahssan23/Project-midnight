import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Car } from '../../models/car.model.js';
import { carDto } from '../../common/dto/car.dto.js';
import { Showroom } from '../../models/showroom.model.js';
import { JwtService } from '@nestjs/jwt';
import type {Request } from 'express';


@Injectable()
export class CarService {
    constructor(
        @InjectModel(Car)
        private readonly carModel:typeof Car,
        @InjectModel(Showroom)
        private readonly showroomModel:typeof Showroom,
        private jwtService:JwtService
    ){}

    async registerCar(dto:carDto,req:Request){
        try{

            const cookie = req.cookies?.access_token;
            const token= await this.jwtService.decode(cookie);
            const showroom = await this.showroomModel.findOne({
            where:{
                userId:token.id
            }
        })

        if(showroom){

            const car =  await this.carModel.create({
                 carName:dto.carName,
                 carRent:dto.carRent,
                 showroomId:showroom?.id,
                 available:true
             })
             return true;
        }
        else{
            return false;
        }
        }catch(err){
            console.log(err);
            return false;
        }
    }

    async getCar(req:Request){

        const cookie = req.cookies?.access_token;
        const jwt = await this.jwtService.decode(cookie);

        const showroom = await this.showroomModel.findOne({
            where:{
                userId:jwt.id
            }
        })
        if(showroom ){
            const car = await this.carModel.findAll({
                where:{
                    showroomId:showroom?.id
                }
            })
            console.log(showroom?.id,'==========-------DFASFADFAD')

            return car;
            
        }else{
            return false;
        }

    }
}
