import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  
  if (
    req.url.startsWith('https://api.binance.com') ||
    req.url.startsWith('/api/') //  проксі
  ) {
    return next(req);
  }

  
  const token = localStorage.getItem('access_token');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
