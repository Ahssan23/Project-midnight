import { Module } from '@nestjs/common';
import { SignupController } from './signup.controller.js';
import { SignupService } from './signup.service.js';
import { User } from '../models/user.model.js';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports:[SequelizeModule.forFeature([User])],
  controllers: [SignupController],
  providers: [SignupService]
})
export class SignupModule {}
