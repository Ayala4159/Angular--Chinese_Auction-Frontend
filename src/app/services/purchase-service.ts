import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetPurchase, CreatePurchase, UpdatePurchase } from '../models/purchase.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  baseUrl: string = 'https://localhost:7282/api/Purchase';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getAllPurchases() {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<GetPurchase[]>(`${this.baseUrl}`, { headers });
  }

  getPurchaseById(id: number) {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<GetPurchase>(`${this.baseUrl}/${id}`, { headers });
  }

  addPurchase(purchaseData: CreatePurchase) {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post<GetPurchase>(`${this.baseUrl}`, purchaseData, { headers });
  }

  updatePurchase(id: number, purchaseData: UpdatePurchase) {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.put<GetPurchase>(`${this.baseUrl}/${id}`, purchaseData, { headers });
  }

  deletePurchase(id: number) {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }
}
