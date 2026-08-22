export type AnalyticsEvent = 
  | 'menu_view'
  | 'item_view'
  | 'order_click'
  | 'whatsapp_click'
  | 'call_click'
  | 'directions_click'
  | 'reservation_started'
  | 'reservation_submitted';

export interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

class AnalyticsService {
  private enabled: boolean = true;

  public track(event: AnalyticsEvent, properties?: EventProperties): void {
    if (!this.enabled) return;

    const payload = {
      event,
      properties: properties || {},
      timestamp: new Date().toISOString(),
    };

    // Replaceable analytics provider dispatcher
    if (__DEV__) {
      console.log('[Analytics Event]', payload.event, payload.properties);
    }
  }

  public setEnabled(status: boolean) {
    this.enabled = status;
  }
}

export const analytics = new AnalyticsService();
