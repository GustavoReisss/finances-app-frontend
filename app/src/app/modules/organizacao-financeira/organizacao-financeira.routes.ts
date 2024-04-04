import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
    },
    {
        path: 'despesas',
        loadComponent: () => import('./features/despesas/despesas.component').then(c => c.DespesasComponent)
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }

];
