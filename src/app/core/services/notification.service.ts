import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  success(message: string): void {
    alert(`Thành công: ${message}`);
  }

  error(message: string): void {
    alert(`Lỗi: ${message}`);
  }

  info(message: string): void {
    alert(`Thông tin: ${message}`);
  }
}
