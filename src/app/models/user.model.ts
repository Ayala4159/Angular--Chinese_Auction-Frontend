import { GetPurchase } from "./purchase.model";

export class CreateUser {
    Email!: string;
    Password!: string;
    First_name!: string;
    Last_name!: string;
    Phone?: string;
}

export class GetUser {
    Id!: number;
    Email!: string;
    FirstName!: string;
    LastName!: string;
    Phone?: string;
    Role!: number; 
    Purchase: GetPurchase[] = [];
}
export enum Role {
    Customer = 0,
    Manager = 1,
}