import { BookPage } from 'src/books/entities/book-page.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(BookPage, faker => {
    const page = new BookPage();
    page.content = faker.lorem.sentences({ min: 20, max: 50 });
    return page;
});
