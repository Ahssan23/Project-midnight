import { PasswordResetService } from '@nestjs/authentication';
import { BadRequestException, Body, Controller, HttpCode, Post,Req } from '@nestjs/common';
import type { Request } from 'express';

@Controller('api')
export class PassResetController {
    constructor(private passResetService:PasswordResetService){}

    @Post('pass-reset/forgot')
    @HttpCode(202)
    async forgot(@Body('email') email:string){
        const result = this.passResetService.request(email);
        console.log(result)
    }

    @Post('pass-reset/reset')
    @HttpCode(200)
    async reset(@Req() req:Request){
        console.log(req.body.token)
        const result = await this.passResetService.reset(req.body.token, req.body.password);
        if(!result){
            throw new BadRequestException('Invalid or expired link')
        }
    }
}
