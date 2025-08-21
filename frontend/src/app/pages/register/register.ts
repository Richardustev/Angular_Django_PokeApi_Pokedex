import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServicioRegistro } from '../../services/servicio-registro';
import { RegisterModel } from '../../models/registerModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  // Inyección del servicio de registro y del enrutador
  private registroService = inject(ServicioRegistro);
  private router = inject(Router);

  // Señal para los datos del formulario, inicializada con valores vacíos
  // Se usa para el 'two-way data binding' en el HTML
  credenciales = signal<RegisterModel>({
    username: '',
    email: '',
    password: ''
  });

  // Señal para gestionar el estado de carga (mientras se espera la respuesta del servidor)
  isLoading = signal<boolean>(false);

  // Señal para almacenar y mostrar mensajes de error
  errorMessage = signal<string | null>(null);

  /**
   * Maneja el cambio de valor en los campos de entrada del formulario.
   *
   * @param field La propiedad de la credencial a actualizar (username, email, password).
   * @param event El evento de entrada que contiene el nuevo valor.
   */
  onInput(field: keyof RegisterModel, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    // Actualiza la señal de credenciales de forma inmutable para evitar efectos secundarios
    this.credenciales.update(creds => ({ ...creds, [field]: value }));
  }

  /**
   * Maneja el envío del formulario de registro.
   * Llama al servicio de registro y gestiona las respuestas.
   */
  onSubmit(): void {
    this.isLoading.set(true); // Activa el estado de carga
    this.errorMessage.set(null); // Limpia cualquier mensaje de error previo

    const { username, email, password } = this.credenciales();

    // Validar que los campos no estén vacíos antes de enviar
    if (!username || !email || !password) {
      this.errorMessage.set('Por favor, complete todos los campos.');
      this.isLoading.set(false);
      return;
    }

    // Llamada al método de registro del servicio
    this.registroService.registro(this.credenciales())
      .subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          this.isLoading.set(false); // Desactiva el estado de carga
          // El servicio ya maneja la redirección, pero se puede añadir aquí si se desea
        },
        error: (error) => {
          this.errorMessage.set(error.message || 'Error desconocido al registrarse.');
          this.isLoading.set(false); // Desactiva el estado de carga
        }
      });
  }
}
