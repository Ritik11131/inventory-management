import { HttpRequest, HttpHandlerFn, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  // Don't add the Authorization header for the login or refresh token endpoint
  if (req.url.endsWith('/login') || req.url.endsWith('/Auth/refresh')) {
    return next(req);
  }

  // Clone the request to add the authentication header.
  const authReq = req.clone({
    setHeaders: {
      Authorization: tokenService.getToken() || 'Hello'
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if the error is a 401 Unauthorized
      if (error.status === 401) {        
        // Call the refresh token API
        return tokenService.refreshToken().pipe(
          switchMap((response: any) => {
            // Update the local storage with the new token
            tokenService.setTokens(response.data.accessToken, response.data.refreshToken, response.data.refreshTokenExpiry);  
            tokenService.decodeToken();
            console.log(tokenService.decodedToken);

            // Clone the original request with the new token
            const newAuthReq = req.clone({
              setHeaders: {
                Authorization: tokenService.getToken() || ''
              }
            });

            // Retry the original request with the new token
            return next(newAuthReq);
          })
        );
      } else {
        // If the error is not a 401, just throw the error as it is
        return throwError(error);
      }
    })
  );
};
