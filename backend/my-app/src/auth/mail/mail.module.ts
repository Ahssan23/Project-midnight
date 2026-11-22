import { Module } from '@nestjs/common';
import { EmailVerificationMailer, VerifyEmailMail } from './verify-email.mail.js';
import { AuthenticationRegistry } from '@nestjs/authentication';
import { MailController } from './mail.controller.js';
import { MailService } from './mail.service.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../models/user.model.js';

@Module({
  imports:[SequelizeModule.forFeature([User])],
  controllers: [MailController],
  providers: [VerifyEmailMail,EmailVerificationMailer ,AuthenticationRegistry, MailService],
  exports:[AuthenticationRegistry]
})
export class EmailModule {}
