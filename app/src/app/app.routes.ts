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
                path: 'organizacao-financeira',
                loadChildren: () => import('./modules/organizacao-financeira/organizacao-financeira.routes').then(m => m.routes)
            },
            {
                path: 'acoes',
                loadComponent: () => import('./modules/acoes/acoes.component').then(c => c.AcoesComponent)
            },
            {
                path: 'steps',
                loadChildren: () => import('./modules/cadastrar-steps/cadastrar-steps.routes').then(m => m.routes)
            },
            {
                path: '',
                redirectTo: 'organizacao-financeira',
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
