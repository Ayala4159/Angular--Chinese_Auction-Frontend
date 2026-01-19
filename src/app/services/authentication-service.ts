import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUser } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  baseUrl: string = 'https://localhost:7282/api/User';
  constructor(private http: HttpClient) {}
  login(email: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password });
  }
  register( email: string, password: string,first_name: string, last_name: string, phone?: string):Observable<any> {
    const newUser: CreateUser = { Email: email, Password: password, First_name: first_name, Last_name: last_name, Phone: phone };
    return this.http.post<any>(`${this.baseUrl}/Register`, newUser);
  }
}
