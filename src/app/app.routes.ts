import { Routes } from '@angular/router';
import { authenticatedGuard } from './core/guards/authenticated/authenticated.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/authentication/authentication.routes').then(m => m.routes)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.routes),
        canActivate: [authenticatedGuard]
    }
];
