import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ServicioLogin } from '../services/servicio-login';

export const authGuard: CanActivateFn = (route, state) => {
    const servicioLogin = inject(ServicioLogin);
    const router = inject(Router);

    // En SSR, siempre permitir la navegación y dejar que el cliente redirija
    if (!servicioLogin.isLoggedIn()) {
        // Usar setTimeout para evitar problemas de cambio de detección durante la navegación
        setTimeout(() => {
        router.navigate(['/login']);
        });
        return false;
    }

    return true;
};