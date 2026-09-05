import { Routes } from '@angular/router';
import { LoaiPhieu } from './models/transaction.model';

export const transactionRoutes: Routes = [
    {
        path: 'import',
        data: { loaiPhieu: LoaiPhieu.NHAP },
        loadComponent: () =>
            import('./pages/transaction-list/transaction-list.component').then(m => m.TransactionListComponent),
    },
    {
        path: 'import/new',
        data: { loaiPhieu: LoaiPhieu.NHAP },
        loadComponent: () =>
            import('./pages/transaction-form/transaction-form.component').then(m => m.TransactionFormComponent),
    },
    {
        path: 'import/:id',
        loadComponent: () =>
            import('./pages/transaction-detail/transaction-detail.component').then(m => m.TransactionDetailComponent),
    },
    {
        path: 'export',
        data: { loaiPhieu: LoaiPhieu.XUAT },
        loadComponent: () =>
            import('./pages/transaction-list/transaction-list.component').then(m => m.TransactionListComponent),
    },
    {
        path: 'export/new',
        data: { loaiPhieu: LoaiPhieu.XUAT },
        loadComponent: () =>
            import('./pages/transaction-form/transaction-form.component').then(m => m.TransactionFormComponent),
    },
    {
        path: 'export/:id',
        loadComponent: () =>
            import('./pages/transaction-detail/transaction-detail.component').then(m => m.TransactionDetailComponent),
    },
];
