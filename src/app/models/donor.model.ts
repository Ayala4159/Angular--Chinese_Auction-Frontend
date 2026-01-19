export class CreateDonor {
    Email!: string;
    Password!: string;
    First_name!: string;
    Last_name!: string;
    Phone?: string;
    Company_name?: string;
    Company_description?: string;
    Company_picture?: string;
    Is_publish: boolean = false;
}

export class ManagerGetDonor {
    Id!: number;
    Email!: string;
    Password!: string;
    First_name!: string;
    Last_name!: string;
    Phone?: string;
    Company_name?: string;
    Company_description?: string;
    Company_picture?: string;
    Is_publish: boolean = false;
}

export class UserGetDonor {
    Company_name?: string;
    Company_description?: string;
    Company_picture?: string;
    Is_publish!: boolean;
}