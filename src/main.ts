import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

const DEFAULT_PORT = 3000;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors: ValidationError[]) => {
                new BadRequestException(errors[0]);
            },
        }),
    );
    await app.listen(process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : DEFAULT_PORT);
}
bootstrap();
