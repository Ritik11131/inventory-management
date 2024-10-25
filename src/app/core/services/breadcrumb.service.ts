import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from './auth.service';
import { capitalize } from '../../shared/utils/common';

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
        'sim-provider-list':[
          { label: 'Management' },
          { label: 'Sim Providers' },
          { label: 'Sim Provider List' }
        ],
        'vehicle-category-list':[
          { label: 'Management' },
          { label: 'Vehicle Category' },
          { label: 'Vehicle Category List' }
        ],
        'states-list':[
          { label: 'Management' },
          { label: 'Sates' },
          { label: 'State List' }
        ],
        'rto-list':[
          { label: 'Management' },
          { label: 'RTO' },
          { label: 'RTO List' }
        ],
        'device-fitment' : [
          { label: 'Management' },
          { label: 'Device' },
          { label: 'Device Fitment' }
        ],
        'inventory-list':[
          { label: 'Management' },
          { label: 'Inventory' },
          { label: 'Inventory List' }
        ],
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
        'device-model-list': [
          { label: 'Management' },
          { label: 'Device Model' },
          { label: 'Device Model List' }
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
      },
      settings: {
       profile: {
          'update-profile': [
            { label: 'Settings' },
            { label: 'Profile' },
            { label: 'Update Profile' }
          ]
        },
        privacy: {
          'change-password': [
            { label: 'Settings' },
            { label: 'Privacy' },
            { label: 'Change Password' }
          ]
        }
      }
    }
  };

  constructor(private authService:AuthService) {}


  generateBreadcrumbs(url: string) : void {
    this.breadCrumbs = [];
  
    const urlParts = url.substring(1).split('/');
    
    // Handle root route (/main)
    if (urlParts.length === 2) {
      this.breadCrumbs.push({ label: capitalize(urlParts[1]) });
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
  }

  updateBreadcrumbs(url: string) :MenuItem[] | undefined {
    this.generateBreadcrumbs(url);
    return this.breadCrumbs;
  }


  getBreadCrumbsJson() : MenuItem[] {
    return this.breadCrumbs;
  }


}
