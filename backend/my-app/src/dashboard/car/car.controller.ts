import { Body, Controller, Post ,Req,Query,Get, UseGuards,UseInterceptors} from '@nestjs/common';
import { CarService } from './car.service.js';
import { carDto } from '../../common/dto/car.dto.js';
import { CarGuard } from '../../common/guards/car.guard.js';
import type { Request } from 'express';

@Controller('api')
export class CarController {
    constructor(private carService:CarService){
    }
    
    // @UseGuards(AuthGuard)
    // @UseInterceptors(ErrorInterceptor,LoggingInterceptor)
    @Post("car")
    @UseGuards(CarGuard)
    async registerCar(@Body() dto:carDto, @Req() req:Request){
        console.log('register car controller')
        const register = await this.carService.registerCar(dto, req);
        return register;
    }

    @Get("car")
    async getCar(@Query('showroomId') id:number){
        const car = await this.carService.getCar(id);
        console.log(car,'THIS IS ACAR')
        return car;
    }

}



