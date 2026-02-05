import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DonorService {
  baseUrl: string = 'https://localhost:7282/api/Donor';
  constructor(private http: HttpClient) { }
  getDonors() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<any>(`${this.baseUrl}`, { headers });
  }
  getDonorById(id: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers });
  }
  addDonor(donorData: any, imageFile: File) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('Email', donorData.email);
    formData.append('Password', donorData.password);
    formData.append('First_Name', donorData.First_Name);
    formData.append('Last_Name', donorData.Last_Name);
    formData.append('Phone', donorData.phone);
    formData.append('Company_Name', donorData.Company_Name);
    formData.append('Company_Description', donorData.Company_Description);
    formData.append('Company_Picture', 'enpty');
    formData.append('Is_publish', donorData.Is_publish);
    formData.append('imageFile', imageFile);
    return this.http.post<any>(`${this.baseUrl}`, formData, { headers });
  }
  updateDonor(id: number, donorData: any, imageFile?: File) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('Email', donorData.email);
    formData.append('Password', donorData.password);
    formData.append('First_name', donorData.First_Name);
    formData.append('Last_name', donorData.Last_Name);
    formData.append('Phone', donorData.phone);
    formData.append('Company_name', donorData.Company_Name);
    formData.append('Company_description', donorData.Company_Description);
    formData.append('Company_picture', 'enpty');
    formData.append('Is_publish', donorData.Is_publish);
    if (imageFile) {
      formData.append('imageFile', imageFile);
    } 
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData, { headers });
  }
  deleteDonor(id: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }
}