import {PassportStrategy} from '@nestjs/passport';
import {Strategy,ExtractJwt} from 'passport-jwt';
import { JwtPayload } from './jwt-payload-interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'topSecret51',
          });
    }

    async validate(payload:JwtPayload):Promise<User>{
        const {username} = payload;
        const user  = await this.userRepository.findOne({username});

        if(!user){
            throw new UnauthorizedException();
        }

        return user;
    }
}