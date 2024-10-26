import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
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
import { Subscription } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { getMenuConfig } from '../../shared/constants/menu-config';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenubarModule, BadgeModule, AvatarModule, InputTextModule, RippleModule,
    RouterLink, MenuModule, ButtonModule, BreadcrumbModule,DropdownModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private authService: AuthService, private toastService: ToastService,
    public breadcrumbService: BreadcrumbService, private route: ActivatedRoute) { }

  userRole: string = '';
  userName: string = '';
  menuItems!: MenuItem[];

  home: MenuItem | undefined = {
    icon: 'pi pi-home', command: () => {
      this.router.navigate(['/']);
      this.breadCrumbs = [{
        label: 'Dashboard',
      }];
    }
  };

  breadCrumbs: MenuItem[] | undefined = [];
  private breadCrumbRouterSub!: Subscription;


  profileItems: MenuItem[] | undefined = [
    { separator: true },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => {
        this.router.navigate(['/main/settings']);
        this.breadcrumbService.generateBreadcrumbs('/main/settings');
      }
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
    }];



  ngOnInit(): void {
    this.initializeMenu();
    this.userRole = this.authService.getUserRole();
    this.userName = this.authService.getUserName();
    this.breadCrumbs = this.breadcrumbService.updateBreadcrumbs(this.router.url);

    this.breadCrumbRouterSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.breadCrumbs = this.breadcrumbService.updateBreadcrumbs(this.router.url);
      }
    });
  }


    // Method to initialize the menu
    private initializeMenu() {
      this.menuItems = getMenuConfig(this.authService, this.router, this.breadcrumbService);
      console.log(this.menuItems);
      
    }




  ngOnDestroy(): void {
    if (this.breadCrumbRouterSub) {
      this.breadCrumbRouterSub.unsubscribe();
    }
  }
}
