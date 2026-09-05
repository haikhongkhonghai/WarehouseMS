import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="page-header">
      <div class="page-header__info">
        <h1 class="page-header__title">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="page-header__subtitle">{{ subtitle() }}</p>
        }
      </div>
      <div class="page-header__actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        gap: 16px;
        flex-wrap: wrap;
      }
      .page-header__title {
        font-size: 24px;
        font-weight: 700;
        color: #0f172a;
        margin: 0 0 4px 0;
      }
      .page-header__subtitle {
        font-size: 14px;
        color: #94a3b8;
        margin: 0;
      }
      .page-header__actions {
        display: flex;
        gap: 12px;
        align-items: center;
      }
    `,
  ],
})
export class PageHeaderComponent {
  title = input.required<string>();
  subtitle = input<string>('');
}
