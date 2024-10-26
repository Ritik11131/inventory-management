import { Component, HostListener, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [AvatarModule,PanelMenuModule,DividerModule,CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {


  isSmallScreen: boolean = false;

  settings = [
    {
        label: 'Profile',
        icon: 'pi pi-user',
        expanded:true,
        items: [
            {
                label: 'Update Profile',
                icon: 'pi pi-user-edit',
                command: () => {
                    this.router.navigate(['/main/settings/profile/update-profile']);
                    this.breadcrumbService.generateBreadcrumbs('/main/settings/profile/update-profile');
                }
                
            }
        ]
    },
    {
      label: 'Privacy',
      icon: 'pi pi-shield',
      items: [
          {
              label: 'Change Password',
              icon: 'pi pi-wrench',
              command: () => {
                this.router.navigate(['/main/settings/privacy/change-password']);
                this.breadcrumbService.generateBreadcrumbs('/main/settings/privacy/change-password');
            }
              
          },
          {
            label: 'Upload Cetificates',
            icon: 'pi pi-wrench',
            command: () => {
              this.router.navigate(['/main/settings/privacy/upload-certificates']);
              this.breadcrumbService.generateBreadcrumbs('/main/settings/privacy/upload-certificates');
          }
            
        }
      ]
  }
];
  userRole: string = '';
  userName: string = '';


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }


  constructor(private router:Router,private breadcrumbService:BreadcrumbService,private authService:AuthService) {}


  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.userName = this.authService.getUserName();
    this.checkScreenSize();
    this.settings[0].items[0].command();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 768;
  }


  

}
