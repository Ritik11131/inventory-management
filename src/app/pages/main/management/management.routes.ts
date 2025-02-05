import { Routes } from '@angular/router';
import { ManagementComponent } from './management.component';
import { DeviceListComponent } from './device/device-list/device-list.component';
import { AssignedDealerComponent } from './device/assigned-dealer/assigned-dealer.component';
import { DynamicUserComponent } from './dynamic-user/dynamic-user.component';
import { StateComponent } from './state/state.component';
import { RtoComponent } from './rto/rto.component';
import { SimProviderComponent } from './sim-provider/sim-provider.component';
import { DeviceModelComponent } from './device-model/device-model.component';
import { InventoryComponent } from './inventory/inventory.component';
import { VehicleCategoryComponent } from './vehicle-category/vehicle-category.component';
import { RouteComponent } from './route/route.component';

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
      },
      {
         path:'sim-provider-list',
         component:SimProviderComponent
      },
      {
         path:'device-model-list',
         component:DeviceModelComponent
      },
      {
         path:'inventory-list',
         component:InventoryComponent
      },
      {
         path:'vehicle-category-list',
         component:VehicleCategoryComponent
      },
      {
         path:'route',
         component:RouteComponent
      }
    ]
   },
   
];