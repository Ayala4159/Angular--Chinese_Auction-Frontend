import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GiftService {

  baseUrl: string = 'https://localhost:7282/api/Gift';
  constructor(private http: HttpClient) { }
  getGift() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<any>(`${this.baseUrl}`, { headers });
  }
  getGiftUnapproved() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<any>(`${this.baseUrl}/Unapproved`, { headers });
  }
  getGiftById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  getGiftsByCategory(categoryId: number) {
    return this.http.get<any>(`${this.baseUrl}/category/${categoryId}`);
  }
  addGift(giftData: any, imageFile: File) {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const formData = new FormData();

    formData.append('Name', giftData.name);
    formData.append('Description', giftData.description);
    formData.append('Details', giftData.details || '');
    formData.append('Value', giftData.value.toString());
    formData.append('Picture', giftData.picture.toString());
    formData.append('DonorId', giftData.donorId);
    formData.append('CategoryId', giftData.categoryId);
    formData.append('is_lottery', "false");
    formData.append('Is_approved', "true");

    if (giftData.picture) {
      formData.append('imageFile', giftData.picture);
    }

    return this.http.post<any>(`${this.baseUrl}`, formData, { headers });
  }
  updateGift(id: number, giftData: any, imageFile: File) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('Name', giftData.name);
    formData.append('Description', giftData.description);
    formData.append('Details', giftData.details || '');
    formData.append('Picture', "Empty");
    formData.append('Value', giftData.value || '');
    formData.append('DonorId', giftData.donorId || '');
    formData.append('CategoryId', giftData.categoryId.id || '');
    formData.append('Is_approved', "true");
    formData.append('imageFile', imageFile);
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData, { headers });
  }
  deleteGift(id: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }
  updateGiftPurchas(id: number) {
    return this.http.put<any>(`${this.baseUrl}/purchase/${id}`, {});
  }
}