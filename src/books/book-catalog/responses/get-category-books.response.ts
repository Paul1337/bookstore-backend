export class GetCategoryBookResponse {
    id: number;
    title: string;
    coverSrc?: string;
}

export type GetCategoryBooksResponse = Array<GetCategoryBookResponse>;
