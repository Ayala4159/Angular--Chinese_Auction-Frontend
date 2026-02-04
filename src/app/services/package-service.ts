import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  baseUrl: string = 'https://localhost:7282/api/Package';
  constructor(private http: HttpClient) { }
  getPackages() {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  getPackageById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  addPackage(CreatePackage: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.post<any>(`${this.baseUrl}`, CreatePackage, { headers });
  }
  updatePackage(id: number, PackageData: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.put<any>(`${this.baseUrl}/${id}`, PackageData, { headers });
  }
  deletePackage(id: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }
  
}
