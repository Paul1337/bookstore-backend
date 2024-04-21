import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockBook } from 'src/books/__tests__/mocks/bookMock';
import { BooksLibService } from 'src/books/books-lib/books-lib.service';
import { BookGenre } from 'src/books/entities/book-genre';
import { BookPart } from 'src/books/entities/book-part.entity';
import { BookSeries } from 'src/books/entities/book-series.entity';
import { Book } from 'src/books/entities/book.entity';
import { UserBooks } from 'src/books/entities/user-books.entity';
import { BookBasicsService } from '../book-basics.service';

const mockBookRepository = {
    createQueryBuilder: jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({
            starsCount: '2',
            viewsCount: '7',
            paidCount: '10',
        }),
    })),
    findOne: async (options: any) => {
        return mockBook;
    },
};

const mockUserBooksRepository = {
    findOne: async (options: any) => {
        return {
            bookId: 0,
            userId: 0,
            isStarred: false,
            isInLibrary: false,
            isPaid: false,
            isViewed: false,
            currentPart: {},
            currentPage: 1,
        };
    },
    update: async (options: any) => {},
};
const mockBookGenreRepository = {};
const mockBookSeriesRepository = {};
const mockBookPartRepository = {};

describe('BookBasicsService', () => {
    let service: BookBasicsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookBasicsService,
                BooksLibService,
                {
                    provide: getRepositoryToken(Book),
                    useValue: mockBookRepository,
                },
                {
                    provide: getRepositoryToken(UserBooks),
                    useValue: mockUserBooksRepository,
                },
                {
                    provide: getRepositoryToken(BookGenre),
                    useValue: mockBookGenreRepository,
                },
                {
                    provide: getRepositoryToken(BookSeries),
                    useValue: mockBookSeriesRepository,
                },
                {
                    provide: getRepositoryToken(BookPart),
                    useValue: mockBookPartRepository,
                },
            ],
        }).compile();

        service = module.get<BookBasicsService>(BookBasicsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('getBookPublicInfo', async () => {
        const bookInfo = await service.getBookPublicInfo(0);
        expect(bookInfo).toBeDefined();
        expect(bookInfo).toHaveProperty('starsCount');
        expect(bookInfo).toHaveProperty('viewsCount');
        expect(bookInfo).toHaveProperty('paidCount');
    });

    it('getBookPrivateInfo', async () => {
        const privateBookInfo = await service.getBookPrivateInfo(0, 0);
    });

    // it('getMyLibrary', () => {});
    // it('starBook', () => {});
    // it('unstarBook', () => {});
    // it('addBookToLibrary', () => {});
    // it('removeBookFromLibrary', () => {});
    // it('getMyBooks', () => {});
    // it('getAllGenres', () => {});
    // it('getMySeries', () => {});
});
