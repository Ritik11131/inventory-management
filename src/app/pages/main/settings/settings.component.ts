import { Component, HostListener } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [AvatarModule,PanelMenuModule,DividerModule,CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {


  isSmallScreen: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 768; // adjust the width as per your requirement for small screens
  }

  constructor(private router:Router,private breadcrumbService:BreadcrumbService) {}

  items = [
    {
        label: 'Profile',
        icon: 'pi pi-user',
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
              label: 'Reset Password',
              icon: 'pi pi-wrench',
              command: () => {
                this.router.navigate(['/main/settings/privacy/reset-password']);
                this.breadcrumbService.generateBreadcrumbs('/main/settings/privacy/reset-password');
            }
              
          }
      ]
  }
];

}
