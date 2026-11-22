  import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
  import { createObserveModule } from '@nestjs/observe';
  import { SignupModule } from './auth/signup/signup.module.js';
  import { ConfigModule } from '@nestjs/config';
  import { SequelizeModule  } from '@nestjs/sequelize';
  import { LoginModule } from './auth/login/login.module.js';
  import { DashboardModule } from './dashboard/showroom/showroom.module.js';
  import { CarModule } from './dashboard/car/car.module.js';
  import { LoggerMiddleware } from './common/middleware/logger.middleware.js';
  import {LogMailTransport,MailModule,FileTemplateEngine, SmtpTransport} from "@nestjs/mail";
  import {join,dirname} from "node:path";
  import { fileURLToPath } from 'node:url';
import { EmailModule } from './auth/mail/mail.module.js';
import { AuthenticationModule } from '@nestjs/authentication';
import { PassResetModule } from './auth/pass-reset/pass-reset.module.js';
import { BookingModule } from './booking/booking.module.js';
import { VerifyRoleModule } from './auth/verify-role/verify-role.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule({
  skipInstrumentation: (instance) => {
    return (instance as any)?.constructor?.name === 'SmtpTransport';
  },
});
  const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);  

@Module({
    imports: [

      AuthenticationModule.forRoot({
        emailVerification:{
          url:"http://localhost:3000/verify-email",
          ttl:"24h"
        }, 
        passwordReset:{
          url:"http://localhost:3000/pass-reset",
          ttl:"24h"
        },
        globalGuard:false
      }),
      ConfigModule.forRoot({
        isGlobal:true
      }),
      MailModule.forRoot({
        transport:process.env.SMTP_URL ? new SmtpTransport({url:process.env.SMTP_URL }): new LogMailTransport(),
        templates:new FileTemplateEngine({dir:join(__dirname,'../src/auth/mail/templates')}),
        from :'Rental app <noreply@example.com>'
      }),

      ObserveModule.forRoot({
        appKey:process.env.NESTJS_OBSERVE_API!,
        appSecret:process.env.NESTJS_OBSERVE_APPSECRET!,
        serviceId:'project-midnight',
        debug:true,
        
      }),
      SequelizeModule.forRoot({
      dialect:'postgres',
      host:process.env.DATABASE_URL,
      port:5432,
      username:process.env.DATABASE_USER,
      password:process.env.DATABASE_PASSWORD,
      database:process.env.DATABASE_NAME,
      autoLoadModels:true,
      logging:true,
      dialectOptions:{
        ssl:{
          require:true,
          rejectUnauthorized:true
        }
      }
      
    }),
      SignupModule,
      LoginModule,
      DashboardModule,
      CarModule,
      EmailModule,
      PassResetModule,
      BookingModule,
      VerifyRoleModule
      
    ],
    controllers: [],
    providers: [],
  })

  export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware).forRoutes("api")
    }
  }
