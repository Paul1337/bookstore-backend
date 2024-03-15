export class GetPageResponse {
    id: number;
    content: string;
    index: number;
    partIndex: number;
}
export type GetPagesResponse = Array<GetPageResponse>;
