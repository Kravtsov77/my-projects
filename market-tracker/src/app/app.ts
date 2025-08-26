import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './market/market.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MarketComponent],
  template: `<app-market></app-market>`,
})
export class App {}
