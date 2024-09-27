import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet,MenubarModule, BadgeModule, AvatarModule, InputTextModule, RippleModule,RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  constructor(private router:Router,private authService:AuthService) {}

  items: MenuItem[] | undefined = [
    {
      key:'dashboard',
      label: 'Dashboard',
      icon: 'pi pi-objects-column',
      command:() => {
        this.router.navigate(['/main/dashboard']);
      }
    },
    {
      key:'management',
      label: 'Management',
      icon: 'pi pi-server',
      command:() => {
        // this.router.navigate(['/main/management']);
      },
      items: [
        {
          label: this.authService.getUserType(),
          icon: 'pi pi-palette',
          items: [
            {
              label: `${this.authService.getUserType()} List`,
              icon: 'pi pi-palette',
              command:() => {
                this.router.navigate([`/main/management/dynamic-user`]);
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
              command:() => {
                this.router.navigate(['/main/management/device-list']);
              }
            },
            {
              label: 'Assigned To Dealer',
              icon: 'pi pi-palette',
              command:() => {
                this.router.navigate(['/main/management/assigned-dealer']);
              }

            }
          ]
        }
      ]
    }
  ];
}
