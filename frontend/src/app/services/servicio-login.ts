import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginModel } from '../models/loginModel';

@Injectable({
  providedIn: 'root'
})
export class ServicioLogin {
  private apiUrl = 'http://localhost:8000/api/login/';
  private tokenKey = 'authToken';
  private platformId = inject(PLATFORM_ID);
  
  // Signal para estado de autenticación
  isAuthenticated = signal<boolean>(this.isLoggedIn());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Verificar si estamos en el navegador
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(credenciales: LoginModel): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.apiUrl, credenciales)
      .pipe(
        tap(response => {
          if (response.token && this.isBrowser()) {
            localStorage.setItem(this.tokenKey, response.token);
            this.isAuthenticated.set(true);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
    }
    // Redirigir al login
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser()) {
      return false;
    }
    const token = localStorage.getItem(this.tokenKey);
    return !!token;
  }
  
  getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error de conexión';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.error || `Error ${error.status}: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}