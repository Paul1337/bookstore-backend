import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions, runSeeders } from 'typeorm-extension';
import GlobalSeeder from './seeders/global.seeder';
import { BookPage } from 'src/books/entities/book-page.entity';
import 'dotenv/config';
import { BookPart } from 'src/books/entities/book-part.entity';
import { Book } from 'src/books/entities/book.entity';
import { BookSeries } from 'src/books/entities/book-series.entity';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/entities/user-role.entity';
import { UserProfile } from 'src/users/entities/user-profile.entity';

// some weird way to run seeder ?? :)
// "seed:global": "yarn run build && ts-node ./node_modules/typeorm-extension/dist/index.cjs seed:run -d ./src/db/data-source.ts",

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } = process.env;

const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    database: 'bookstore',

    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,

    entities: [BookPage, BookPart, Book, BookSeries, User, UserRole, UserProfile],
    seeds: [GlobalSeeder],
    factories: [],
};

const dataSource = new DataSource(options);
dataSource.initialize().then(async () => {
    await runSeeders(dataSource);
});
