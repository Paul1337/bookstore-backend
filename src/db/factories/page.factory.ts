import { BookPage } from 'src/books/entities/book-page.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(BookPage, faker => {
    const page = new BookPage();
    page.content = faker.string.sample({
        min: 100,
        max: 1000,
    });

    return page;
});
