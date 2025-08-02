import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DataBaseModule } from '../data-base/data-base.module';
import { userProviders } from './providers/user.providers';

@Module({
  imports: [DataBaseModule],
  controllers: [UserController],
  providers: [...userProviders, UserService],
})
export class UserModule {}