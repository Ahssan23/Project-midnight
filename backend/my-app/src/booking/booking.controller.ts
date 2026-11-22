import { Controller ,Post,Body, UseGuards,Get,Req} from '@nestjs/common';
import { CreateBookingDto } from '../common/dto/booking.dto.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { BookingService } from './booking.service.js';
import type{ Request } from 'express';
@Controller('api')
@UseGuards(AuthGuard)
export class BookingController {
    constructor(private bookingService:BookingService){}

    @Post('booking')
    async booking(@Body() dto:CreateBookingDto, @Req() req:Request){
        const booking = this.bookingService.booking(dto,req);
        return booking;
    }

    @Get('booking')
    async getBooking(@Req() req:Request){
        const booking = this.bookingService.getBooking(req);
        return booking;

    }
}
 