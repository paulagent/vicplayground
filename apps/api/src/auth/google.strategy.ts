import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:3333/api/auth/google/callback',
      scope: ['email', 'profile']
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: { id: string; emails?: Array<{ value: string }>; displayName?: string; photos?: Array<{ value: string }> },
    done: VerifyCallback
  ) {
    done(null, {
      providerUserId: profile.id,
      email: profile.emails?.[0]?.value,
      displayName: profile.displayName,
      avatarUrl: profile.photos?.[0]?.value
    });
  }
}
