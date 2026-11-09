import { Module } from '@nestjs/common';
import { CarService } from './car.service.js';
import { CarController } from './car.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../models/user.model.js';
import { Car } from '../../models/car.model.js';
import { Showroom } from '../../models/showroom.model.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { CarGuard } from '../../common/guards/car.guard.js';


@Module({
  imports:[
    JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '2h' },
          })
        }),
        SequelizeModule.forFeature([Car,Showroom,User])
  ],
  providers: [CarService,AuthGuard,CarGuard ],
  controllers: [CarController]
})
export class CarModule {}
