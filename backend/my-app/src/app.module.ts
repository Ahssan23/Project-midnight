import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { SignupModule } from './auth/signup/signup.module.js';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule  } from '@nestjs/sequelize';
import { LoginModule } from './auth/login/login.module.js';
import { DashboardModule } from './dashboard/showroom/showroom.module.js';
import { CarModule } from './dashboard/car/car.module.js';
import { LoggerMiddleware } from './common/middleware/logger.middleware.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal:true
    }),
    ObserveModule.forRoot({
      appKey:process.env.NESTJS_OBSERVE_API!,
      appSecret:process.env.NESTJS_OBSERVE_APPSECRET!,
      serviceId:'project-midnight',
      debug:true
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
    
  ],
  controllers: [],
  providers: [],
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("api")
  }
}
