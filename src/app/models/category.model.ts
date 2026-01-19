import { GetGift } from "./gift.model";

export class Category {
    Name!: string;
}

export class GetCategory {
    Id!: number;
    Name!: string;
    Gifts: GetGift[] = [];
}