import { Controller ,Post ,Body} from '@nestjs/common';
import { SignupService } from './signup.service.js';
import { SignupDto } from '../dto/signup.dto.js';

@Controller('api')
export class SignupController {
    constructor(private signupService:SignupService){}

    @Post('signup')
    async signup(@Body() dto:SignupDto){
        const signup = this.signupService.signup(dto);
        return signup;
    }
    
}
