import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticacionService } from '../../../domain/services/autenticacion.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-10 animate-fadeIn">
      <div class="bg-white shadow-lg rounded-2xl p-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p class="text-gray-600">Edita tus datos personales y mantén tu cuenta actualizada.</p>
          </div>
          <span class="inline-flex items-center rounded-full bg-cyan-100 text-cyan-800 px-4 py-2 text-sm font-medium">
            Rol: {{ currentRole | uppercase }}
          </span>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
            <input
              type="text"
              formControlName="nombre"
              class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
              placeholder="Tu nombre completo"
            />
            <p *ngIf="profileForm.get('nombre')?.invalid && profileForm.get('nombre')?.touched" class="mt-2 text-sm text-red-600">
              Nombre es requerido.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
            <input
              type="email"
              formControlName="email"
              class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
              placeholder="tu@email.com"
            />
            <p *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched" class="mt-2 text-sm text-red-600">
              Ingresa un email válido.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
            <input
              type="password"
              formControlName="password"
              class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
              placeholder="Dejar vacío para mantener la contraseña actual"
            />
          </div>

          <div class="flex gap-4 flex-col sm:flex-row">
            <button
              type="submit"
              [disabled]="profileForm.invalid || isLoading"
              class="btn-primary w-full sm:w-auto"
            >
              {{ isLoading ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>

          <div *ngIf="successMessage" class="rounded-xl bg-green-50 border border-green-200 p-4 text-green-800">
            {{ successMessage }}
          </div>

          <div *ngIf="errorMessage" class="rounded-xl bg-red-50 border border-red-200 p-4 text-red-800">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .animate-fadeIn {
        animation: fadeIn 0.4s ease-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `
  ]
})
export class PerfilComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AutenticacionService);

  profileForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  currentRole: string | null = null;

  ngOnInit() {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['']
    });

    this.authService.obtenerUsuarioActual().subscribe({
      next: user => {
        this.currentRole = user.rol;
        this.profileForm.patchValue({
          nombre: user.nombre,
          email: user.email
        });
      },
      error: err => {
        this.errorMessage = err.error?.detail || 'No se pudo cargar la información del usuario.';
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.errorMessage = 'Por favor completa los campos requeridos antes de guardar.';
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const profileData: any = {
      nombre: this.profileForm.value.nombre,
      email: this.profileForm.value.email
    };

    if (this.profileForm.value.password) {
      profileData.password = this.profileForm.value.password;
    }

    this.authService.actualizarPerfil(profileData).subscribe({
      next: updatedUser => {
        this.isLoading = false;
        this.successMessage = 'Perfil actualizado correctamente.';
        this.currentRole = updatedUser.rol;
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err.error?.detail || 'Error al actualizar el perfil. Intenta nuevamente.';
      }
    });
  }
}
