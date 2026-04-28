import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../domain/services/autenticacion.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-cyan-50 to-white">
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <button (click)="router.navigate(['/inicio'])" class="flex items-center gap-2 text-cyan-600 hover:text-cyan-700">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Volver
            </button>
            <h1 class="text-xl font-bold text-gray-800">Registro - RedComunitaria</h1>
            <div class="w-20"></div>
          </div>
        </div>
      </nav>

      <div class="max-w-2xl mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-lg p-8">
          
          <!-- Step 1: Seleccionar Rol -->
          <div *ngIf="currentStep === 1" class="animate-fadeIn">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Elige tu rol en RedComunitaria</h2>
            <p class="text-gray-600 mb-8">Selecciona cómo deseas contribuir a nuestra comunidad:</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                (click)="selectRole('donante')"
                [class.selected]="selectedRole === 'donante'"
                class="role-card"
              >
                <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3 class="text-lg font-semibold text-gray-800">Donante</h3>
                <p class="text-sm text-gray-600 mt-2">Contribuye con recursos</p>
              </button>

              <button
                (click)="selectRole('responsable')"
                [class.selected]="selectedRole === 'responsable'"
                class="role-card"
              >
                <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                <h3 class="text-lg font-semibold text-gray-800">Responsable de Olla</h3>
                <p class="text-sm text-gray-600 mt-2">Gestiona una olla común</p>
              </button>
            </div>

            <button
              (click)="goToStep(2)"
              [disabled]="!selectedRole"
              class="mt-8 w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Continuar
            </button>
          </div>

          <!-- Step 2: Formulario de Registro -->
          <div *ngIf="currentStep === 2" class="animate-fadeIn">
            <button
              (click)="goToStep(1)"
              class="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-6"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
              </svg>
              Volver
            </button>

            <h2 class="text-2xl font-bold text-gray-800 mb-6">
              Regístrate como {{ selectedRole === 'donante' ? 'Donante' : 'Responsable de Olla' }}
            </h2>

            <form [formGroup]="registerForm" (ngSubmit)="submitRegistration()" class="space-y-4">
              <!-- Campos Comunes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  formControlName="nombre"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Tu nombre completo"
                />
                <small *ngIf="registerForm.get('nombre')?.hasError('required')" class="text-red-500">
                  Este campo es requerido
                </small>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  formControlName="email"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="tu@email.com"
                />
                <small *ngIf="registerForm.get('email')?.hasError('email')" class="text-red-500">
                  Ingresa un email válido
                </small>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  formControlName="telefono"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Tu número de teléfono"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  formControlName="password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Mínimo 6 caracteres"
                />
                <small *ngIf="registerForm.get('password')?.hasError('minlength')" class="text-red-500">
                  Mínimo 6 caracteres
                </small>
              </div>

              <!-- Campos para Donante -->
              <ng-container *ngIf="selectedRole === 'donante'">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Donación</label>
                  <select
                    formControlName="tipoContribución"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Selecciona un tipo</option>
                    <option value="alimentos">Alimentos</option>
                    <option value="dinero">Dinero</option>
                    <option value="otros">Otros recursos</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Distrito/Ubicación</label>
                  <input
                    type="text"
                    formControlName="ubicacion"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Tu distrito"
                  />
                </div>
              </ng-container>

              <!-- Campos para Responsable -->
              <ng-container *ngIf="selectedRole === 'responsable'">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Olla Común</label>
                  <input
                    type="text"
                    formControlName="nombreOlla"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Ej: Olla Común Los Jardines"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Ubicación de la Olla</label>
                  <input
                    type="text"
                    formControlName="ubicacion"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Dirección completa"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Número de Beneficiarios</label>
                  <input
                    type="number"
                    formControlName="numeroBeneficiarios"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Aproximado"
                  />
                </div>
              </ng-container>

              <!-- Botones -->
              <div class="flex gap-4 pt-4">
                <button
                  type="button"
                  (click)="goToStep(1)"
                  class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  [disabled]="!registerForm.valid || isLoading"
                  class="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition"
                >
                  {{ isLoading ? 'Registrando...' : 'Registrarse' }}
                </button>
              </div>

              <!-- Mensaje de error -->
              <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {{ errorMessage }}
              </div>
            </form>

            <p class="text-center text-gray-600 mt-6">
              ¿Ya tienes cuenta?
              <button (click)="router.navigate(['/login'])" class="text-cyan-600 hover:text-cyan-700 font-semibold">
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .role-card {
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: white;
      color: #1f2937;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .role-card:hover {
      border-color: #06b6d4;
      box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
    }

    .role-card.selected {
      border-color: #0891b2;
      background-color: #ecf9ff;
      box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
      color: #0891b2;
    }

    .role-card svg {
      color: currentColor;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
  `]
})
export class RegisterComponent implements OnInit {
  router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AutenticacionService);

  currentStep = 1;
  selectedRole: 'donante' | 'responsable' | null = null;
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      tipoContribución: [''],
      ubicacion: [''],
      nombreOlla: [''],
      numeroBeneficiarios: ['']
    });
  }

  selectRole(role: 'donante' | 'responsable') {
    this.selectedRole = role;
  }

  goToStep(step: number) {
    this.currentStep = step;
    this.errorMessage = '';
  }

  submitRegistration() {
    if (!this.registerForm.valid || !this.selectedRole) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.isLoading = true;
    const formData = this.registerForm.value;

    const userData = {
      nombre: formData.nombre,
      email: formData.email,
      password: formData.password,
      telefono: formData.telefono,
      rol: this.selectedRole,
      ...(this.selectedRole === 'donante' && {
        tipo_contribución: formData.tipoContribución,
        ubicacion: formData.ubicacion
      }),
      ...(this.selectedRole === 'responsable' && {
        nombre_olla: formData.nombreOlla,
        ubicacion: formData.ubicacion,
        numero_beneficiarios: formData.numeroBeneficiarios
      })
    };

    this.authService.registrar(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('usuario_nombre', JSON.stringify(response.usuario));
        this.router.navigate(['/splash']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al registrarse. Intenta nuevamente.';
        console.error('Error de registro:', err);
      }
    });
  }
}
