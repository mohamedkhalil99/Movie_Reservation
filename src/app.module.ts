import { Module } from '@nestjs/common';
import { DataBaseModule } from './modules/data-base/data-base.module';
import { UserModule } from './modules/userForAdmin/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UserMeModule } from './modules/user-me/user-me.module';

@Module({
  imports: [
    DataBaseModule, 
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '2d' },
    }),
    UserMeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}