import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  constructor(private http: HttpClient) {}

  getHistoryBinance(symbol: string, interval: string, limit: number): Observable<{time:string, price:number}[]> {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    return this.http.get<any[]>(url).pipe(
      map(rows => rows.map(r => ({
        time: new Date(r[0]).toLocaleTimeString(),   // open time
        price: +r[4]                                  // close price
      })))
    );
  }
}

