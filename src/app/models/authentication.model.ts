import { GetUser } from "./user.model";

export class LoginRequest {
    Email!: string;
    Password!: string;
}

export class LoginResponse {
    Token!: string;
    TokenType: string = "Bearer";
    ExpiresInMinutes!: number;
    User: GetUser = new GetUser();
}