import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';
import { Product, TrangThaiSanPham } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly ls = inject(LocalStorageService);

  private readonly DATA_KEY = STORAGE_KEYS.PRODUCTS_DATA;
  private readonly SEQ_KEY = STORAGE_KEYS.PRODUCTS_SEQ;

  getAll(): Product[] {
    return this.ls.getAll<Product>(this.DATA_KEY);
  }

  getById(id: number): Product | null {
    return this.ls.getById<Product>(this.DATA_KEY, id);
  }

  create(product: Omit<Product, 'id'>): Product {
    this.validateUniqueMa(product.maSanPham);
    this.validateBusinessRules(product);
    return this.ls.insert<Product>(this.DATA_KEY, this.SEQ_KEY, product);
  }

  update(product: Product): void {
    const existing = this.ls.getById<Product>(this.DATA_KEY, product.id);
    if (!existing) {
      throw new Error('Sản phẩm không tồn tại.');
    }
    if (existing.maSanPham !== product.maSanPham) {
      this.validateUniqueMa(product.maSanPham);
    }
    this.validateBusinessRules(product);
    const success = this.ls.update<Product>(this.DATA_KEY, product);
    if (!success) {
      throw new Error('Không thể cập nhật sản phẩm.');
    }
  }

  delete(id: number): void {
    const success = this.ls.delete<Product>(this.DATA_KEY, id);
    if (!success) {
      throw new Error('Sản phẩm không tồn tại.');
    }
  }

  hasProductsInCategory(categoryId: number): boolean {
    return this.getAll().some(p => p.idDanhMuc === categoryId);
  }

  search(keyword: string, products: Product[]): Product[] {
    if (!keyword.trim()) {
      return products;
    }
    const lower = keyword.toLowerCase().trim();
    return products.filter(p =>
      p.tenSanPham.toLowerCase().includes(lower) ||
      p.maSanPham.toLowerCase().includes(lower)
    );
  }

  filterByCategory(categoryId: number | null, products: Product[]): Product[] {
    if (!categoryId) {
      return products;
    }
    return products.filter(p => p.idDanhMuc === categoryId);
  }

  filterByStatus(status: TrangThaiSanPham | null, products: Product[]): Product[] {
    if (!status) {
      return products;
    }
    return products.filter(p => p.trangThai === status);
  }

  sort(field: 'tenSanPham' | 'soLuongTon', direction: 'asc' | 'desc', products: Product[]): Product[] {
    return [...products].sort((a, b) => {
      let comparison: number;
      if (field === 'tenSanPham') {
        comparison = a.tenSanPham.localeCompare(b.tenSanPham, 'vi');
      } else {
        comparison = a.soLuongTon - b.soLuongTon;
      }
      return direction === 'asc' ? comparison : -comparison;
    });
  }

  getAllCodes(): string[] {
    return this.getAll().map(p => p.maSanPham);
  }

  getLowestStock(count: number): Product[] {
    return this.getAll()
      .filter(p => p.trangThai === TrangThaiSanPham.DANG_KINH_DOANH)
      .sort((a, b) => a.soLuongTon - b.soLuongTon)
      .slice(0, count);
  }

  updateStock(productId: number, newQuantity: number): void {
    const product = this.getById(productId);
    if (!product) {
      throw new Error(`Sản phẩm với ID ${productId} không tồn tại.`);
    }
    product.soLuongTon = newQuantity;
    this.ls.update<Product>(this.DATA_KEY, product);
  }

  private validateUniqueMa(maSanPham: string): void {
    const existing = this.getAll();
    if (existing.some(p => p.maSanPham === maSanPham)) {
      throw new Error(`Mã sản phẩm "${maSanPham}" đã tồn tại.`);
    }
  }

  private validateBusinessRules(product: Omit<Product, 'id'> | Product): void {
    if (product.giaNhap < 0) {
      throw new Error('Giá nhập phải >= 0.');
    }
    if (product.giaBan < 0) {
      throw new Error('Giá bán phải >= 0.');
    }
    if (product.soLuongTon < 0) {
      throw new Error('Số lượng tồn phải >= 0.');
    }
  }
}
