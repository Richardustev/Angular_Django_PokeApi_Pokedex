import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RegisterModel } from '../models/registerModel';

@Injectable({
    providedIn: 'root'
})
export class ServicioRegistro {
    private apiUrl = 'http://localhost:8000/api/register/'; // Cambia la URL a tu endpoint de registro
    private tokenKey = 'authToken';
    private platformId = inject(PLATFORM_ID);
    
    // Signal para estado de autenticación (opcional, pero útil)
    isAuthenticated = signal<boolean>(this.isLoggedIn());

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    // Verificar si estamos en el navegador
    private isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    registro(credenciales: RegisterModel): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(this.apiUrl, credenciales)
        .pipe(
            tap(response => {
            if (response.token && this.isBrowser()) {
                // Guarda el token en el almacenamiento local después del registro exitoso
                localStorage.setItem(this.tokenKey, response.token);
                this.isAuthenticated.set(true);
                // Opcionalmente, redirige al usuario a una página protegida
                this.router.navigate(['/']); 
            }
            }),
            catchError(this.handleError)
        );
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
        let errorMessage = 'Conection error';
        
        if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente o de la red
        errorMessage = `Error: ${error.error.message}`;
        } else {
        // El backend devolvió un código de respuesta no exitoso
        errorMessage = error.error?.error || `Error ${error.status}: ${error.message}`;
        }
        
        // Devolver un error observable con un mensaje de error claro
        return throwError(() => new Error(errorMessage));
    }
}