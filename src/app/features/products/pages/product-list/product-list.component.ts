import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../categories/services/category.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Product, TrangThaiSanPham } from '../../models/product.model';
import { Category } from '../../../categories/models/category.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CurrencyPipe,
    PageHeaderComponent,
    EmptyStateComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly notificationService = inject(NotificationService);

  protected readonly TrangThai = TrangThaiSanPham;
  protected readonly products = signal<Product[]>([]);
  protected readonly categories = signal<Category[]>([]);
  protected readonly searchKeyword = signal('');
  protected readonly filterCategory = signal<number | null>(null);
  protected readonly filterStatus = signal<TrangThaiSanPham | null>(null);
  protected readonly sortField = signal<'tenSanPham' | 'soLuongTon' | null>(null);
  protected readonly sortDirection = signal<'asc' | 'desc'>('asc');
  protected readonly showDeleteDialog = signal(false);
  protected readonly selectedProduct = signal<Product | null>(null);

  protected readonly filteredProducts = computed(() => {
    let result = this.products();
    result = this.productService.search(this.searchKeyword(), result);
    result = this.productService.filterByCategory(this.filterCategory(), result);
    result = this.productService.filterByStatus(this.filterStatus(), result);
    const field = this.sortField();
    if (field) {
      result = this.productService.sort(field, this.sortDirection(), result);
    }
    return result;
  });

  ngOnInit(): void {
    this.loadData();
  }

  protected getCategoryName(id: number): string {
    return this.categoryService.getById(id)?.tenDanhMuc ?? 'N/A';
  }

  protected toggleSort(field: 'tenSanPham' | 'soLuongTon'): void {
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

  protected confirmDelete(p: Product): void {
    this.selectedProduct.set(p);
    this.showDeleteDialog.set(true);
  }

  protected onDeleteConfirmed(): void {
    const p = this.selectedProduct();
    if (!p) return;
    try {
      this.productService.delete(p.id);
      this.notificationService.success(`Đã xóa sản phẩm "${p.tenSanPham}".`);
      this.loadData();
    } catch (error) {
      this.notificationService.error((error as Error).message);
    } finally {
      this.showDeleteDialog.set(false);
      this.selectedProduct.set(null);
    }
  }

  private loadData(): void {
    this.products.set(this.productService.getAll());
    this.categories.set(this.categoryService.getAll());
  }
}
