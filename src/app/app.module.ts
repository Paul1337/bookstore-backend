import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from 'src/books/books.module';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('DB_HOST'),
                port: config.get('DB_PORT'),
                username: config.get('DB_USER'),
                password: config.get('DB_PASSWORD'),
                database: 'bookstore',
                autoLoadEntities: true,
                synchronize: true,
            }),
            imports: [ConfigModule],
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
        UsersModule,
        BooksModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
