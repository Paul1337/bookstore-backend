import { BookSeries } from 'src/books/entities/book-series.entity';
import { BookStatus } from 'src/books/enums/book-status.enum';
import { User } from 'src/users/entities/user.entity';
import { DeepPartial } from 'typeorm';

export class GetPublicBookInfoResponse {
    id: number;
    title: string;
    description: string;
    viewsCount: number;
    rewardsCount: number;
    author?: DeepPartial<User>;
    createdAt: Date;
    updatedAt: Date;
    addsToLibraryCount: number;
    backgroundSrc: string;
    coverSrc: string;
    cost: number;
    freeChaptersCount: number;
    status: BookStatus;
    isPublished: boolean;
    isBanned: boolean;
    ageRestriction: string;
    series?: BookSeries;
    starsCount: number;
}
