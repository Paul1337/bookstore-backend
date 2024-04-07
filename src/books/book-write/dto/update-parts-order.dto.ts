import { IsNotEmpty } from 'class-validator';

export class UpdatePartsOrderDto {
    @IsNotEmpty()
    partsIds: number[];
}
