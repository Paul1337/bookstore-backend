import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { RequestExtended, UserPayloadScheme } from '../lib/request-extension';
import { Role } from '../enums/role.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private configService: ConfigService) {
        const host = `${configService.get('SERVER_HOST')}:${configService.get('SERVER_PORT')}`;
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: `${host}/auth/google/redirect`,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        // console.log('profile:', profile);

        const userPayload: UserPayloadScheme = {
            email: profile.emails[0].value,
            id: Number(profile.id),
            roles: [Role.User],
            username: profile.emails[0].value,
        };

        return userPayload;
    }
}
