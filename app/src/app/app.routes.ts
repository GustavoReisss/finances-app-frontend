import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './shared/layouts/default-layout/default-layout.component';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.routes').then(m => m.routes)
    },
    {
        path: '',
        component: DefaultLayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./modules/dashboard/dashboard.component').then(c => c.DashboardComponent)
            },
            {
                path: 'organizacao-financeira',
                loadChildren: () => import('./modules/organizacao-financeira/organizacao-financeira.routes').then(m => m.routes)
            },
            {
                path: 'investimentos',
                loadComponent: () => import('./modules/investimentos/investimentos.component').then(c => c.InvestimentosComponent)
            },
            {
                path: 'educacao-financeira',
                loadComponent: () => import('./modules/educacao-financeira/educacao-financeira.component').then(c => c.EducacaoFinanceiraComponent)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
