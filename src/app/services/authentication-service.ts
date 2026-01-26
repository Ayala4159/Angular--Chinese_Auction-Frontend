import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUser } from '../models/user.model';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LoginRequest } from '../models/authentication.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  baseUrl: string = 'https://localhost:7282/api/User';
  constructor(private http: HttpClient) {}
  login(email: string, password: string) {
    const loginRequest:LoginRequest={Email:email,Password:password};
    return this.http.post<any>(`${this.baseUrl}/login`, loginRequest).pipe(
    tap((response: any) => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }))
  }
  register( email: string, password: string,first_name: string, last_name: string, phone?: string):Observable<any> {
    const newUser: CreateUser = { Email: email, Password: password, First_name: first_name, Last_name: last_name, Phone: phone };
    return this.http.post<any>(`${this.baseUrl}/Register`, newUser);
  }
}
