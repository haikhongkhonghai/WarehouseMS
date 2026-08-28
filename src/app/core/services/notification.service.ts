import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';

export interface NotificationItem {
  id: number;
  type: NotificationType;
  message: string;
  leaving?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications = signal<NotificationItem[]>([]);
  private _nextId = 0;
  private readonly AUTO_DISMISS_MS = 4000;

  readonly notifications = this._notifications.asReadonly();

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  dismiss(id: number): void {
    this._notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, leaving: true } : n))
    );
    setTimeout(() => {
      this._notifications.update((list) => list.filter((n) => n.id !== id));
    }, 300);
  }

  private show(type: NotificationType, message: string): void {
    const id = this._nextId++;
    this._notifications.update((list) => [...list, { id, type, message }]);

    setTimeout(() => this.dismiss(id), this.AUTO_DISMISS_MS);
  }
}
