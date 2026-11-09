import { Module } from '@nestjs/common';
import { DashboardController } from './showroom.controller.js';
import { DashboardService } from './showroom.service.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Showroom } from '../../models/showroom.model.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ShowroomGuard } from '../../common/guards/showroom.guard.js';
import { User } from '../../models/user.model.js';


@Module({
  imports:[
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '2h' },
      })
    }),
    SequelizeModule.forFeature([Showroom, User])],
  controllers: [DashboardController],
  providers: [DashboardService, ShowroomGuard]
})
export class DashboardModule {}
