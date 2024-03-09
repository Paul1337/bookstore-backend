import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';
import { AuthModule } from 'src/auth/auth.module';
import { BooksModule } from 'src/books/books.module';
import { DBModule } from 'src/db/db.module';
import { UsersModule } from 'src/users/users.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: path.join(__dirname, '../..', 'static'),
            renderPath: '/',
        }),
        DBModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
        UsersModule,
        BooksModule,
    ],
    controllers: [],
})
export class AppModule {}
