export class GetGift {
    id!: number;
    name!: string;
    description!: string;
    details?: string;
    picture!: string;
    value!: number;
    donorId!: number;
    categoryId!: number;
    is_lottery!: boolean;
    is_approved: boolean = false;
}

export class CreateGift {
    name!: string;
    description!: string;
    details?: string;
    picture!: string;
    value!: number;
    donorId!: number;
    categoryId!: number;
    is_lottery!: boolean;
    is_approved: boolean = false;
}