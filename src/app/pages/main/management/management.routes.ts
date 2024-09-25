import { Routes } from '@angular/router';
import { ManagementComponent } from './management.component';
import { DealerListComponent } from './dealer-list/dealer-list.component';
import { DeviceListComponent } from './device/device-list/device-list.component';

export const managementRoutes: Routes = [
   {
    path:'',
    component:ManagementComponent,
    children:[
      {
         path:'dealer-list',
         component:DealerListComponent
      },
      {
         path:'device-list',
         component:DeviceListComponent
      }
    ]
   },
   
];