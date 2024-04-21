import { Book } from 'src/books/entities/book.entity';
import { userMock } from './userMock';

export const mockBook = new Book();
mockBook.id = 0;
mockBook.title = 'Mock book';
mockBook.description = 'Some book description';
mockBook.rewardsCount = 7;
// mockBook.addsToLibraryCount = 11;
mockBook.ageRestriction = '12+';
mockBook.authorId = 0;
mockBook.author = userMock;
mockBook.createdAt = new Date();
mockBook.genres = [
    {
        id: 0,
        name: 'приключения',
    },
    {
        id: 1,
        name: 'Детектив',
    },
];
mockBook.cost = 0;
mockBook.freeChaptersCount = -1;
mockBook.isBanned = false;
mockBook.isPublished = false;
mockBook.rewardsCount = 0;
mockBook.parts = [];
// mockBook.
