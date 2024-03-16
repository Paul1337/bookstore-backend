import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthGoogleService } from './auth-google.service';

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => {
                return {
                    global: true,
                    secret: config.get<string>('APP_SECRET'),
                    signOptions: {
                        expiresIn: 2 * 24 * 60 * 60,
                    },
                };
            },
            imports: [ConfigModule],
            inject: [ConfigService],
        }),
        ConfigModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        AuthGoogleService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        GoogleStrategy,
    ],
    exports: [AuthService],
})
export class AuthModule {}
