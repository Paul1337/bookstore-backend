import 'dotenv/config';
import { BookPage } from 'src/books/entities/book-page.entity';
import { BookPart } from 'src/books/entities/book-part.entity';
import { BookSeries } from 'src/books/entities/book-series.entity';
import { Book } from 'src/books/entities/book.entity';
import { UserProfile } from 'src/users/entities/user-profile.entity';
import { UserRole } from 'src/users/entities/user-role.entity';
import { User } from 'src/users/entities/user.entity';
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

    entities: [BookPage, BookPart, Book, BookSeries, User, UserRole, UserProfile],
    seeds: ['src/db/seeders/*.ts'],
    factories: ['src/db/factories/*.ts'],

    namingStrategy: new SnakeNamingStrategy(),
};

const dataSource = new DataSource(options);
dataSource.initialize().then(async () => {
    await runSeeders(dataSource);
});
