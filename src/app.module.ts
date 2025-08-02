import { Module } from '@nestjs/common';
import { DataBaseModule } from './modules/data-base/data-base.module';
import { UserModule } from './modules/userForAdmin/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DataBaseModule, 
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}