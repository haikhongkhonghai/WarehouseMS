import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../../products/services/product.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Category } from '../../models/category.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
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
    return this.productService.getAll().filter((p) => p.idDanhMuc === categoryId).length;
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
