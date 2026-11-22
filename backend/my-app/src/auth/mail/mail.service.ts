import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../models/user.model.js';

@Injectable()
export class MailService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User){}

        async changeAccountStatus(id:string, email:string){
            const user = await this.userModel.update(
                {isVerified:true},
                {where:{id:id}}
            )

            return user;
        }

}
