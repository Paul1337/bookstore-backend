import { Book } from 'src/books/entities/book.entity';
import { BookStatus } from 'src/books/enums/book-status.enum';
import { setSeederFactory } from 'typeorm-extension';

const AgeRestrictions = ['6+', '12+', '16+', '18+'];

export default setSeederFactory(Book, faker => {
    const book = new Book();
    book.title = faker.lorem.words({ min: 1, max: 3 });
    book.description = faker.lorem.sentences({ min: 3, max: 8 });
    book.rewardsCount = faker.number.int({ min: 0, max: 10 });
    book.createdAt = faker.date.past();
    book.updatedAt = faker.date.between({ from: book.createdAt, to: new Date() });
    book.addsToLibraryCount = faker.number.int({ min: 0, max: 20 });

    if (Math.random() < 0.7) {
        book.cost = 0;
    } else {
        book.cost = faker.number.int({ min: 500, max: 500000 });
        book.freeChaptersCount = faker.number.int({ min: 0, max: 20 });
    }

    book.status = Math.random() < 0.5 ? BookStatus.Finished : BookStatus.Unfinished;
    book.isPublished = Math.random() < 0.5;
    book.isBanned = Math.random() < 0.2;

    book.ageRestriction = AgeRestrictions[Math.floor(Math.random() * AgeRestrictions.length)];
    return book;
});
