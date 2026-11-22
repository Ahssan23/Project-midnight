import { Module } from '@nestjs/common';
import { BookingService } from './booking.service.js';
import { BookingController } from './booking.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from '../models/booking.model.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Showroom } from '../models/showroom.model.js';


@Module({
  imports:[
    JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '2h' },
          })
        })
          
          ,
    SequelizeModule.forFeature([Booking,Showroom])],
  providers: [BookingService,AuthGuard],
  controllers: [BookingController]
})
export class BookingModule {}
