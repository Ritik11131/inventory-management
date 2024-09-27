import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./pages/auth/auth.routes').then(m => m.authRoutes),
        canActivate: [authGuard]  // Apply authGuard to redirect only if token exists
    },
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: 'main',
        loadChildren: () => import('./pages/main/main.routes').then(m => m.mainRoutes),
        canActivate: [authGuard]
    }
];