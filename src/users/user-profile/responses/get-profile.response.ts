import { Role } from 'src/auth/enums/role.enum';
import { Book } from 'src/books/entities/book.entity';
import { UserProfile } from '../../entities/user-profile.entity';

export class GetProfileResponse {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    isBanned: boolean;
    profile: UserProfile;
    roles: Role[];
    writtenBooks: Book[];
}
