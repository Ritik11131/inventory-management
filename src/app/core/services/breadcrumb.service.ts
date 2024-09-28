import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  breadCrumbs : MenuItem[] = []

  constructor(private authService:AuthService) {}


   generateBreadcrumbs(url: string) : MenuItem[] | undefined {
    this.breadCrumbs = [];
    const urlParts = url.split('/');

    // Handle root route (/main)
    if (urlParts.length === 2) {
      this.breadCrumbs.push({ label: 'Dashboard' });
    } else {
      // Handle sub-routes (/main/management, /main/management/dynamic-user)
      for (let i = 2; i < urlParts.length; i++) {
        const label = this.getLabel(urlParts[i]);
        this.breadCrumbs.push({ label });
      }
    }
    console.log(this.breadCrumbs);
    
    return this.breadCrumbs
  }

  private getLabel(urlPart: string): string {
    switch (urlPart) {
      case 'management':
        return 'Management';
      case 'dynamic-user':
        return this.authService.getUserType();
      default:
        return urlPart.charAt(0).toUpperCase() + urlPart.slice(1);
    }
  }
}
