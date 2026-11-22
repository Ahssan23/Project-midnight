import { EmailVerificationHandler,AuthenticationRegistry, EmailVerificationLink } from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";
import { Mailable,Mailer } from "@nestjs/mail";



@Injectable()
export class VerifyEmailMail implements Mailable<any>{
    render({url}: {url:string}){
        return{
            subject:"verification email",
            template:"verify-email",
            context:{url}
        }
    }
}


@Injectable()
export class EmailVerificationMailer extends EmailVerificationHandler{
    constructor(private readonly mailer:Mailer,
        registery:AuthenticationRegistry
    ){
        super()
        registery.registerHandler("emailVerification",this);
    }

    async send(link:EmailVerificationLink){
        console.log(link,'THIS IS LINK');
        await this.mailer.send(VerifyEmailMail, {to:link.email, data:link})
    }

    async markVerified(userId: string, email: string) {
        console.log("USER IS VERIFIED")
        return true;
    }
}