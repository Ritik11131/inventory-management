// notification.component.ts
import { Component, inject, ViewChild, ElementRef, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ScrollerModule } from 'primeng/scroller';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { OverlayPanel } from 'primeng/overlaypanel';
import { NotificationService, NotificationItem } from '../../../core/services/notification.service';
import { InputSwitchModule } from 'primeng/inputswitch';

// Pipes
import { Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Pipe({
  name: 'notificationSeverity',
  standalone: true
})
export class NotificationSeverityPipe implements PipeTransform {
  transform(type: string): 'success' | 'info' | 'warning' | 'danger' {
    const severityMap: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
      'success': 'success',
      'info': 'info',
      'warning': 'warning',
      'error': 'danger'
    };
    return severityMap[type] || 'info';
  }
}

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(timestamp: Date): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return time.toLocaleDateString();
  }
}

@Pipe({
  name: 'badgeClass',
  standalone: true
})
export class BadgeClassPipe implements PipeTransform {
  transform(count: number): string {
    if (count === 0) return 'p-badge-secondary';
    if (count > 10) return 'p-badge-danger';
    return 'p-badge-info';
  }
}

@Pipe({
  name: 'tooltipText',
  standalone: true
})
export class TooltipTextPipe implements PipeTransform {
  transform(count: number): string {
    if (count === 0) return 'No new notifications';
    return `${count} new notification${count > 1 ? 's' : ''}`;
  }
}

@Pipe({
  name: 'notificationIcon',
  standalone: true
})
export class NotificationIconPipe implements PipeTransform {
  transform(type: string): string {
    return 'pi pi-bell';
  }
}

@Component({
  selector: 'app-notification',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    BadgeModule,
    ButtonModule,
    OverlayPanelModule,
    InputSwitchModule,
    ScrollerModule,
    SkeletonModule,
    TooltipModule,
    RippleModule,
    TagModule,
    AvatarModule,
    DividerModule,
    NotificationSeverityPipe,
    TimeAgoPipe,
    BadgeClassPipe,
    TooltipTextPipe,
    NotificationIconPipe
  ],
  template: `
    <div class="inline-block relative">
      <!-- Notification Bell Button -->
      <p-button
        [badge]="notificationService.getDisplayCount()"
        [badgeClass]="notificationService.count() | badgeClass"
        [disabled]="notificationService.count() === 0"
        severity="secondary"
        [text]="true"
        [rounded]="true"
        size="large"
        [pTooltip]="notificationService.count() | tooltipText"
        tooltipPosition="bottom"
        (onClick)="onNotificationClick($event)"
        [class]="getButtonClasses()">
        
        <i class="pi pi-bell text-xl"></i>
      </p-button>

      <!-- Enhanced Notification Panel -->
      <p-overlayPanel 
        #notificationPanel
        [style]="{ width: '420px', maxHeight: '600px' }"
        [showCloseIcon]="true"
        (onHide)="notificationService.closePanel()"
        styleClass="shadow-4 border-round-lg">
        
        <ng-template pTemplate="content">
          <div class="p-0">
            
            <!-- Modern Header with Gradient -->
            <div class="flex justify-content-between align-items-center p-4 bg-primary-50 border-bottom-1 surface-border">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-bell text-primary text-xl"></i>
                <h3 class="m-0 text-xl font-semibold text-color">
                  Notifications
                  @if (notificationService.totalCount() > 0) {
                    <span class="text-primary-500 font-medium ml-1">
                      ({{ notificationService.totalCount() }})
                    </span>
                  }
                </h3>
              </div>
              
              @if (notificationService.notifications().length > 0) {
                <p-button
                  label="Clear All"
                  icon="pi pi-trash"
                  severity="danger"
                  [text]="true"
                  size="small"
                  [loading]="notificationService.isLoading()"
                  (onClick)="clearAllNotifications()" />
                 <p-inputSwitch id="notificationToggle" [ngModel]="notificationService.soundEnabled()" (onChange)="onToggleNotification($event)" />
              }
            </div>

            <!-- Loading State with Better Skeletons -->
            @if (notificationService.isLoading() && notificationService.notifications().length === 0) {
              <div class="p-4">
                @for (item of [1,2,3]; track item) {
                  <div class="flex align-items-start gap-3 mb-3">
                    <p-skeleton shape="circle" size="3rem"></p-skeleton>
                    <div class="flex-1">
                      <p-skeleton width="70%" height="1rem" styleClass="mb-2"></p-skeleton>
                      <p-skeleton width="100%" height="0.8rem" styleClass="mb-2"></p-skeleton>
                      <p-skeleton width="40%" height="0.7rem"></p-skeleton>
                    </div>
                  </div>
                }
              </div>
            }

            <!-- Enhanced Empty State -->
            @if (!notificationService.isLoading() && notificationService.notifications().length === 0) {
              <div class="text-center p-6">
                <div class="bg-surface-100 border-circle w-6rem h-6rem flex align-items-center justify-content-center mx-auto mb-4">
                  <i class="pi pi-bell-slash text-4xl text-surface-400"></i>
                </div>
                <h4 class="text-color-secondary font-medium mb-2">No notifications yet</h4>
                <p class="text-color-secondary text-sm m-0 line-height-3">
                  When you have notifications, they'll appear here
                </p>
              </div>
            }

            <!-- Enhanced Notification List -->
            @if (notificationService.notifications().length > 0) {
              <div class="notification-list-container">
                <p-scroller
                  #scroller
                  [items]="notificationService.notifications()"
                  [itemSize]="90"
                  scrollHeight="400px"
                  [lazy]="true"       
                  [loading]="notificationService.isLoading()"
                  (onLazyLoad)="onScrollEnd($event)">
                  
                  <ng-template pTemplate="item" let-notification let-index="index">
                    <div 
                      class="flex align-items-start gap-3 p-4 cursor-pointer transition-colors transition-duration-200 hover:bg-surface-50 border-bottom-1 surface-border"
                      [class.bg-primary-50]="!notification.read"
                      [class.border-left-3]="!notification.read"
                      [class.border-primary]="!notification.read"
                      (click)="markAsRead(notification)">
                      
                      <!-- Notification Icon with Type-based Avatar -->
                      <p-avatar 
                        [icon]="notification.title | notificationIcon" 
                        [style]="getAvatarStyle(notification.title)"
                        size="large"
                        shape="circle">
                      </p-avatar>
                      
                      <!-- Notification Content -->
                      <div class="flex-1 overflow-hidden">
                        <div class="flex justify-content-between align-items-start mb-2">
                          <h5 class="m-0 font-semibold text-color line-height-3 pr-2">
                            {{ notification.title }}
                          </h5>
                          <p-tag 
                            [value]="notification.type"
                            [severity]="notification.type | notificationSeverity"
                            [rounded]="true"
                            styleClass="text-xs" />
                        </div>
                        
                        <p class="text-color-secondary text-sm line-height-3 m-0 mb-2 overflow-hidden"
                           style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                          {{ notification.message }}
                        </p>
                        
                        <div class="flex justify-content-between align-items-center">
                          <small class="text-color-secondary text-xs">
                            {{ notification.timestamp | timeAgo }}
                          </small>
                          @if (!notification.read) {
                            <div class="flex align-items-center gap-1">
                              <i class="pi pi-circle-fill text-primary text-xs"></i>
                              <span class="text-primary text-xs font-medium">New</span>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </ng-template>

                  <!-- Enhanced Loading More Template -->
                  <ng-template pTemplate="loader">
                    <div class="flex align-items-center gap-3 p-4">
                      <p-skeleton shape="circle" size="3rem"></p-skeleton>
                      <div class="flex-1">
                        <p-skeleton width="70%" height="1rem" styleClass="mb-2"></p-skeleton>
                        <p-skeleton width="100%" height="0.8rem"></p-skeleton>
                      </div>
                    </div>
                  </ng-template>

                </p-scroller>

                <!-- Load More Button -->
                <!-- @if (notificationService.hasMore() && !notificationService.isLoading()) {
                  <div class="text-center p-3 border-top-1 surface-border">
                    <p-button
                      label="Load More Notifications"
                      icon="pi pi-chevron-down"
                      severity="secondary"
                      [text]="true"
                      size="small"
                      (onClick)="loadMoreNotifications()" />
                  </div>
                } -->
              </div>
            }
          </div>
        </ng-template>
      </p-overlayPanel>
    </div>
  `
})
export class NotificationComponent {
  @ViewChild('notificationPanel') notificationPanel!: OverlayPanel;
  
