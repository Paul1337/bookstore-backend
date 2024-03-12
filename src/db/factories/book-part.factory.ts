import { BookPart } from 'src/books/entities/book-part.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(BookPart, faker => {
    const bookPart = new BookPart();
    bookPart.title = faker.lorem.words({ min: 1, max: 5 });
    return bookPart;
});
