import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  imports: [RouterLink, FormsModule, PageHeaderComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly notificationService = inject(NotificationService);

  protected readonly categories = signal<Category[]>([]);
  protected readonly searchKeyword = signal('');
  protected readonly sortField = signal<'tenDanhMuc' | 'productCount' | null>(null);
  protected readonly sortDirection = signal<'asc' | 'desc'>('asc');
  protected readonly showDeleteDialog = signal(false);
  protected readonly selectedCategory = signal<Category | null>(null);

  private productCountMap = new Map<number, number>();

  protected readonly filteredCategories = computed(() => {
    let result = this.categories();
    result = this.categoryService.search(this.searchKeyword(), result);

    const field = this.sortField();
    if (field) {
      result = this.categoryService.sort(
        field,
        this.sortDirection(),
        result,
        (id) => this.getProductCount(id)
      );
    }

    return result;
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  protected getProductCount(categoryId: number): number {
    if (!this.productCountMap.has(categoryId)) {
      const count = this.productService.getAll().filter((p) => p.idDanhMuc === categoryId).length;
      this.productCountMap.set(categoryId, count);
    }
    return this.productCountMap.get(categoryId)!;
  }

  protected toggleSort(field: 'tenDanhMuc' | 'productCount'): void {
    const currentField = this.sortField();
    if (currentField !== field) {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    } else if (this.sortDirection() === 'asc') {
      this.sortDirection.set('desc');
    } else {
      this.sortField.set(null);
      this.sortDirection.set('asc');
    }
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
    this.productCountMap.clear();
  }
}
