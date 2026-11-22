import { Module } from '@nestjs/common';
import { SignupController } from './signup.controller.js';
import { SignupService } from './signup.service.js';
import { User } from '../../models/user.model.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { VerifyEmailMail,EmailVerificationMailer } from '../mail/verify-email.mail.js';

@Module({
  imports:[SequelizeModule.forFeature([User])],
  controllers: [SignupController],
  providers: [SignupService,VerifyEmailMail,EmailVerificationMailer]
})
export class SignupModule {}
