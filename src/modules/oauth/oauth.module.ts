import { Module } from '@nestjs/common';
import { GoogleStrategy } from './strategies/google.strategy';
import { DataBaseModule } from '../data-base/data-base.module';
import { OAuthController } from './oauth.controller';
import { userProviders } from '../userForAdmin/providers/user.providers';
import { OAuthService } from './oauth.service';

@Module({
  imports: [DataBaseModule],
  controllers: [OAuthController],
  providers: [...userProviders, OAuthService, GoogleStrategy],
})
export class OAuthModule {}