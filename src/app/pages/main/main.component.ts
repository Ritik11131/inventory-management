import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../core/services/toast.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenubarModule, BadgeModule, AvatarModule, InputTextModule, RippleModule,
    RouterLink, MenuModule, ButtonModule, BreadcrumbModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private toastService: ToastService,
              private breadcrumbService:BreadcrumbService) { }

  userRole: string = '';
  userName: string = '';

  home: MenuItem | undefined = {
    icon: 'pi pi-home', command: () => {
      this.router.navigate(['/']); 
      this.breadCrumbs = [{
        label: 'Dashboard',
      }];
    }
  };

  breadCrumbs: MenuItem[] | undefined = [];

  items: MenuItem[] | undefined = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: 'pi pi-objects-column',
      command: () => {
        this.router.navigate(['/main/dashboard']);
        this.breadCrumbs = this.breadcrumbService.generateBreadcrumbs('/main/dashboard');
      }
    },
    {
      key: 'management',
      label: 'Management',
      icon: 'pi pi-server',
      command: () => {
        // this.router.navigate(['/main/management']);
        // this.breadCrumbs = this.breadcrumbService.generateBreadcrumbs('/main/management');
      },
      items: [
        {
          label: this.authService.getUserType(),
          icon: 'pi pi-palette',
          items: [
            {
              label: `${this.authService.getUserType()} List`,
              icon: 'pi pi-palette',
              command: () => {
                this.router.navigate([`/main/management/dynamic-user-list`]);
                this.breadCrumbs = this.breadcrumbService.generateBreadcrumbs('/main/management/dynamic-user-list');
              }
            },
          ]
        },
        {
          separator: true
        },
        {
          label: 'Device',
          icon: 'pi pi-palette',
          items: [
            {
              label: 'Device List',
              icon: 'pi pi-palette',
              command: () => {
                this.router.navigate(['/main/management/device-list']);
                this.breadCrumbs = this.breadcrumbService.generateBreadcrumbs('/main/management/device-list');
              }
            },
            {
              label: `Assigned To ${this.authService.getUserType()}`,
              icon: 'pi pi-palette',
              command: () => {
                this.router.navigate([`/main/management/assigned/${this.authService.getUserType()}`]);
                this.breadCrumbs = this.breadcrumbService.generateBreadcrumbs(`/main/management/assigned/${this.authService.getUserType()}`);
              }

            }
          ]
        }
      ]
    }
  ];


  profileItems: MenuItem[] | undefined = [
    {
      separator: true
    },
    {
      label: 'Profile',
      items: [
        {
          label: 'Settings',
          icon: 'pi pi-cog',
          shortcut: '⌘+O'
        },
        {
          label: 'Messages',
          icon: 'pi pi-inbox',
          badge: '2'
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          shortcut: '⌘+Q',
          command: async () => {
            try {
              await this.authService.logout();
              this.toastService.showSuccess('Success', 'Successfully logged out!');
              this.router.navigate(['/auth/login']);
            } catch (error) {
              this.toastService.showError('Error', 'Failed to log out!');
            }

          }
        }
      ]
    },
    {
      separator: true
    }
  ];



  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.userName = this.authService.getUserName();
    if(this.router.url) {
      this.breadCrumbs = this.breadcrumbService.generateBreadcrumbs(this.router.url);
    }
  }
}
