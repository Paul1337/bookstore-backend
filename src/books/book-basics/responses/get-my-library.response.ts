export class MyLibraryBookResponse {
    title: string;
    description: string;
}

export type GetMyLibraryResponse = Array<MyLibraryBookResponse>;
