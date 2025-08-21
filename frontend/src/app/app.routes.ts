import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { 
        path: '', 
        component: Home,
        canActivate: [authGuard] // ← Proteger esta ruta
    },
    { 
        path: 'login', 
        component: Login 
    },
    { 
        path: 'register', 
        component: Register 
    },
    { 
        path: '**', 
        redirectTo: 'login',
        pathMatch: 'full' 
    }
];