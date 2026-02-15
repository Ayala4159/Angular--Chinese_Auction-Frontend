import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUser } from '../models/user.model';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { LoginRequest } from '../models/authentication.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  baseUrl: string = 'https://localhost:7282/api/User';
  private currentUser: any;
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.currentUser = this.cookieService.get('user') || null;
    this.userSubject.next(this.currentUser ? JSON.parse(this.currentUser) : null);
  }
  login(email: string, password: string) {
    const loginRequest: LoginRequest = { Email: email, Password: password };
    const rezult = this.http.post<any>(`${this.baseUrl}/login`, loginRequest).pipe(
      tap((response: any) => {
        this.cookieService.set('token', response.token);
        this.cookieService.set('user', JSON.stringify(response.user));
        this.userSubject.next(response.user);
      }))
    return rezult;
  }
  register(email: string, password: string, first_name: string, last_name: string, phone?: string): Observable<any> {
    const newUser: CreateUser = { Email: email, Password: password, First_name: first_name, Last_name: last_name, Phone: phone };
    return this.http.post<any>(`${this.baseUrl}/Register`, newUser);
  }
  logout() {
    this.cookieService.delete('user');
    this.cookieService.delete('token');
    this.userSubject.next(null);
  }
}


