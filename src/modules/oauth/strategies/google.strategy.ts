import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

interface GoogleProfile {
  provider: string;
  emails?: { value: string }[];
  photos?: { value: string }[];
  name?: {
    givenName?: string;
    familyName?: string;
  };
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: GoogleProfile, done: VerifyCallback) {
    const emails = profile.emails ?? [{ value: 'no-email' }];
    const photos = profile.photos ?? [{ value: '' }];

    const user = {
      emails,
      displayName: profile.name?.givenName && profile.name?.familyName? `${profile.name.givenName} ${profile.name.familyName}`: 'Unknown',
      photos,
    };

    done(null, user);
  }
}