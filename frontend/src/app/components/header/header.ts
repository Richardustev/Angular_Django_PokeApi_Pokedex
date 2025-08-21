import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicioLogin } from '../../services/servicio-login';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private servicioLogin = inject(ServicioLogin);
  private router = inject(Router);

  // Verificar si el usuario está autenticado
  get isAuthenticated(): boolean {
    return this.servicioLogin.isLoggedIn();
  }

  // Cerrar sesión
  logout(): void {
    this.servicioLogin.logout();
    this.router.navigate(['/login']);
  }
}
