import { Module } from '@nestjs/common';
import { UserMeController } from './user-me.controller';
import { UserMeService } from './user-me.service';
import { userProviders } from 'src/modules/userForAdmin/providers/user.providers';
import { DataBaseModule } from 'src/modules/data-base/data-base.module';

@Module({
  imports: [DataBaseModule],
  controllers: [UserMeController],
  providers: [...userProviders,UserMeService],
})
export class UserMeModule {}