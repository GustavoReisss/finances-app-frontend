import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'despesas',
        loadComponent: () => import('./features/despesas/despesas.component').then(c => c.DespesasComponent)
    },
    {
        path: 'despesas/historico',
        loadComponent: () => import('./features/despesas/features/historico-despesas/historico-despesas.component').then(c => c.HistoricoDespesasComponent)
    },
    {
        path: '',
        redirectTo: 'despesas',
        pathMatch: 'full'
    }

];
