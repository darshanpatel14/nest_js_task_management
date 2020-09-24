import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from 'bcryptjs';
import { AuthCredentilDto } from "./auth-credentials-dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async signUp(authDto: AuthCredentilDto): Promise<void> {

        const { username, password } = authDto;


        const user = new User();

        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hasPassword(password, user.salt);

        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') { // duplicate username
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }


    }

    async validateUserPassword(authDto:AuthCredentilDto):Promise<string>{
        const {username,password} = authDto;

        const user = await this.findOne({username});

        if(user && user.validatePassword(password)){
            return user.username
        }else{
            return null;
        }
    }

    private async hasPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

}