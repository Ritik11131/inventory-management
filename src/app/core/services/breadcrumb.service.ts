import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  breadCrumbs : MenuItem[] = [];

  breadcrumbMap = {
    main: {
      dashboard: [
        { label: 'Dashboard' }
      ],
      management: {
        'dynamic-user-list': [
          { label: 'Management' },
          { label: (authService : any) => authService.getUserType() },
          { label: (authService : any) => `${authService.getUserType()} List` }
        ],
        'device-list': [
          { label: 'Management' },
          { label: 'Device' },
          { label: 'Device List' }
        ],
        assigned: (authService : any) => {
          return {
            [authService.getUserType()]: [
              { label: 'Management' },
              { label: 'Device' },
              { label: `Assigned To ${authService.getUserType()}` }
            ]
          };
        }
      }
    }
  };

  constructor(private authService:AuthService) {}


  generateBreadcrumbs(url: string): MenuItem[] | undefined {
    this.breadCrumbs = [];
  
    const urlParts = url.substring(1).split('/');
  
    // Handle root route (/main)
    if (urlParts.length === 2) {
      this.breadCrumbs.push({ label: this.capitalize(urlParts[1]) });
    } else if (urlParts.length > 2) {
      let breadcrumbPath : any = this.breadcrumbMap;

      for (const part of urlParts) {
        if(part !== 'assigned') {
          breadcrumbPath = breadcrumbPath[part]
        } else {
          breadcrumbPath = breadcrumbPath[part](this.authService);
        }
      }
      this.breadCrumbs = breadcrumbPath.map((item : any) => {
        if(typeof(item.label) === 'function') {
          return { label: item.label(this.authService) };
        } else {
          return item;
        }
      })
    }
  
    return this.breadCrumbs;
  }
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
