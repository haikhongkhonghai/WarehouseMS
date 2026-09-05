import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'categories/:id/edit',
    renderMode: RenderMode.Server,
  },
  {
    path: 'products/:id/edit',
    renderMode: RenderMode.Server,
  },
  {
    path: 'transactions/import/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'transactions/export/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
