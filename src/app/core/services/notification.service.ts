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
  private readonly _isPanelOpen = signal(false);
  private pollingSubscription: any;
  
  // Public readonly signals
  readonly count = computed(() => this._state().count);
  readonly notifications = computed(() => this._state().notifications);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly hasMore = computed(() => this._state().hasMore);
  readonly totalCount = computed(() => this._state().totalCount);
  readonly isPolling = computed(() => this._isPolling());
  readonly isPanelOpen = computed(() => this._isPanelOpen());


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
    const newCount = response.count;

    if (newCount > 0) {
      if (this._isPanelOpen()) {
        const listResponse = await this.fetchNotificationList({
          page: 1,
          pageSize: newCount
        });

        const merged = this.mergeNotifications(this.notifications(), listResponse.notifications);
        this.updateState({
          notifications: merged,
          totalCount: listResponse.totalCount,
          hasMore: listResponse.hasMore
        });

        // Count remains 0 since user has already seen them
        this.updateState({ count: 0 });

      } else {
        this.updateState({
          count: this._state().count + newCount
        });
      }
    }
  } catch (error) {
    this.handlePollingError(error);
  }
}

private mergeNotifications(
  current: NotificationItem[],
  incoming: NotificationItem[]
): NotificationItem[] {
  const seen = new Set(current.map(n => n.id));
  const unique = incoming.filter(n => !seen.has(n.id));
  return [...unique, ...current];
}

closePanel(): void {
  this._isPanelOpen.set(false);
  this.resetNotificationState()
}

  
  /**
   * Fetch notification count from API
   */
private async fetchNotificationCount(): Promise<NotificationCountResponse> {
  const lastFetched = this._lastFetchedTime();
  
  // If lastFetched is null, use current IST time - 5 minutes
  const defaultTime = new Date(Date.now() + (5.5 * 60 * 60 * 1000) - (5 * 60 * 1000))
    .toISOString()
    .split('.')[0];

  const lastTime = lastFetched ?? defaultTime;

  const response = await this.http.get('report/Event/DashboardAlert', { lastTime });
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
    if (!this._isPanelOpen() && newCount > 0) {
      this.updateState({
        count: currentCount + newCount
      });
    } else if (this._isPanelOpen()) {
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

  this._isPanelOpen.set(true);  // was _isIconClicked
  const currentCount = this.count();

  try {
    this.updateState({ isLoading: true });

    const response = await this.fetchNotificationList({
      page: 1,
      pageSize: currentCount || 10
    });
    this.updateState({
      notifications: response.notifications,
      totalCount: response.totalCount,
      hasMore: response.hasMore,
      count: 0  // Clear badge count
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
    
    return {
      notifications: response.data.map((item: any, index: any) => {
        const parsedAttributes = JSON.parse(item?.alert?.attributes || '{}');
        const alertType = parsedAttributes[item?.alert?.type];
        let message = null;
        if (alertType === 'overspeed') {
          message = `${parsedAttributes?.vNo} - ${(parsedAttributes?.spd * 1.852)?.toFixed(2) + ' km/h'} `;
        } else if( alertType === 'sos') {
          message = `${parsedAttributes?.vNo} - SOS Alert`;
        }

        return {
          id: index.toString(),
          title: parsedAttributes?.alarm || 'No Title', // get title from parsed attributes
          message: message,     // or any other field you want
          timestamp: new Date(item.alert.eventtime),
          type: item.alert.type,
          read: false
        };
      }),
      totalCount: response.pagination?.totalCount,
      hasMore: response.pagination?.hasNext
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
    this._isPanelOpen.set(false);
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