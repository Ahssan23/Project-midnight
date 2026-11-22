import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from '../models/booking.model.js';
import { JwtService } from '@nestjs/jwt';
import { CreateBookingDto } from '../common/dto/booking.dto.js';
import type { Request } from 'express';
import { BookingStatus } from '../models/booking.model.js';
import { Showroom } from '../models/showroom.model.js';

@Injectable()
export class BookingService {
    constructor(
        @InjectModel(Booking)
        private readonly bookingModel:typeof Booking,
        @InjectModel(Showroom)
        private readonly showroomModel: typeof Showroom,
        private jwt:JwtService

    ){}

    async booking(dto: CreateBookingDto  , req: Request){
        try{
            const userId = await this.jwt.decode(req.cookies?.access_token).id;
            const showroom = await this.showroomModel.findOne({
                where:{
                    userId:userId
                }
            })
            if(showroom != null){

                const booking = await this.bookingModel.create({
                    userId:userId,
                    carId:dto.carId,
                    startDate:dto.startDate,
                    endDate:dto.endDate,
                    bookingStatus:BookingStatus.PENDING,
                    showroomId:showroom?.id
                })
                return booking;
            }
        }
        catch(err){
            console.log(err);
            return false;
        }

    }

    async getBooking(req:Request){
        const userId = await this.jwt.decode(req.cookies?.access_token).id;

        const showroom = await this.showroomModel.findOne({
            where:{
                userId:userId
            }
        })

        const booking = await this.bookingModel.findAll({
            where:{
                showroomId:showroom?.id
            }
        })

        return booking;
    
    }
}
