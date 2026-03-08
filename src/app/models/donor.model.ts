import { GetGift } from "./gift.model";

export class CreateDonor {
    email!: string;
    password!: string;
    first_name!: string;
    last_name!: string;
    phone?: string;
    company_name?: string;
    company_description?: string;
    company_picture?: string;
    is_publish: boolean = false;
}

export class ManagerGetDonor {
    id!: number;
    email!: string;
    password!: string;
    first_name!: string;
    last_name!: string;
    phone?: string;
    company_name?: string;
    company_description?: string;
    company_picture?: string;
    is_publish: boolean = false;
    donations:GetGift[]=[]
}

export class UserGetDonor {
    id!:number;
    company_name?: string;
    company_description?: string;
    company_picture?: string;
    is_publish!: boolean;
}