import { Module } from '@nestjs/common';
import { VerifyRoleController } from './verify-role.controller.js';
import { VerifyRoleService } from './verify-role.service.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../models/user.model.js';

@Module({
  imports:[
    SequelizeModule.forFeature([User]),
    JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '2h' },
    }),
  }),
],
    
  controllers: [VerifyRoleController],
  providers: [VerifyRoleService]
})
export class VerifyRoleModule {}
