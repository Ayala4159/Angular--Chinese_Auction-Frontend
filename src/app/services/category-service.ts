import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetCategory, Category } from '../models/category.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl: string = 'https://localhost:7282/api/Category';
  constructor(private http: HttpClient, private cookieService: CookieService) { }
  getCategories() {
    return this.http.get<GetCategory[]>(`${this.baseUrl}`);
  }
  getCategoryById(id: number) {
    return this.http.get<GetCategory>(`${this.baseUrl}/${id}`);
  }
  addCategory(categoryData: Category, imageFile: File) {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('Name', categoryData.name);
    formData.append('Picture', 'enpty');
    formData.append('imageFile', imageFile);

    return this.http.post<GetCategory>(`${this.baseUrl}`, formData, { headers });
  }
  updateCategory(id: number, categoryData: Category, imageFile: File) {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('Name', categoryData.name);
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    formData.append('Picture', categoryData.picture);
    return this.http.put<GetCategory>(`${this.baseUrl}/${id}`, formData, { headers });
  }
  deleteCategory(id: number) {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }
}
