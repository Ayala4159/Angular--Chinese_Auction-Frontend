import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetPackage, CreatePackage } from '../models/package.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  baseUrl: string = 'https://localhost:7282/api/Package';
  constructor(private http: HttpClient, private cookieService: CookieService) { }
  getPackages() {
    return this.http.get<GetPackage[]>(`${this.baseUrl}`);
  }
  getPackageById(id: number) {
    return this.http.get<GetPackage>(`${this.baseUrl}/${id}`);
  }
  addPackage(packageData: CreatePackage) {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.post<GetPackage>(`${this.baseUrl}`, packageData, { headers });
  }
  updatePackage(id: number, packageData: CreatePackage) {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.put<GetPackage>(`${this.baseUrl}/${id}`, packageData, { headers });
  }
  deletePackage(id: number) {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }
  
}
