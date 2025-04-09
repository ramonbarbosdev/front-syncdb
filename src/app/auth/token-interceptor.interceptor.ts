import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);
  const token = auth.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};