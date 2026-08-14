import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-state__icon">📁</div>
      <p class="empty-state__message">{{ message() }}</p>
    </div>
  `,
  styles: [
    `
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 24px;
        text-align: center;
      }
      .empty-state__icon {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.6;
      }
      .empty-state__message {
        font-size: 16px;
        color: #94a3b8;
        margin: 0;
      }
    `,
  ],
})
export class EmptyStateComponent {
  message = input.required<string>();
}
