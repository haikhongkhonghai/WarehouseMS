import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly ls = inject(LocalStorageService);

  private readonly DATA_KEY = STORAGE_KEYS.CATEGORIES_DATA;
  private readonly SEQ_KEY = STORAGE_KEYS.CATEGORIES_SEQ;

  getAll(): Category[] {
    return this.ls.getAll<Category>(this.DATA_KEY);
  }

  getById(id: number): Category | null {
    return this.ls.getById<Category>(this.DATA_KEY, id);
  }

  create(category: Omit<Category, 'id'>): Category {
    this.validateUniqueMa(category.maDanhMuc);
    return this.ls.insert<Category>(this.DATA_KEY, this.SEQ_KEY, category);
  }

  update(category: Category): void {
    const existing = this.ls.getById<Category>(this.DATA_KEY, category.id);
    if (!existing) {
      throw new Error('Danh mục không tồn tại.');
    }
    if (existing.maDanhMuc !== category.maDanhMuc) {
      this.validateUniqueMa(category.maDanhMuc);
    }
    const success = this.ls.update<Category>(this.DATA_KEY, category);
    if (!success) {
      throw new Error('Không thể cập nhật danh mục.');
    }
  }

  delete(id: number, hasProducts: boolean): void {
    if (hasProducts) {
      throw new Error('Không thể xóa danh mục vì còn sản phẩm thuộc danh mục này.');
    }
    const success = this.ls.delete<Category>(this.DATA_KEY, id);
    if (!success) {
      throw new Error('Danh mục không tồn tại.');
    }
  }

  getAllCodes(): string[] {
    return this.getAll().map((c) => c.maDanhMuc);
  }

  private validateUniqueMa(maDanhMuc: string): void {
    const existing = this.getAll();
    if (existing.some((c) => c.maDanhMuc === maDanhMuc)) {
      throw new Error(`Mã danh mục "${maDanhMuc}" đã tồn tại.`);
    }
  }
}
