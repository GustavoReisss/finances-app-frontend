import { Route } from "@angular/router";
import { AuthComponent } from "./auth.component";

export const routes: Route[] = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/login/login.component').then(c => c.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/register/register.component').then(c => c.RegisterComponent)
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'login'
            },
        ]
    }
]