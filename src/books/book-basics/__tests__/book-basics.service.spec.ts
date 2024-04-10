import { Test, TestingModule } from '@nestjs/testing';
import { BookBasicsService } from '../book-basics.service';

describe('BookBasicsService', () => {
    let service: BookBasicsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BookBasicsService],
        }).compile();

        service = module.get<BookBasicsService>(BookBasicsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('getBookPublicInfo', () => {});
    it('getBookPrivateInfo', () => {});
    it('getMyLibrary', () => {});
    it('starBook', () => {});
    it('unstarBook', () => {});
    it('addBookToLibrary', () => {});
    it('removeBookFromLibrary', () => {});
    it('getMyBooks', () => {});
    it('getAllGenres', () => {});
    it('getMySeries', () => {});
});
