import { Module } from '@nestjs/common';
import { PassResetController } from './pass-reset.controller.js';
import { PassResetService } from './pass-reset.service.js';
import { PasswordResetMail, PasswordResetMailer } from './pass-reset.mailer.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../models/user.model.js';

@Module({
  imports:[SequelizeModule.forFeature([User])],
  controllers: [PassResetController],
  providers: [PassResetService,PasswordResetMailer]
})
export class PassResetModule {}
