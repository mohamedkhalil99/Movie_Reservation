import { Module } from '@nestjs/common';
import { DataBaseModule } from './modules/data-base/data-base.module';
import { UserModule } from './modules/userForAdmin/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UserMeModule } from './modules/user-me/user-me.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true,}),
    DataBaseModule, 
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '2d' },
    }),
    UserMeModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.NODEMAILER_USERNAME,
          pass: process.env.NODEMAILER_PASSWORD,
        },
      },
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}