import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: string = 'http://localhost:7282/api/User';
  constructor(private http: HttpClient) {}
  getUserById(id: number): Observable<GetUser> {
    return this.http.get<GetUser>(`${this.baseUrl}/${id}`);
  }
}
