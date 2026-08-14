import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../../products/services/product.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Category } from '../models/category.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, EmptyStateComponent, ConfirmDialogComponent],
  template: `
    <app-page-header title="Quản lý Danh mục" subtitle="Danh sách các danh mục sản phẩm">
      <a routerLink="/categories/new" class="btn btn--primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Thêm danh mục
      </a>
    </app-page-header>

    @if (categories().length > 0) {
      <div class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Mã danh mục</th>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Số sản phẩm</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              @for (category of categories(); track category.id) {
                <tr>
                  <td><span class="code-badge">{{ category.maDanhMuc }}</span></td>
                  <td class="td--bold">{{ category.tenDanhMuc }}</td>
                  <td class="td--muted">{{ category.moTa || '—' }}</td>
                  <td>{{ getProductCount(category.id) }}</td>
                  <td>
                    <div class="action-btns">
                      <a [routerLink]="['/categories', category.id, 'edit']" class="btn-icon btn-icon--edit" title="Sửa">
                        ✏️
                      </a>
                      <button class="btn-icon btn-icon--delete" (click)="confirmDelete(category)" title="Xóa">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    } @else {
      <div class="card">
        <app-empty-state message="Chưa có danh mục nào. Hãy bấm 'Thêm danh mục' để bắt đầu." />
      </div>
    }

    <app-confirm-dialog
      [visible]="showDeleteDialog()"
      title="Xóa danh mục"
      [message]="'Bạn có chắc chắn muốn xóa danh mục \\'' + (selectedCategory()?.tenDanhMuc ?? '') + '\\'?'"
      (confirmed)="onDeleteConfirmed()"
      (cancelled)="showDeleteDialog.set(false)"
    />
  `,
  styles: [`
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }
    .table-container { overflow-x: auto; }
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    .data-table th {
      text-align: left;
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
    }
    .data-table td {
      padding: 12px 16px;
      font-size: 14px;
      color: #475569;
      border-bottom: 1px solid #f1f5f9;
    }
    .data-table tbody tr { transition: background 0.15s; }
    .data-table tbody tr:hover { background: #f8fafc; }
    .td--bold { font-weight: 600; color: #1e293b; }
    .td--muted { color: #94a3b8; }

    .code-badge {
      background: #eef2ff;
      color: #6366f1;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      font-family: monospace;
    }
    .action-btns { display: flex; gap: 6px; }
    .btn-icon {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s;
      text-decoration: none;
    }
    .btn-icon--edit {
      background: #eff6ff;
      color: #3b82f6;
    }
    .btn-icon--edit:hover { background: #dbeafe; }
    .btn-icon--delete {
      background: #fef2f2;
      color: #ef4444;
    }
    .btn-icon--delete:hover { background: #fee2e2; }

    .btn--primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn--primary:hover {
      background: #4f46e5;
    }
  `],
})
export class CategoryListComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly notificationService = inject(NotificationService);

  protected readonly categories = signal<Category[]>([]);
  protected readonly showDeleteDialog = signal(false);
  protected readonly selectedCategory = signal<Category | null>(null);

  ngOnInit(): void {
    this.loadCategories();
  }

  protected getProductCount(categoryId: number): number {
    return this.productService.getAll().filter(p => p.idDanhMuc === categoryId).length;
  }

  protected confirmDelete(category: Category): void {
    this.selectedCategory.set(category);
    this.showDeleteDialog.set(true);
  }

  protected onDeleteConfirmed(): void {
    const category = this.selectedCategory();
    if (!category) return;

    try {
      const hasProducts = this.productService.hasProductsInCategory(category.id);
      this.categoryService.delete(category.id, hasProducts);
      this.notificationService.success(`Đã xóa danh mục "${category.tenDanhMuc}".`);
      this.loadCategories();
    } catch (error) {
      this.notificationService.error((error as Error).message);
    } finally {
      this.showDeleteDialog.set(false);
      this.selectedCategory.set(null);
    }
  }

  private loadCategories(): void {
    this.categories.set(this.categoryService.getAll());
  }
}
