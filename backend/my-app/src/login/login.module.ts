import { Module } from '@nestjs/common';
import { LoginController } from './login.controller.js';
import { LoginService } from './login.service.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/user.model.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';



@Module({
  imports:[JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: '2h' },
  }),
}),
  
    SequelizeModule.forFeature([User])],
  controllers: [LoginController],
  providers: [LoginService]
})
export class LoginModule {}
