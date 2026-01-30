import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl: string = 'https://localhost:7282/api/Category';
  constructor(private http:HttpClient) {}
  getCategories() {
    return this.http.get<any>(`${this.baseUrl}`);
  }
}
