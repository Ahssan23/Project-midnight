import { Body, Controller,Get,Head,Headers,Param,Post, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './showroom.service.js';
import { ShowroomDto } from '../../common/dto/showroom.dto.js';
import { ShowroomGuard } from '../../common/guards/showroom.guard.js';
import type { Request } from 'express';

@Controller('api')
@UseGuards(ShowroomGuard)
export class DashboardController {
    constructor(private dashboardService:DashboardService){}

    @Post("showroom")
    async registerShowroom(@Body() dto:ShowroomDto, @Req() req:Request){
        const register =await this.dashboardService.registerShowroom(dto,req);

        return register;
    }

    // @Get("checkShowroom")
    // async checkShowroom(@Headers('authorization') auth:string){
    //     const check = await this.dashboardService.checkShowroom(auth);
    //     return check;
    // }

    @Get("showroom")
    async getShowroom(@Req()req:Request){

        const showroom = await this.dashboardService.getShowroom(req)
        return showroom;
    }

    @Get("showroom/:id")
    async getShowroomId(@Param('id')id:string){
        const getShowroom = await this.dashboardService.getShowroomId(id);
        return getShowroom;
    }



}
