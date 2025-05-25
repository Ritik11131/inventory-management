// // notification-http.interceptor.ts
// import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { catchError, tap, timeout } from 'rxjs/operators';
// import { throwError, of } from 'rxjs';

// // Cache service for optimizing repeated requests
// class NotificationCacheService {
//   private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
//   private readonly DEFAULT_TTL = 5000; // 5 seconds cache for count API
  
//   set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
//     this.cache.set(key, {
//       data,
//       timestamp: Date.now(),
//       ttl
//     });
//   }
  
//   get(key: string): any | null {
//     const cached = this.cache.get(key);
//     if (!cached) return null;
    
//     if (Date.now() - cached.timestamp > cached.ttl) {
//       this.cache.delete(key);
//       return null;
//     }
    
//     return cached.data;
//   }
  
//   clear(): void {
//     this.cache.clear();
//   }
  
//   delete(key: string): void {
//     this.cache.delete(key);
//   }
// }

// // Global cache instance
// const notificationCache = new NotificationCacheService();

// /**
//  * HTTP Interceptor optimized for notification service
//  * Handles caching, timeouts, and error recovery
//  */
// export const notificationHttpInterceptor: HttpInterceptorFn = (req, next) => {
//   // Only intercept notification-related requests
//   if (!req.url.includes('/api/notifications')) {
//     return next(req);
//   }
  
//   // Generate cache key
//   const cacheKey = `${req.method}:${req.url}:${JSON.stringify(req.body || {})}`;
  
//   // Handle GET requests with caching (only for count API to avoid stale data in lists)
//   if (req.method === 'GET' && req.url.includes('/DashboardAlert')) {
//     const cachedResponse = notificationCache.get(cacheKey);
//     if (cachedResponse) {
//       return of(new HttpResponse({
//         body: cachedResponse,
//         status: 200,
//         statusText: 'OK',
//         url: req.url
//       }));
//     }
//   }
  
//   // Add optimized headers
//   const optimizedReq = req.clone({
//     setHeaders: {
//       'Cache-Control': req.url.includes('/DashboardAlert') ? 'no-cache' : 'no-store',
//       'X-Requested-With': 'XMLHttpRequest',
//       'Accept': 'application/json',
//       'Content-Type': req.method !== 'GET' ? 'application/json' : req.headers.get('Content-Type') || ''
//     }
//   });
  
//   return next(optimizedReq).pipe(
//     // Set timeout based on request type
//     timeout(req.url.includes('/DashboardAlert') ? 5000 : 10000),
    
//     // Cache successful GET responses for count API
//     tap(response => {
//       if (response instanceof HttpResponse && 
//           response.status === 200 && 
//           req.method === 'GET' && 
//           req.url.includes('/DashboardAlert')) {
//         notificationCache.set(cacheKey, response.body);
//       }
//     }),
    
//     // Enhanced error handling
//     catchError(error => {
//       // Log error for monitoring
//       console.error('Notification API Error:', {
//         url: req.url,
//         method: req.method,
//         status: error.status,
//         message: error.message,
//         timestamp: new Date().toISOString()
//       });
      
//       // For count API, return fallback response to prevent breaking polling
//       if (req.url.includes('/DashboardAlert')) {
//         return of(new HttpResponse({
//           body: { count: 0, timestamp: new Date() },
//           status: 200,
//           statusText: 'OK (Fallback)',
//           url: req.url
//         }));
//       }
      
//       // For other APIs, return the error to be handled by the service
//       return throwError(() => error);
//     })
//   );
// };

// // Export cache service for manual cache management if needed
// export { notificationCache };