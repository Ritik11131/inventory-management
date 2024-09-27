import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {ConfirmationService, MessageService, PrimeNGConfig} from 'primeng/api';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';


export const appConfig: ApplicationConfig = {
  providers: [
    MessageService, 
    ConfirmationService, 
    provideRouter(routes), 
    provideAnimations(),
    PrimeNGConfig,
    provideClientHydration(),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
