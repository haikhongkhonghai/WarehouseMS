import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="confirm-dialog-overlay" (click)="cancel()">
        <div class="confirm-dialog" (click)="$event.stopPropagation()">
          <div class="confirm-dialog__header">
            <h3 class="confirm-dialog__title">{{ title() }}</h3>
          </div>
          <div class="confirm-dialog__body">
            <p class="confirm-dialog__message">{{ message() }}</p>
          </div>
          <div class="confirm-dialog__footer">
            <button class="btn btn--secondary" (click)="cancel()">Hủy</button>
            <button class="btn btn--danger" (click)="confirm()">Xác nhận</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .confirm-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(2px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .confirm-dialog {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        width: 100%;
        max-width: 400px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      .confirm-dialog__header {
        padding: 16px 20px;
        border-bottom: 1px solid #e2e8f0;
      }
      .confirm-dialog__title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #0f172a;
      }
      .confirm-dialog__body {
        padding: 20px;
      }
      .confirm-dialog__message {
        margin: 0;
        font-size: 14px;
        color: #475569;
        line-height: 1.5;
      }
      .confirm-dialog__footer {
        padding: 16px 20px;
        border-top: 1px solid #e2e8f0;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      .btn {
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 500;
        border-radius: 6px;
        cursor: pointer;
        border: none;
        transition: all 0.15s;
      }
      .btn--secondary {
        background: #f1f5f9;
        color: #475569;
      }
      .btn--secondary:hover {
        background: #e2e8f0;
      }
      .btn--danger {
        background: #ef4444;
        color: white;
      }
      .btn--danger:hover {
        background: #dc2626;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  visible = input<boolean>(false);
  title = input<string>('Xác nhận');
  message = input.required<string>();

  confirmed = output<void>();
  cancelled = output<void>();

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
