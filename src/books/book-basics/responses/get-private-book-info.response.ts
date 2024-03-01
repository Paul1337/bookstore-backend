import { GetPublicBookInfoResponse } from './get-public-book-info.response';

export class GetPrivateBookInfoResponse extends GetPublicBookInfoResponse {
    isStarred: boolean;
    isInLibrary: boolean;
    currentPage: number;
}
