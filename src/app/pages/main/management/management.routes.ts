import { Routes } from '@angular/router';
import { ManagementComponent } from './management.component';
import { DeviceListComponent } from './device/device-list/device-list.component';
import { AssignedDealerComponent } from './device/assigned-dealer/assigned-dealer.component';
import { DynamicUserComponent } from './dynamic-user/dynamic-user.component';
import { StateComponent } from './state/state.component';
import { RtoComponent } from './rto/rto.component';

export const managementRoutes: Routes = [
   {
    path:'',
    component:ManagementComponent,
    children:[
      {
         path:'dynamic-user-list',
         component:DynamicUserComponent
      },
      {
         path:'device-list',
         component:DeviceListComponent
      },
      {
         path:'assigned/:userType',
         component:AssignedDealerComponent
      },
      {
         path:'states-list',
         component:StateComponent
      },
      {
         path:'rto-list',
         component:RtoComponent
      }
    ]
   },
   
];