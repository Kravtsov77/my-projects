# MarketTracker

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.4.


Односторінковий Angular-застосунок для відображення графіка ціни криптовалют у реальному часі з використанням даних Binance API.

## Функціонал
- Відображення історичних даних у вигляді свічкового графіка
- Підписка на оновлення ціни через WebSocket
- Автоматичне оновлення графіка в реальному часі

---

## Встановлення та запуск

1. **Встановіть залежності**:
npm ci

---

Обхід CORS  (за потреби)
Binance API може блокувати прямі запити з браузера (помилка CORS).
Щоб це обійти, використовуйте proxy.

Створіть файл proxy.conf.json у корені проєкту:

{
  "/api": {
    "target": "https://api.binance.com",
    "secure": true,
    "changeOrigin": true,
    "pathRewrite": { "^/api": "" }
  }

Запустіть сервер з проксі:
ng serve --proxy-config proxy.conf.json

Збірка проєкту
ng build
Збірка з’явиться у папці dist/.


Технології: 

Angular 20

Chart.js

Binance API (REST + WebSocket)

