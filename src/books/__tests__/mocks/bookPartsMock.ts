import { BookPart } from 'src/books/entities/book-part.entity';
import { mockBook } from './bookMock';

export const mockBookParts: BookPart[] = [];

const names = ['part - 1', 'part - 2', 'part - 3', 'part - 4', 'part - 5'];
names.forEach((name, index) => {
    const newPart = new BookPart();
    newPart.title = name;
    newPart.id = index;
    newPart.bookId = 0;
    newPart.book = mockBook;
    newPart.index = index;
    newPart.createdAt = new Date();
    newPart.pages = [];
    mockBookParts.push(newPart);
});
