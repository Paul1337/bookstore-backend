import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

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
                namingStrategy: new SnakeNamingStrategy(),
            }),
            imports: [ConfigModule],
            inject: [ConfigService],
        }),
    ],
    providers: [],
    exports: [],
})
export class DBModule {}
