export class CreatePurchase {
    GiftId!: number;
    UserId!: number;
    PackageId!: number;
}

export class GetPurchase {
    id!: number;
    giftId!: number;
    packageId!: number;
    userId!: number;
    uniquePackageId!: string;
    is_won!:boolean;
}

export class UpdatePurchase {
    IsWon!: boolean;
}