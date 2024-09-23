import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'cadastrar',
        loadComponent: () => import('./cadastrar-steps.component').then(c => c.CadastrarStepsComponent)
    },
    {
        path: '',
        redirectTo: 'cadastrar',
        pathMatch: 'full'
    }

];
