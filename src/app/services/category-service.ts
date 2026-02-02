import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl: string = 'https://localhost:7282/api/Category';
  constructor(private http: HttpClient) { }
  getCategories() {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  getCategoryById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  addCategory(categoryData: any, imageFile: File) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('Name', categoryData.name);
    formData.append('Picture', 'enpty');
    formData.append('imageFile', imageFile);

    return this.http.post<any>(`${this.baseUrl}`, formData, { headers });
  }
  updateCategory(id: number, categoryData: any, imageFile: File) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('Name', categoryData.name);
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    formData.append('Picture', categoryData.picture);
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData, { headers });
  }
  deleteCategory(id: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }
}
