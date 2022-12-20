import { Profile, Strategy } from 'passport-linkedin-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.getOrThrow('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.getOrThrow('LINKEDIN_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('LINKEDIN_CALLBACK_URI'),
      scope: ['r_emailaddress', 'r_liteprofile'],
      state: true,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // Find user in DB / Create new user
    const { emails, id, name } = profile;
    const { givenName, familyName } = name;
    const user = await this.authService.findOrCreateLinkedinUser({
      givenName,
      familyName,
      email: emails[0].value,
      id,
    });

    return user;
  }
}
