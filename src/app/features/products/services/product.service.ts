import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';

export interface Product {
  id: number;
  maSanPham: string;
  tenSanPham: string;
  idDanhMuc: number;
  donViTinh: string;
  giaNhap: number;
  giaBan: number;
  soLuongTon: number;
  tonToiThieu: number;
  trangThai: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly ls = inject(LocalStorageService);
  private readonly DATA_KEY = STORAGE_KEYS.PRODUCTS_DATA;

  getAll(): Product[] {
    return this.ls.getAll<Product>(this.DATA_KEY);
  }

  hasProductsInCategory(categoryId: number): boolean {
    const products = this.getAll();
    return products.some((p) => p.idDanhMuc === categoryId);
  }
}
