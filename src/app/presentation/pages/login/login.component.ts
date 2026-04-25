import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../../domain/services/autenticacion.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary via-cyan-400 to-secondary flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Card Login -->
        <div class="bg-white rounded-lg shadow-2xl p-8">
          <!-- Logo -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <span class="text-white text-3xl">♥</span>
            </div>
            <h1 class="text-2xl font-bold text-foreground">RedComunitaria</h1>
            <p class="text-gray-500 text-sm">Solidaridad que conecta</p>
          </div>

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="space-y-6">
            <!-- Email Input -->
            <div>
              <label for="email" class="block text-sm font-semibold text-foreground mb-2">
                Correo Electronico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="form.email"
                placeholder="tu@email.com"
                class="input-base"
                required
              />
            </div>

            <!-- Password Input -->
            <div>
              <label for="password" class="block text-sm font-semibold text-foreground mb-2">
                Contrasena
              </label>
              <input
                type="password"
                id="password"
                name="password"
                [(ngModel)]="form.password"
                placeholder="Tu contrasena"
                class="input-base"
                required
              />
            </div>

            <!-- Error Message -->
            <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {{ error }}
            </div>

            <!-- Loading State -->
            <button
              type="submit"
              [disabled]="isLoading"
              class="w-full btn-primary disabled:opacity-50"
            >
              <span *ngIf="!isLoading">Iniciar Sesion</span>
              <span *ngIf="isLoading">Cargando...</span>
            </button>
          </form>

          <!-- Footer -->
          <div class="mt-6 text-center text-sm text-gray-500">
            <p>No tienes cuenta? <a href="#" class="text-primary font-semibold hover:underline">Registrate aqui</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .input-base {
      @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition;
    }

    .btn-primary {
      @apply px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition w-full;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AutenticacionService);
  private router = inject(Router);

  form = {
    email: '',
    password: ''
  };

  isLoading = false;
  error: string | null = null;

  onSubmit(): void {
    this.error = null;
    
    if (!this.form.email || !this.form.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.isLoading = true;
    
    this.authService.login(this.form.email, this.form.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Error al iniciar sesion';
      }
    });
  }
}
