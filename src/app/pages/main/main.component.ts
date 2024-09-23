import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet,MenubarModule, BadgeModule, AvatarModule, InputTextModule, RippleModule,RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  items: MenuItem[] | undefined = [
    {
      key:'dashboard',
      label: 'Dashboard',
      icon: 'pi pi-objects-column'
    },
    {
      key:'management',
      label: 'Management',
      icon: 'pi pi-server',
      items: [
        {
          label: 'Templates',
          icon: 'pi pi-palette',
          items: [
            {
              label: 'Apollo',
              icon: 'pi pi-palette',
              badge: '2'
            },
            {
              label: 'Ultima',
              icon: 'pi pi-palette',
              badge: '3'
            }
          ]
        },
        {
          separator: true
        },
        {
          label: 'Templates',
          icon: 'pi pi-palette',
          items: [
            {
              label: 'Apollo',
              icon: 'pi pi-palette',
              badge: '2'
            },
            {
              label: 'Ultima',
              icon: 'pi pi-palette',
              badge: '3'
            }
          ]
        },
        {
          separator: true
        },
        {
          label: 'Templates',
          icon: 'pi pi-palette',
          items: [
            {
              label: 'Apollo',
              icon: 'pi pi-palette',
              badge: '2'
            },
            {
              label: 'Ultima',
              icon: 'pi pi-palette',
              badge: '3'
            }
          ]
        }
      ]
    }
  ];
}
