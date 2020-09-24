import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentilDto } from './auth-credentials-dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload-interface';

@Injectable()
export class AuthService {
    private logger =new Logger('AuthService');

    constructor(@InjectRepository(UserRepository) private userRepo:UserRepository,
    private jwtService:JwtService,
    ){
    }

    async signUp(authDto:AuthCredentilDto):Promise<void>{
        return this.userRepo.signUp(authDto);
    }

    async signIn(authDto:AuthCredentilDto):Promise<{accessToken:string}>{
        const username  = await this.userRepo.validateUserPassword(authDto);
       
        if(!username){
            throw new UnauthorizedException('Invalid Credentials');
        }

        const payload:JwtPayload = {username};
        const accessToken  = await this.jwtService.sign(payload);

        this.logger.debug(`Generated Jwt token with payload ${JSON.stringify(payload)}`)

        return {accessToken};
    }
}
