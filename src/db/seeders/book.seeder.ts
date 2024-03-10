import { BookPage } from 'src/books/entities/book-page.entity';
import { BookPart } from 'src/books/entities/book-part.entity';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class BookSeeder implements Seeder {
    private readonly BooksCount = 1;
    private readonly PartsCount = { min: 2, max: 5 };
    private readonly PagesCount = { min: 7, max: 20 };

    private getRandom({ min, max }: { min: number; max: number }) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private PickPartsCount() {
        return this.getRandom(this.PartsCount);
    }

    private PickPagesCount() {
        return this.getRandom(this.PagesCount);
    }

    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        console.log('Running book seeder :)');
        console.log('Books count:', this.BooksCount);

        const bookFactory = factoryManager.get(Book);
        const bookPartFactory = factoryManager.get(BookPart);
        const bookPageFactory = factoryManager.get(BookPage);

        for (let i = 0; i < this.BooksCount; i++) {
            const author = await dataSource
                .getRepository(User)
                .createQueryBuilder('user')
                .orderBy('RANDOM()')
                .limit(1)
                .getOne();

            let book = await bookFactory.make();
            book.authorId = author.id;

            book = await bookFactory.save(book);

            // book.author = author ?? - will it work

            const partsCount = this.PickPartsCount();
            for (let j = 0; j < partsCount; j++) {
                const pagesCount = this.PickPagesCount();

                let bookPart = await bookPartFactory.make();

                bookPart.bookId = book.id;
                bookPart.index = j + 1;
                bookPart = await bookPartFactory.save(bookPart);

                for (let k = 0; k < pagesCount; k++) {
                    const page = await bookPageFactory.make();
                    page.bookPartId = bookPart.id;
                    page.bookId = book.id;
                    page.index = k + 1;
                    await bookPageFactory.save(page);
                }
            }
        }
    }
}
