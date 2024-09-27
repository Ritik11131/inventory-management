import { HttpRequest, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authToken : any = tokenService.getToken();

  if (req.url.endsWith('/login')) {
    console.log('interceptor called');
    
    // Don't add the Authorization header for the login endpoint
    return next(req);
  }

  // Clone the request to add the authentication header.
  const authReq = req.clone({
    setHeaders: {
      Authorization: authToken
    }
  });
  return next(authReq);
};
