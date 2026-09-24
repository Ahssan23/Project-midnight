import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service.js';
import { LoginDto } from '../dto/login.dto.js';

@Controller('api')
export class LoginController {
    constructor(private loginService:LoginService){}

    @Post('login')
    async login(@Body() dto:LoginDto){
        const login = await this.loginService.login(dto);
        return login;
    }
}
