import { Routes } from '@angular/router';
import { ManagementComponent } from './management.component';
import { DealerListComponent } from './dealer-list/dealer-list.component';
import { DeviceListComponent } from './device/device-list/device-list.component';
import { AssignedDealerComponent } from './device/assigned-dealer/assigned-dealer.component';
import { DynamicUserComponent } from './dynamic-user/dynamic-user.component';

export const managementRoutes: Routes = [
   {
    path:'',
    component:ManagementComponent,
    children:[
      {
         path:'dynamic-user',
         component:DynamicUserComponent
      },
      {
         path:'device-list',
         component:DeviceListComponent
      },
      {
         path:'assigned-dealer',
         component:AssignedDealerComponent
      }
    ]
   },
   
];