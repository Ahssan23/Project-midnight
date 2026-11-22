import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { VerifyRoleService } from './verify-role.service.js';
import type { Request } from 'express';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { ViewEntity } from 'typeorm';

@Controller('api')
export class VerifyRoleController {
constructor(private verifyService:VerifyRoleService){}

@Get('auth/verify-role')
@UseGuards(AuthGuard)
async verifyRole(@Req() req:Request){
    const verify = await this.verifyService.VerifyRole(req);
    console.log(verify)
    return verify
}
}

