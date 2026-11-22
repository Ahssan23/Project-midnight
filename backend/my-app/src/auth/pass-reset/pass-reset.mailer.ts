import { Injectable } from "@nestjs/common";
import { PasswordResetHandler,AuthenticationRegistry, type PasswordResetLink } from "@nestjs/authentication";
import { Mailer,Mailable } from "@nestjs/mail";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../../models/user.model.js";


@Injectable()
export class PasswordResetMail implements Mailable<PasswordResetLink>{
    render({url}: PasswordResetLink){
        return {
            subject:"Reset your password",
            template:'password-reset',
            context:{url}
        }
    }
}


@Injectable()
export class PasswordResetMailer extends PasswordResetHandler{
    constructor(
        @InjectModel(User)
        private readonly userModel:typeof User,
        private readonly mailer:Mailer,
        registry:AuthenticationRegistry
    ){
        super()
        registry.registerHandler('passwordReset',this);
    }
    async findUser(email:string){
    const user= await this.userModel.findOne({
            where:{
                email:email
            }
        })   
        if(!user || !user.id|| !user.email|| !user.password)return null;

        return {
            id:String(user?.id), 
            email:String(user?.email),
             passwordHash: user?.password }
    }
    async send(link:PasswordResetLink){
        await this.mailer.send(PasswordResetMail, {to: link.email,data:link});
    }
    async updatePassword(userId: string, passwordHash: string) {
        console.log(passwordHash,'PASSWORD HASHJ')
        const update = await this.userModel.update(
            {password:passwordHash},{
                where:{
                    id:userId
                }
            }
            
        )
        console.log(update);
    }
}