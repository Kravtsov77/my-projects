import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WsPriceService {
  connectBinance(pair: string): Observable<number> {
    const url = `wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@trade`;
    return new Observable<number>((sub) => {
      const ws = new WebSocket(url);

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          
          const price = +data.p;
          if (!isNaN(price)) sub.next(price);
        } catch { /* ignore */ }
      };

      ws.onerror = () => sub.error('WebSocket error');
      ws.onclose  = () => sub.complete();

      return () => ws.close(1000);
    });
  }
}

