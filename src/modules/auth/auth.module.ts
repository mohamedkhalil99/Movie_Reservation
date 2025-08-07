import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DataBaseModule } from '../data-base/data-base.module';
import { userProviders } from '../userForAdmin/providers/user.providers';

@Module({
  imports: [DataBaseModule],
  controllers: [AuthController],
  providers: [...userProviders, AuthService],
})
export class AuthModule {}