// notification.service.ts
import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, timer, EMPTY, of } from 'rxjs';
import { switchMap, catchError, retry, tap, finalize } from 'rxjs/operators';
import { HttpService } from './http.service';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
}

export interface NotificationCountResponse {
  count: number;
  timestamp: Date;
}

export interface NotificationListResponse {
  notifications: NotificationItem[];
  totalCount: number;
  hasMore: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

interface NotificationState {
  count: number;
  notifications: NotificationItem[];
  isLoading: boolean;
  hasMore: boolean;
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpService);
  private readonly destroyRef = inject(DestroyRef);
  
  // Configuration
  private readonly POLLING_INTERVAL = 10000; // 10 seconds
  
  // State management with signals
  private readonly _state = signal<NotificationState>({
    count: 0,
    notifications: [],
    isLoading: false,
    hasMore: true,
    totalCount: 0
  });
  
  // Polling control
  private readonly _isPolling = signal(false);
  private readonly _isIconClicked = signal(false);
  private pollingSubscription: any;
  
  // Public readonly signals
  readonly count = computed(() => this._state().count);
  readonly notifications = computed(() => this._state().notifications);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly hasMore = computed(() => this._state().hasMore);
  readonly totalCount = computed(() => this._state().totalCount);
  readonly isPolling = computed(() => this._isPolling());


  private readonly _lastFetchedTime = signal<string | null>(null);

  
  constructor() {
    this.startPolling();
  }
  
