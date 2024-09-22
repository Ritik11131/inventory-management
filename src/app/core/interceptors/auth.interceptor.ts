import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpErrorResponse, HttpHandlerFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  if (inject(AuthService).isAuthenticated()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${inject(AuthService).getToken()}`
      }
    });
  }

  return next(req);
};