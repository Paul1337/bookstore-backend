import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions, runSeeders } from 'typeorm-extension';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } = process.env;

const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    database: 'bookstore',

    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,

    // entities: [BookPage, BookPart, Book, BookSeries, BookGenre, User, UserRole, UserProfile],
    entities: ['src/**/*.entity.ts'],
    seeds: ['src/db/seeders/*.ts'],
    factories: ['src/db/factories/*.ts'],

    namingStrategy: new SnakeNamingStrategy(),
};

const dataSource = new DataSource(options);
dataSource.initialize().then(async () => {
    await runSeeders(dataSource);
});
