import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BookBasicsController } from 'src/books/book-basics/book-basics.controller';
import { BookBasicsService } from 'src/books/book-basics/book-basics.service';
import request from 'supertest';

describe('book-basics (e2e)', () => {
    let app: INestApplication;

    const bookBasicService = {
        async getMyLibrary(userId: number) {
            return ['test1', 'test2'];
        },
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [],
            controllers: [BookBasicsController],
            providers: [
                {
                    provide: BookBasicsService,
                    useValue: bookBasicService,
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/myLibrary (GET)', () => {
        return request(app.getHttpServer())
            .get('/books/myLibrary')
            .expect(200)
            .expect({
                data: bookBasicService.getMyLibrary(0),
            });
    });
});
