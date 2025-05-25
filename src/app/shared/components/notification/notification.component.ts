// notification.component.ts
import { Component, inject, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ScrollerModule } from 'primeng/scroller';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { OverlayPanel } from 'primeng/overlaypanel';
import { NotificationService, NotificationItem  } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    BadgeModule,
    ButtonModule,
    OverlayPanelModule,
    ScrollerModule,
    SkeletonModule,
    TooltipModule,
    RippleModule,
    TagModule
  ],
  template: `
    <div class="notification-container">
      <!-- Notification Bell Icon with Badge -->
      <p-button
        [badge]="notificationService.getDisplayCount()"
        [badgeClass]="getBadgeClass()"
        [disabled]="notificationService.count() === 0"
        severity="secondary"
        [text]="true"
        [rounded]="true"
        size="large"
        [pTooltip]="getTooltipText()"
        tooltipPosition="bottom"
        (onClick)="onNotificationClick($event)"
        class="notification-button"
        [class.shake]="shouldShake()">
        
        <i class="pi pi-bell" 
           [class]="getIconClass()"
           style="font-size: 1.3rem"></i>
      </p-button>

      <!-- Notification Panel -->
      <p-overlayPanel 
        #notificationPanel
        [style]="{ width: '400px', maxHeight: '500px' }"
        [showCloseIcon]="true"
        (onHide)="notificationService.closePanel()"
        styleClass="notification-panel">
        
        <ng-template pTemplate="content">
          <div class="notification-panel-content">
            
            <!-- Header -->
            <div class="notification-header">
              <h3 class="notification-title">
                Notifications
                <span class="notification-count" *ngIf="notificationService.totalCount() > 0">
                  ({{ notificationService.totalCount() }})
                </span>
              </h3>
              
              <p-button
                *ngIf="notificationService.notifications().length > 0"
                label="Clear All"
                severity="danger"
                [text]="true"
                size="small"
                [loading]="notificationService.isLoading()"
                (onClick)="clearAllNotifications()"
                class="clear-all-btn" />
            </div>

            <!-- Loading State -->
            <div *ngIf="notificationService.isLoading() && notificationService.notifications().length === 0" 
                 class="loading-container">
              <p-skeleton height="4rem" styleClass="mb-2" *ngFor="let item of [1,2,3]"></p-skeleton>
            </div>

            <!-- Empty State -->
            <div *ngIf="!notificationService.isLoading() && notificationService.notifications().length === 0" 
                 class="empty-state">
              <i class="pi pi-bell-slash empty-icon"></i>
              <p class="empty-message">No notifications available</p>
            </div>

            <!-- Notification List with Virtual Scrolling -->
            <div *ngIf="notificationService.notifications().length > 0" 
                 class="notification-list-container">
              
              <p-scroller
                #scroller
                [items]="notificationService.notifications()"
                [itemSize]="80"
                scrollHeight="350px"
                styleClass="notification-scroller"
                [lazy]="true"       
                [loading]="notificationService.isLoading()"
                (onLazyLoad)="onScrollEnd($event)">
                
                <ng-template pTemplate="item" let-notification let-index="index">
                  <div class="notification-item"
                       [class.unread]="!notification.read"
                       (click)="markAsRead(notification)">
                    
                    <div class="notification-content">
                      <div class="notification-header-item">
                        <span class="notification-item-title">{{ notification.title }}</span>
                        <p-tag 
                          [value]="notification.type"
                          [severity]="getNotificationSeverity(notification.type)"
                          [rounded]="true"
                          styleClass="notification-type-tag" />
                      </div>
                      
                      <p class="notification-message">{{ notification.message }}</p>
                      
                      <div class="notification-footer">
                        <small class="notification-time">
                          {{ formatTime(notification.timestamp) }}
                        </small>
                        <div class="notification-status">
                          <i *ngIf="!notification.read" 
                             class="pi pi-circle-fill unread-indicator"
                             title="Unread"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </ng-template>

                <!-- Loading More Template -->
                <ng-template pTemplate="loader">
                  <div class="loading-more">
                    <p-skeleton height="4rem" styleClass="mb-2"></p-skeleton>
                  </div>
                </ng-template>

              </p-scroller>

              <!-- Load More Button (fallback) -->
              <div *ngIf="notificationService.hasMore() && !notificationService.isLoading()" 
                   class="load-more-container">
                <p-button
                  label="Load More"
                  severity="secondary"
                  [text]="true"
                  size="small"
                  (onClick)="loadMoreNotifications()"
                  class="load-more-btn" />
              </div>

            </div>
          </div>
        </ng-template>
      </p-overlayPanel>
    </div>
  `,
  styles: [`
    .notification-container {
      position: relative;
      display: inline-block;
    }

    .notification-button {
      position: relative;
    }

    .notification-button.shake {
      animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    .notification-panel-content {
      padding: 0;
    }

    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid var(--surface-border);
      background: var(--surface-50);
    }

    .notification-title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-color);
    }

    .notification-count {
      color: var(--primary-color);
      font-weight: 500;
    }

    .loading-container, .empty-state {
      padding: 2rem;
      text-align: center;
    }

    .empty-icon {
      font-size: 3rem;
      color: var(--surface-400);
      margin-bottom: 1rem;
    }

    .empty-message {
      color: var(--text-color-secondary);
      margin: 0;
    }

    .notification-list-container {
      max-height: 350px;
      overflow: hidden;
    }

    .notification-item {
      padding: 1rem;
      border-bottom: 1px solid var(--surface-border);
      cursor: pointer;
      transition: background-color 0.2s;
      position: relative;
    }

    .notification-item:hover {
      background: var(--surface-hover);
    }

    .notification-item.unread {
      background: var(--primary-50);
      border-left: 3px solid var(--primary-color);
    }

    .notification-content {
      width: 100%;
    }

    .notification-header-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }

    .notification-item-title {
      font-weight: 600;
      color: var(--text-color);
      font-size: 0.9rem;
      flex: 1;
      margin-right: 0.5rem;
    }

    .notification-type-tag {
      font-size: 0.7rem !important;
      min-width: auto;
    }

    .notification-message {
      color: var(--text-color-secondary);
      font-size: 0.85rem;
      line-height: 1.4;
      margin: 0 0 0.5rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .notification-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .notification-time {
      color: var(--text-color-secondary);
      font-size: 0.75rem;
    }

    .unread-indicator {
      color: var(--primary-color);
      font-size: 0.5rem;
    }

    .loading-more, .load-more-container {
      padding: 1rem;
      text-align: center;
    }

    .clear-all-btn {
      font-size: 0.8rem;
    }

    .load-more-btn {
      font-size: 0.85rem;
    }

    /* Responsive Design */
    @media (max-width: 480px) {
      .notification-panel {
        width: 90vw !important;
        max-width: 350px !important;
      }
    }

    /* PrimeNG Override */
    :host ::ng-deep .p-overlaypanel-content {
      padding: 0;
    }

    :host ::ng-deep .notification-scroller .p-scroller-content {
      width: 100%;
    }
  `]
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
        // Shake animation will be triggered by shouldShake()
      }
      this.lastCount = currentCount;
    });
  }

  async onNotificationClick(event: Event): Promise<void> {
    
    if (this.notificationService.count() === 0) return;
    
    this.notificationPanel.toggle(event);
    await this.notificationService.onIconClick();
    console.log(this.notificationService.notifications(), 'notification count');
  }

  async loadMoreNotifications(): Promise<void> {
    await this.notificationService.loadMoreNotifications();
  }

  async onScrollEnd(event: any): Promise<void> {
    console.log(event, 'scroll event');
    console.log(this.notificationService.notifications().length);
    console.log(this.notificationService.hasMore(),!this.notificationService.isLoading());
    
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

  getBadgeClass(): string {
    const count = this.notificationService.count();
    if (count === 0) return 'p-badge-secondary';
    if (count > 10) return 'p-badge-danger';
    return 'p-badge-warning';
  }

  getIconClass(): string {
    const baseClass = 'text-orange-500';
    return this.shouldShake() ? `${baseClass} p-shake` : baseClass;
  }

  shouldShake(): boolean {
    return this.notificationService.count() > 0 && 
           this.notificationService.count() !== this.lastCount;
  }

  getTooltipText(): string {
    const count = this.notificationService.count();
    if (count === 0) return 'No new notifications';
    return `${count} new notification${count > 1 ? 's' : ''}`;
  }

  getNotificationSeverity(type: string): 'success' | 'info' | 'warning' | 'danger' {
    const severityMap: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
      'success': 'success',
      'info': 'info',
      'warning': 'warning',
      'error': 'danger'
    };
    return severityMap[type] || 'info';
  }

  formatTime(timestamp: Date): string {
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