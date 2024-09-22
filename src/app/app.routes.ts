import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: 'main',
        loadChildren: () => import('./pages/main/main.routes').then(m => m.mainRoutes)
    }
];



// import { RouterModule, Routes } from '@angular/router';
// import { Nav1Component } from './navs/nav1/nav1.component';
// import { Nav2Component } from './navs/nav2/nav2.component';
// import { Nav3Component } from './navs/nav3/nav3.component';
// import { Nav4Component } from './navs/nav4/nav4.component';
// import { AuthComponent } from './auth/auth.component';

// const routes: Routes = [
//   {
//     path: '',
//     component: Nav1Component,
//     loadChildren: () => import('./navs/nav1/nav1.routes').then(m => m.nav1Routes)
//   },
//   {
//     path: 'nav2',
//     component: Nav2Component,
//     loadChildren: () => import('./navs/nav2/nav2.routes').then(m => m.nav2Routes)
//   },
//   {
//     path: 'nav3',
//     component: Nav3Component,
//     loadChildren: () => import('./navs/nav3/nav3.routes').then(m => m.nav3Routes)
//   },
//   {
//     path: 'nav4',
//     component: Nav4Component,
//     loadChildren: () => import('./navs/nav4/nav4.routes').then(m => m.nav4Routes)
//   },
//   {
//     path: 'auth',
//     component: AuthComponent,
//     loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
//   }
// ];

// export const appRoutes = RouterModule.forRoot(routes);