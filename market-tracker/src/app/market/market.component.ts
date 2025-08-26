import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { HistoryService } from '../service/history.service';
import { WsPriceService } from '../service/ws-price.service';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule],
  templateUrl: './market.html',
  styleUrls: ['./market.scss'],
})
export class MarketComponent implements OnInit, OnDestroy {
  symbol = 'BTC/USDT';
  price: number | null = null;
  time: string | null = null;

  @ViewChild('priceChart', { static: false })
  chartEl?: ElementRef<HTMLCanvasElement>;
  chart?: Chart;

  private wsSub?: { unsubscribe?: () => void } | any;
  private currentPair = '';
  private maxPoints = 240;
  private lastWsUpdate = 0; 

  constructor(
    private history: HistoryService,
    private ws: WsPriceService,
  ) {}

  ngOnInit(): void {
    // автозапуск підписки на перший символ
    this.subscribeToSymbol();
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe?.();
  }

  private toBinancePair(sym: string): string {
    return sym.replace('/', '').toUpperCase(); 
  }

  loadChart(): void {
    // перевантажує підписку
    this.subscribeToSymbol();
  }

  private fmtTime(d = new Date()): string {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  subscribeToSymbol(): void {
    const pair = this.toBinancePair(this.symbol);
    if (pair === this.currentPair && this.chart) {
      return; 
    }
    this.currentPair = pair;

    
    this.wsSub?.unsubscribe?.();

    // 1) історичні дані для початкового графіка
    this.history.getHistoryBinance(pair, '1m', 120).subscribe(bars => {
      const labels = bars.map(b => b.time);
      const values = bars.map(b => b.price);

      
      if (this.chart) this.chart.destroy();
      const ctx = this.chartEl!.nativeElement.getContext('2d')!;
      this.chart = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label: this.symbol, data: values }] },
        options: {
          responsive: true,
          animation: false,
          spanGaps: true,
          plugins: { legend: { display: true } },
          scales: {
            x: { ticks: { maxTicksLimit: 8 } },
            y: { beginAtZero: false }
          }
        }
      });

      // ціна/час
      const last = bars.at(-1);
      if (last) { this.price = last.price; this.time = last.time; }
    });

    // 2) realtime через Binance WS (trade stream)
    this.wsSub = this.ws.connectBinance(pair).subscribe((p: number) => {
      const now = Date.now();
      
      if (now - this.lastWsUpdate < 950) { return; }
      this.lastWsUpdate = now;

      this.price = p;
      this.time  = this.fmtTime();

      if (!this.chart) return;

      this.chart.data.labels!.push(this.time);
      (this.chart.data.datasets[0].data as number[]).push(this.price);

      // історія в межах maxPoints
      if (this.chart.data.labels!.length > this.maxPoints) {
        this.chart.data.labels!.shift();
        (this.chart.data.datasets[0].data as number[]).shift();
      }

      this.chart.update('none'); 
    });
  }
}
