import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: string = 'http://localhost:7282/api/User';
  constructor(private http: HttpClient) {}
}
