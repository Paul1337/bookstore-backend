import { BookStat } from 'src/books/entities/book-stat.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(BookStat, faker => {
    const bookStat = new BookStat();
    return bookStat;
});
