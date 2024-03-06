import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Book } from 'src/books/entities/book.entity';
import { BookPage } from 'src/books/entities/book-page.entity';

export default class GlobalSeeder implements Seeder {
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        console.log('Running global seeder :)');

        // await dataSource.query('');

        // const repository = dataSource.getRepository(BookPage);
        // await repository.insert({});
    }
}
