import { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { UpdateProfileComponent } from './profile/update-profile/update-profile.component';
import { ResetPasswordComponent } from './privacy/reset-password/reset-password.component';


export const settingsRoutes: Routes = [
   {
    path:'',
    // component:UpdateProfileComponent,
    // component:SettingsComponent,
    children:[
      {
         path:'profile/update-profile',
         component:UpdateProfileComponent
      },
      {
         path:'privacy/reset-password',
         component:ResetPasswordComponent
      }
    ]
   },
   
];