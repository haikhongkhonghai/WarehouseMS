import { Injectable, inject } from '@angular/core';
import { CategoryService } from '../../categories/services/category.service';
import { ProductService } from '../../products/services/product.service';
import { TransactionService } from '../../transactions/services/transaction.service';
import { LoaiPhieu } from '../../transactions/models/transaction.model';
import { DashboardStats } from '../models/dashboard.model';
import { Product } from '../../products/models/product.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private readonly categoryService = inject(CategoryService);
    private readonly productService = inject(ProductService);
    private readonly transactionService = inject(TransactionService);

    getStats(): DashboardStats {
        const products = this.productService.getAll();
        const transactions = this.transactionService.getAll();

        return {
            tongDanhMuc: this.categoryService.getAll().length,
            tongSanPham: products.length,
            tongPhieuNhap: transactions.filter(t => t.loaiPhieu === LoaiPhieu.NHAP).length,
            tongPhieuXuat: transactions.filter(t => t.loaiPhieu === LoaiPhieu.XUAT).length,
            tongGiaTriTonKho: this.calculateTotalInventoryValue(products),
        };
    }

    getLowestStockProducts(): Product[] {
        return this.productService.getLowestStock(5);
    }

    private calculateTotalInventoryValue(products: Product[]): number {
        return products.reduce((total, p) => total + ((p.giaNhap || 0) * (p.soLuongTon || 0)), 0);
    }
}

