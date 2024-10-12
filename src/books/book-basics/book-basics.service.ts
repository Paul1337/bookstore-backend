import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { Repository } from 'typeorm';
import { UserBooks } from '../entities/user-books.entity';
import { BooksLibService } from '../books-lib/books-lib.service';
import { GetPublicBookInfoResponse } from './responses/get-public-book-info.response';
import { GetPrivateBookInfoResponse } from './responses/get-private-book-info.response';
import { User } from 'src/users/entities/user.entity';
import { GetMyLibraryResponse } from './responses/get-my-library.response';
import { BookGenre } from '../entities/book-genre.entity';
import { BookSeries } from '../entities/book-series.entity';
import { BookStatService } from '../book-stat/book-stat.service';

@Injectable()
export class BookBasicsService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    @InjectRepository(UserBooks) private userBooksRepository: Repository<UserBooks>,
    @InjectRepository(BookGenre) private bookGenreRepository: Repository<BookGenre>,
    @InjectRepository(BookSeries) private bookSeriesRepository: Repository<BookSeries>,
    private bookStatService: BookStatService,
    private bookLibService: BooksLibService
  ) {}

  async getBookPublicInfo(bookId: number): Promise<GetPublicBookInfoResponse> {
    const bookWithRelations = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['author', 'series', 'parts', 'bookStat'],
    });

    if (!bookWithRelations) {
      throw new BadRequestException('Book not found');
    }

    return {
      id: bookWithRelations.id,
      title: bookWithRelations.title,
      description: bookWithRelations.description,
      rewardsCount: bookWithRelations.rewardsCount,
      author: {
        username: bookWithRelations.author.username,
        id: bookWithRelations.author.id,
        firstName: bookWithRelations.author.profile.firstName,
        lastName: bookWithRelations.author.profile.lastName,
      },
      createdAt: bookWithRelations.createdAt,
      updatedAt: bookWithRelations.updatedAt,
      backgroundSrc: bookWithRelations.backgroundSrc,
      coverSrc: bookWithRelations.coverSrc,
      cost: bookWithRelations.cost,
      freeChaptersCount: bookWithRelations.freeChaptersCount,
      status: bookWithRelations.status,
      isPublished: bookWithRelations.isPublished,
      isBanned: bookWithRelations.isBanned,
      ageRestriction: bookWithRelations.ageRestriction,
      series: bookWithRelations.series,
      addsToLibraryCount: bookWithRelations.bookStat?.addsToLibraryCount ?? 0,
      starsCount: bookWithRelations.bookStat?.starsCount ?? 0,
      viewsCount: bookWithRelations.bookStat?.viewsCount ?? 0,
      paidCount: bookWithRelations.bookStat?.paidCount ?? 0,
      parts: bookWithRelations.parts
        .sort((p1, p2) => p1.index - p2.index)
        .map((part, index) => ({
          id: part.id,
          title: part.title,
          createdAt: part.createdAt,
          updatedAt: part.updatedAt,
          isFree: index + 1 <= bookWithRelations.freeChaptersCount,
        })),
      genres: bookWithRelations.genres?.map(g => g.name) ?? [],
    };
  }

  async getBookPrivateInfo(bookId: number, userId: number): Promise<GetPrivateBookInfoResponse> {
    const publicBookInfo = await this.getBookPublicInfo(bookId);
    const bookInfo = await this.bookLibService.getUserBookInfo(bookId, userId);

    if (!bookInfo.isViewed) {
      bookInfo.isViewed = true;
      await this.userBooksRepository.save(bookInfo);
      await this.bookStatService.updateStat(bookId, { viewsCount: 1 });
    }

    return {
      ...publicBookInfo,
      isStarred: bookInfo.isStarred,
      isInLibrary: bookInfo.isInLibrary,
      currentPage: bookInfo.currentPage,
      currentPart: bookInfo.currentPart,
    };
  }

  async getMyLibrary(userId: number): Promise<Book[]> {
    const books = await this.bookRepository
      .createQueryBuilder('book')
      // .select(['book.title', 'book.description', 'book.coverSrc'])
      .leftJoinAndSelect('book.bookStat', 'bookStat')
      .leftJoin(UserBooks, 'bookInfo', 'bookInfo.book_id = book.id')
      .leftJoin(User, 'user', 'user.id = bookInfo.user_id')
      .where('user.id = :userId', { userId })
      .andWhere('bookInfo.isInLibrary = true')
      .getMany();

    return books;
  }

  async starBook(bookId: number, userId: number) {
    const userBookInfo = await this.bookLibService.getUserBookInfo(bookId, userId);
    if (userBookInfo.isStarred) return;
    await this.bookLibService.createOrUpdateUserbookInfo(bookId, userId, { isStarred: true });
    await this.bookStatService.updateStat(bookId, { starsCount: 1 });
  }

  async unstarBook(bookId: number, userId: number) {
    const userBookInfo = await this.bookLibService.getUserBookInfo(bookId, userId);
    if (!userBookInfo.isStarred) return;
    await this.bookLibService.createOrUpdateUserbookInfo(bookId, userId, { isStarred: false });
    await this.bookStatService.updateStat(bookId, { starsCount: -1 });
  }

  async addBookToLibrary(bookId: number, userId: number) {
    const bookInfo = await this.bookLibService.getUserBookInfo(bookId, userId);

    if (!bookInfo.wasInLibrary) {
      await this.bookStatService.updateStat(bookId, { addsToLibraryCount: 1 });
    }

    bookInfo.isInLibrary = true;
    bookInfo.wasInLibrary = true;
    await this.userBooksRepository.save(bookInfo);
  }

  async removeBookFromLibrary(bookId: number, userId: number) {
    await this.bookLibService.createOrUpdateUserbookInfo(bookId, userId, { isInLibrary: false });
  }

  async getMyBooks(userId: number) {
    const books = await this.bookRepository.find({
      where: { authorId: userId },
      relations: ['bookStat'],
    });
    return books;
  }

  async getAllGenres(): Promise<BookGenre[]> {
    return this.bookGenreRepository.find();
  }

  async getMySeries(userId: number): Promise<BookSeries[]> {
    return this.bookSeriesRepository.find({
      where: { authorId: userId },
    });
  }
}
