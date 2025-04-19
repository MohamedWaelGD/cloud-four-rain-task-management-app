import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./workspaces.component').then(c => c.WorkspacesComponent),
    },
    {
        path: ':uuid',
        children: [
            {
                path: 'board',
                loadComponent: () => import('./pages/board/board.component').then(c => c.BoardComponent),
            }
        ]
    }
]