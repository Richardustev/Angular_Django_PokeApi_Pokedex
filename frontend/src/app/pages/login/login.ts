import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginModel } from '../../models/loginModel';
import { ServicioLogin } from '../../services/servicio-login';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  credenciales = signal<LoginModel>({ username: '', password: '' });
  isLoading = signal(false);
  errorMessage = signal('');

  private servicioLogin = inject(ServicioLogin);
  private router = inject(Router);

  ngOnInit(): void {
    // Solo verificar autenticación en el navegador
    if (this.servicioLogin.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onInput(field: keyof LoginModel, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.credenciales.update(current => ({ ...current, [field]: value }));
  }

  onSubmit(): void {
    const creds = this.credenciales();
    
    if (!creds.username || !creds.password) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.servicioLogin.login(creds).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (error: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Error en el inicio de sesión');
      }
    });
  }
}