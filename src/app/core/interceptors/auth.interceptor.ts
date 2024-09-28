import { HttpRequest, HttpHandlerFn, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const authToken: string | null = tokenService.getToken();

  // Don't add the Authorization header for the login or refresh token endpoint
  if (req.url.endsWith('/login')) {
    return next(req);
  }

  // Clone the request to add the authentication header.
  const authReq = req.clone({
    setHeaders: {
      Authorization: authToken || 'Hello'
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if the error is a 401 Unauthorized
      if (error.status === 401 && !req.url.includes('/Auth/refresh')) {
        console.log(authToken,'previous');
        
        // Call the refresh token API
        return tokenService.refreshToken().pipe(
          switchMap((response: any) => {
            // Update the local storage with the new token
            tokenService.setTokens(response.data.token, response.data.refreshToken, response.data.refreshTokenExpiry);  
            tokenService.decodeToken();
            console.log(authToken,'new');

            // Clone the original request with the new token
            const newAuthReq = req.clone({
              setHeaders: {
                Authorization: authToken || ''
              }
            });

            // Retry the original request with the new token
            return next(newAuthReq);
          }),
          catchError((refreshError) => {
            // If refreshing the token fails, log out the user and redirect to login
            tokenService.clearTokens();
            router.navigate(['/auth/login']);
            return throwError(refreshError);
          })
        );
      } else {
        // If the error is not a 401, just throw the error as it is
        return throwError(error);
      }
    })
  );
};
