import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { SignupModule } from './signup/signup.module.js';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule  } from '@nestjs/sequelize';


export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
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
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
