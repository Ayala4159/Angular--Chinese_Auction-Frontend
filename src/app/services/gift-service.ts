import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetGift, CreateGift } from '../models/gift.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class GiftService {

  baseUrl: string = 'https://localhost:7282/api/Gift';
  constructor(private http: HttpClient, private cookieService: CookieService) { }
  getGift() {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<GetGift[]>(`${this.baseUrl}`, { headers });
  }
  getGiftUnapproved() {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<GetGift[]>(`${this.baseUrl}/Unapproved`, { headers });
  }
  getGiftById(id: number) {
    return this.http.get<GetGift>(`${this.baseUrl}/${id}`);
  }
  getGiftsByCategory(categoryId: number) {
    return this.http.get<GetGift[]>(`${this.baseUrl}/category/${categoryId}`);
  }
  addGift(giftData: CreateGift, imageFile: File) {

    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const formData = new FormData();

    formData.append('Name', giftData.name);
    formData.append('Description', giftData.description);
    formData.append('Details', giftData.details || '');
    formData.append('Value', giftData.value.toString());
    formData.append('Picture', giftData.picture.toString());
    formData.append('DonorId', giftData.donorId.toString());
    formData.append('CategoryId', giftData.categoryId.toString());
    formData.append('is_lottery', "false");
    formData.append('Is_approved', "true");

    if (giftData.picture) {
      formData.append('imageFile', giftData.picture);
    }

    return this.http.post<GetGift>(`${this.baseUrl}`, formData, { headers });
  }
  updateGift(id: number, giftData: CreateGift, imageFile: File) {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('Name', giftData.name);
    formData.append('Description', giftData.description);
    formData.append('Details', giftData.details || '');
    formData.append('Picture', "Empty");
    formData.append('Value', giftData.value ? giftData.value.toString() : '');
    formData.append('DonorId', giftData.donorId ? giftData.donorId.toString() : '');
    formData.append('CategoryId', giftData.categoryId ? giftData.categoryId.toString() : '');
    formData.append('Is_approved', "true");
    formData.append('imageFile', imageFile);
    return this.http.put<GetGift>(`${this.baseUrl}/${id}`, formData, { headers });
  }
  deleteGift(id: number) {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }
  updateGiftPurchas(id: number) {
    return this.http.put<GetGift>(`${this.baseUrl}/purchase/${id}`, {});
  }
}