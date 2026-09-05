import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { DashboardStats } from '../models/dashboard.model';
import { Product } from '../../products/models/product.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    imports: [CurrencyPipe, RouterLink, PageHeaderComponent],
    templateUrl: './dashboard-page.component.html',
    styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements OnInit {
    private readonly dashboardService = inject(DashboardService);

    protected readonly stats = signal<DashboardStats>({
        tongDanhMuc: 0,
        tongSanPham: 0,
        tongPhieuNhap: 0,
        tongPhieuXuat: 0,
        tongGiaTriTonKho: 0,
    });
    protected readonly lowStockProducts = signal<Product[]>([]);

    ngOnInit(): void {
        this.loadData();
    }

    private loadData(): void {
        this.stats.set(this.dashboardService.getStats());
        this.lowStockProducts.set(this.dashboardService.getLowestStockProducts());
    }
}
