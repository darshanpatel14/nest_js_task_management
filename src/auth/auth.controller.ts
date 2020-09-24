import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredentilDto } from './auth-credentials-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authSer:AuthService){
    }

    @Post('/signup')
    signUp(@Body(ValidationPipe) authDto:AuthCredentilDto) : Promise<void>{
        return this.authSer.signUp(authDto);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authDto:AuthCredentilDto):Promise<{accessToken:string}>{
        return this.authSer.signIn(authDto);
    }
}
