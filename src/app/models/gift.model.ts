export class GetGift {
    Id!: number;
    Name!: string;
    Description!: string;
    Details?: string;
    Picture!: string;
    Value!: number;
    DonorId!: number;
    CategoryId!: number;
    Is_lottery!: boolean;
    Is_approved: boolean = false;
}

export class CreateGift {
    Name!: string;
    Description!: string;
    Details?: string;
    Picture!: string;
    Value!: number;
    DonorId!: number;
    CategoryId!: number;
    Is_lottery!: boolean;
    Is_approved: boolean = false;
}