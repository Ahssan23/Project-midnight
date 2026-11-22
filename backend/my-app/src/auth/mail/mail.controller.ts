import { Body, Controller,Post } from '@nestjs/common';
import { EmailVerificationService } from '@nestjs/authentication';
import { MailService } from './mail.service.js';

@Controller('api')
// @UseGuards(ShowroomGuard)
export class MailController {
    constructor(private emailVerification:EmailVerificationService,
        private mailService:MailService
    ){}
    @Post('verify-email')
    async verifyEmail(@Body('token') token:string){
        console.log(token,'VEMAIL ')
        const verify = await this.emailVerification.verify(token)
        if(verify){
            const result = await this.mailService.changeAccountStatus(verify.userId,verify.email);
            console.log(result);
            return result
        }
        else{
            return false; 
        }
        
    return verify;
    }



}