  readonly notificationService = inject(NotificationService);
  
  private lastCount = 0;

  constructor() {
    // Effect to trigger shake animation on new notifications
    effect(() => {
      const currentCount = this.notificationService.count();
      if (currentCount > this.lastCount && currentCount > 0) {
        // Animation handled by getButtonClasses()
      }
      this.lastCount = currentCount;
    });
  }

  async onNotificationClick(event: Event): Promise<void> {
    if (this.notificationService.count() === 0) return;
    
    this.notificationPanel.toggle(event);
    await this.notificationService.onIconClick();
  }

  async loadMoreNotifications(): Promise<void> {
    await this.notificationService.loadMoreNotifications();
  }

  async onScrollEnd(event: any): Promise<void> {
    
    // Check if user scrolled to bottom and load more if needed
    if (event.last === this.notificationService.notifications().length) {
      if (!this.notificationService.isLoading()) {
        await this.loadMoreNotifications();
      }
    }
  }

  async markAsRead(notification: NotificationItem): Promise<void> {
    if (!notification.read) {
      await this.notificationService.markAsRead(notification.id);
    }
  }

  async clearAllNotifications(): Promise<void> {
    await this.notificationService.clearAllNotifications();
    this.notificationPanel.hide();
  }

  getButtonClasses(): string {
    const baseClasses = 'notification-button';
    const shouldShake = this.notificationService.count() > 0 && 
                       this.notificationService.count() !== this.lastCount;
    
    return shouldShake ? `${baseClasses} animate-pulse` : baseClasses;
  }

  getAvatarStyle(type: string): any {
    const colorMap: Record<string, any> = {
      'success': { 'background-color': 'var(--green-100)', 'color': 'var(--green-600)' },
      'info': { 'background-color': 'var(--blue-100)', 'color': 'var(--blue-600)' },
      'overspeed': { 'background-color': 'var(--yellow-100)', 'color': 'var(--yellow-600)' },
      'sos': { 'background-color': 'var(--red-100)', 'color': 'var(--red-600)' }
    };
    return colorMap[type] || { 'background-color': 'var(--surface-100)', 'color': 'var(--surface-600)' };
  }

  onToggleNotification(event: any): void {
    console.log(event);
    this.notificationService.toggleSound();
  }
}