  /**
   * Start polling for notification count
   */
  startPolling(): void {
    if (this._isPolling()) return;
    
    this._isPolling.set(true);
    
    this.pollingSubscription = timer(0, this.POLLING_INTERVAL)
      .pipe(
        switchMap(() => this.pollNotificationCount()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
  
  /**
   * Stop polling
   */
  stopPolling(): void {
    this._isPolling.set(false);
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }
  
  /**
   * Poll notification count with optimized error handling
   */
  private async pollNotificationCount(): Promise<void> {
    try {
      const response = await this.fetchNotificationCount();
      this.handleCountResponse(response);
    } catch (error) {
      this.handlePollingError(error);
    }
  }
  
  /**
   * Fetch notification count from API
   */
private async fetchNotificationCount(): Promise<NotificationCountResponse> {
  const lastFetched = this._lastFetchedTime();
  console.log(lastFetched, 'last fetched time');

  // If lastFetched is null, use current IST time - 5 minutes
  const defaultTime = new Date(Date.now() + (5.5 * 60 * 60 * 1000) - (5 * 60 * 1000))
    .toISOString()
    .split('.')[0];

  const lastTime = lastFetched ?? defaultTime;

  const response = await this.http.get('report/Event/DashboardAlert', { lastTime });

  console.log(response);

  const hasData = Array.isArray(response?.data) && response.data.length > 0;

  // Only update lastFetchedTime if new data is present
  if (hasData) {
    const newEventTime = response.data[0]?.alert?.eventtime;
    this._lastFetchedTime.set(new Date(newEventTime).toISOString().split('.')[0]);
  }

  return {
    count: hasData ? response.data.length : 0,
    timestamp: new Date(lastTime)  // Always return the time used to fetch
  };
}



  
  /**
   * Handle count response and update state
   */
  private handleCountResponse(response: NotificationCountResponse): void {
    const currentCount = this._state().count;
    const newCount = response.count;
    
    // If user hasn't clicked and we have new notifications, accumulate them
    if (!this._isIconClicked() && newCount > 0) {
      this.updateState({
        count: currentCount + newCount
      });
    } else if (this._isIconClicked()) {
      // Reset accumulation after user interaction
      this.updateState({
        count: newCount
      });
    }
  }
  
  /**
   * Handle icon click - fetch notifications
   */
  async onIconClick(): Promise<void> {
    if (this.isLoading()) return;
    
    this._isIconClicked.set(true);
    const currentCount = this.count();
    console.log('Current Count:', currentCount);
    
    
    if (currentCount === 0) return;
    
    try {
      this.updateState({ isLoading: true });
      
      const response = await this.fetchNotificationList({
        page: 1,
        pageSize: currentCount
      });
      
      this.updateState({
        notifications: response.notifications,
        totalCount: response.totalCount,
        hasMore: response.hasMore,
        count: 0 // Reset badge count after viewing
      });
      
    } catch (error) {
      this.handleApiError(error);
    } finally {
      this.updateState({ isLoading: false });
    }
  }
  
  /**
   * Load more notifications for infinite scroll
   */
  async loadMoreNotifications(): Promise<void> {
    if (!this.hasMore() || this.isLoading()) return;
    
    try {
      this.updateState({ isLoading: true });
      
      const currentNotifications = this.notifications();
      const nextPage = Math.floor(currentNotifications.length / 10) + 1;
      
      const response = await this.fetchNotificationList({
        page: nextPage,
        pageSize: 10
      });
      
      this.updateState({
        notifications: [...currentNotifications, ...response.notifications],
        hasMore: response.hasMore,
        totalCount: response.totalCount
      });
      
    } catch (error) {
      this.handleApiError(error);
    } finally {
      this.updateState({ isLoading: false });
    }
  }
  
  /**
   * Fetch notification list from API
   */
  private async fetchNotificationList(params: PaginationParams): Promise<NotificationListResponse> {
    const queryParams = {
      page: params.page.toString(),
      pageSize: params.pageSize.toString()
    };
    
    const response = (await this.http.get('report/Event', queryParams))?.data;
    console.log(response,'listtt');
    
    return {
      notifications: response.data.map((item: any, index: any) => ({
        id: index.toString(),
        title: item.title,
        message: JSON.parse(item.alert.attributes),
        timestamp: new Date(item.alert.eventtime),
        type: item.alert.type,
        read: false
      })),
      totalCount: response.totalCount,
      hasMore: response.hasMore
    };
  }
  
  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      // Update local state
      const notifications = this.notifications().map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      
      this.updateState({ notifications });
      
    } catch (error) {
      this.handleApiError(error);
    }
  }
  
  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<void> {
    try {
      this.updateState({ isLoading: true });
      this.resetNotificationState();
      
    } catch (error) {
      this.handleApiError(error);
    } finally {
      this.updateState({ isLoading: false });
    }
  }
  
  /**
   * Reset notification state
   */
  private resetNotificationState(): void {
    this._isIconClicked.set(false);
    this.updateState({
      count: 0,
      notifications: [],
      hasMore: true,
      totalCount: 0
    });
  }
  
  /**
   * Update state immutably
   */
  private updateState(partialState: Partial<NotificationState>): void {
    this._state.update(current => ({
      ...current,
      ...partialState
    }));
  }
  
  /**
   * Handle HTTP errors with proper typing
   */
  private handleHttpError(error: HttpErrorResponse) {
    console.error('Notification API Error:', {
      status: error.status,
      message: error.message,
      url: error.url,
      timestamp: new Date().toISOString()
    });
    
    // Return empty response to prevent breaking the app
    return of({
      count: 0,
      notifications: [],
      totalCount: 0,
      hasMore: false,
      timestamp: new Date()
    } as any);
  }
  
  /**
   * Handle polling errors
   */
  private handlePollingError(error: any): void {
    console.warn('Polling error occurred:', error);
    // Continue polling even if one request fails
  }
  
  /**
   * Handle general API errors
   */
  private handleApiError(error: any): void {
    console.error('Notification service error:', error);
    // Could emit error to global error handler or show toast
  }
  
  /**
   * Get formatted count for display
   */
  getDisplayCount(): string {
    const count = this.count();
    return count > 99 ? '99+' : count.toString();
  }
  
  /**
   * Clean up resources
   */
  ngOnDestroy(): void {
    this.stopPolling();
  }
}