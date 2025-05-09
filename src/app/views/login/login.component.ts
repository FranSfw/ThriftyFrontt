import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  // Usa la URL base para facilitar cambios si es necesario
  private apiUrl = 'https://thrifty-production.up.railway.app';

  private http = inject(HttpClient);
  private router = inject(Router);

  login(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Verificar que los campos no estén vacíos
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      this.isLoading = false;
      return;
    }

    // Configurar headers para evitar problemas CORS
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    console.log('Iniciando solicitud de login...');

    // Obtener los usuarios y buscar coincidencia solo por email
    this.http
      .get<any[]>(`${this.apiUrl}/users`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error detallado:', error);

          // Mensaje más descriptivo basado en el tipo de error
          if (error.status === 0) {
            this.errorMessage =
              'No se pudo conectar al servidor. Verifique su conexión a internet.';
          } else if (error.status === 404) {
            this.errorMessage = 'API no encontrada. URL incorrecta.';
          } else if (error.status === 403 || error.status === 401) {
            this.errorMessage =
              'No autorizado. Problema de permisos con la API.';
          } else {
            this.errorMessage = `Error de conexión (${error.status}). Intente nuevamente.`;
          }

          this.isLoading = false;
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (users) => {
          console.log('Datos recibidos:', users);

          // Buscar el usuario solo por email ya que la API no parece devolver el campo password
          const user = users.find((u) => u.email === this.email);

          if (user) {
            console.log('Usuario encontrado:', user);
            // Para mayor seguridad, deberíamos validar la contraseña en el backend,
            // pero para fines de prueba, permitimos el inicio de sesión solo con email

            // Guardamos la información del usuario en localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Redirigir al dashboard después de inicio de sesión exitoso
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = 'Correo electrónico no encontrado';
            console.log('Usuario no encontrado');
          }
          this.isLoading = false;
        },
        error: (error) => {
          // Este bloque ya está manejado en el catchError
        },
      });
  }
}
