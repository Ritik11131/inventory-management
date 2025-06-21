import { HttpRequest, HttpHandlerFn, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const routerService = inject(Router);
  const toastService = inject(ToastService);

  // Don't add the Authorization header for the login or refresh token endpoint
  if (req.url.endsWith('/login') || req.url.endsWith('/Auth/refresh') || req.url.endsWith('Verification/send-sms-otp') || 
      req.url.endsWith('Verification/resend-sms-otp') || req.url.endsWith('Verification/validate-sms-otp') || req.url.endsWith('Profile/ForgetPassword')) {
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
            // Clone the original request with the new token
            const newAuthReq = req.clone({
              setHeaders: {
                Authorization: tokenService.getToken()
              }
            });

            // Retry the original request with the new token
            return next(newAuthReq);
          }),
          catchError((refreshError : HttpErrorResponse) => {
            console.log(refreshError,'refresherror');
            
            // If refresh token API also returns 401, log the user out
            if (refreshError.status === 401) {
              tokenService.clearTokens();
              setTimeout(()=>{
                routerService.navigateByUrl('/auth/login');
                // toastService.showWarn('Session Expired', 'Please login again!', 10000);
              },500);
            }
            // Throw the refresh error
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
