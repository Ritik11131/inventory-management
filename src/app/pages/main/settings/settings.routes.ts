import { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { UpdateProfileComponent } from './profile/update-profile/update-profile.component';
import { ChangePasswordComponent } from './privacy/change-password/change-password.component';
import { UploadCertificatesComponent } from './privacy/upload-certificates/upload-certificates.component';


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
         path:'privacy/change-password',
         component:ChangePasswordComponent
      },
      {
         path:'privacy/upload-certificates',
         component:UploadCertificatesComponent
      }
    ]
   },
   
];