interface PartOrderUpdate {
    id: number;
    index: number;
}

export class UpdatePartsOrderDto {
    parts: PartOrderUpdate[];
}
