
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main.component';
import { SettingsComponent } from './settings/settings.component';
import { TrackingComponent } from './tracking/tracking.component';
import { ReportsComponent } from './reports/reports.component';

export const mainRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children:[
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'tracking',
        component: TrackingComponent
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.routes').then(m => m.reportsRoutes)
      },
      {
        path: 'management',
        loadChildren: () => import('./management/management.routes').then(m => m.managementRoutes)
      },
      {
        path: 'settings',
        component : SettingsComponent,
        loadChildren: () => import('./settings/settings.routes').then(m => m.settingsRoutes)
      }
    ]
  },
];
