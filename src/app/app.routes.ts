import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./features/categories/category.routes').then((m) => m.categoryRoutes),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/product.routes').then((m) => m.productRoutes),
      },
      {
        path: 'transactions',
        loadChildren: () =>
          import('./features/transactions/transaction.routes').then(m => m.transactionRoutes),
      },
    ],
  },
];
