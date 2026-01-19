export class CreatePurchase {
    GiftId!: number;
    UserId!: number;
    PackageId!: number;
}

export class GetPurchase {
    Id!: number;
    GiftId!: number;
    PackageId!: number;
    UniquePackageId!: string;
}

export class UpdatePurchase {
    IsWon!: boolean;
}