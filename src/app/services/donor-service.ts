import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CreateDonor,ManagerGetDonor,UserGetDonor } from '../models/donor.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DonorService {
  baseUrl: string = 'https://localhost:7282/api/Donor';
  constructor(private http: HttpClient, private cookieService: CookieService) { }
  getDonors() {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<ManagerGetDonor[]>(`${this.baseUrl}`, { headers });
  }
  getDonorById(id: number) {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<UserGetDonor>(`${this.baseUrl}/${id}`, { headers });
  }
  addDonor(donorData: any, imageFile: File) {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('Email', donorData.email);
    formData.append('Password', donorData.password);
    formData.append('First_name', donorData.first_name);
    formData.append('Last_name', donorData.last_name);  
    formData.append('Phone', donorData.phone || '');
    formData.append('Company_name', donorData.company_name || '');
    formData.append('Company_description', donorData.company_description || '');
    formData.append('Is_publish', String(donorData.is_publish));
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    return this.http.post<ManagerGetDonor>(`${this.baseUrl}`, formData, { headers });
  }
  updateDonor(id: number, donorData: any, imageFile?: File) {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('Email', donorData.email);
    formData.append('Password', donorData.password);
    formData.append('First_name', donorData.first_name); 
    formData.append('Last_name', donorData.last_name);
    formData.append('Phone', donorData.phone || '');
    formData.append('Company_name', donorData.company_name || '');
    formData.append('Company_description', donorData.company_description || '');
    formData.append('Is_publish', String(donorData.is_publish)); 
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    return this.http.put<ManagerGetDonor>(`${this.baseUrl}/${id}`, formData, { headers });
  }
  deleteDonor(id: number) {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }
    getFilteredDonors(name?: string, email?: string, giftName?: string): Observable<ManagerGetDonor[]> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    let params = new HttpParams();
    if (name && name.trim()) params = params.set('name', name.trim());
    if (email && email.trim()) params = params.set('email', email.trim());
    if (giftName && giftName.trim()) params = params.set('giftName', giftName.trim());
    return this.http.get<ManagerGetDonor[]>(`${this.baseUrl}/filter`, { headers, params });
  }



}