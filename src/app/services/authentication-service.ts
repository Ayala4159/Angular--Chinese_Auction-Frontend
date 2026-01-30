import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUser } from '../models/user.model';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { LoginRequest } from '../models/authentication.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  baseUrl: string = 'https://localhost:7282/api/User';
  private currentUser = localStorage.getItem('user') || null;
  private userSubject = new BehaviorSubject<any>(this.currentUser ? JSON.parse(this.currentUser) : null);
  user$ = this.userSubject.asObservable();
  constructor(private http: HttpClient) { }
  login(email: string, password: string) {
    const loginRequest: LoginRequest = { Email: email, Password: password };
    const rezult = this.http.post<any>(`${this.baseUrl}/login`, loginRequest).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.userSubject.next(response.user);
      }))
    return rezult;
  }
  register(email: string, password: string, first_name: string, last_name: string, phone?: string): Observable<any> {
    const newUser: CreateUser = { Email: email, Password: password, First_name: first_name, Last_name: last_name, Phone: phone };
    return this.http.post<any>(`${this.baseUrl}/Register`, newUser);
  }
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }
}


