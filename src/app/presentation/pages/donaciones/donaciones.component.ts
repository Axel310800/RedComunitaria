import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonacionService } from '../../../domain/services/donacion.service';
import { OllaService } from '../../../domain/services/olla.service';
import { DonacionListItem, CreateDonacionRequest } from '../../../domain/models/donacion.model';
import { OllaComunas } from '../../../domain/models/olla.model';

@Component({
  selector: 'app-donaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200 py-8">
        <div class="container mx-auto px-4">
          <h1 class="text-3xl font-bold text-foreground mb-2">Sistema de Donaciones</h1>
          <p class="text-gray-600">Tu solidaridad marca la diferencia en cada familia</p>
        </div>
      </div>
      <!-- CTA Section -->
      <div class="bg-gradient-to-r from-primary to-secondary text-white mx-4 my-8 rounded-lg p-6 container mx-auto">
        <p class="mb-4">
          Cada donación cuenta. Con tu aporte, podemos llegar a más familias que necesitan apoyo. Registra tu donación y nosotros nos encargamos de que llegue a quien más la necesita.
        </p>
        <button (click)="openFormModal()" class="btn-primary bg-white text-primary hover:bg-opacity-90">
          Realizar Donación
        </button>
      </div>

      <!-- Content -->
      <div class="container mx-auto px-4 py-8">
        <!-- Statistics -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div class="text-2xl font-bold text-primary">1,250</div>
            <div class="text-sm text-gray-600">Total Donaciones</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div class="text-2xl font-bold text-success">200</div>
            <div class="text-sm text-gray-600">Donantes Activos</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div class="text-2xl font-bold text-warning">5,000</div>
            <div class="text-sm text-gray-600">Familias Impactadas</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div class="text-2xl font-bold text-primary">350</div>
            <div class="text-sm text-gray-600">Kilos Distribuidos</div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 class="text-2xl font-bold text-foreground mb-6">Formulario de Donación</h2>

          <form (ngSubmit)="onSubmitDonation()" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Donor Info -->
              <div>
                <label class="block text-sm font-semibold mb-2">Nombre Completo / Empresa</label>
                <input 
                  type="text"
                  [(ngModel)]="donacionForm.donante"
                  name="donante"
                  placeholder="Tu nombre o nombre de empresa"
                  class="input-base"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold mb-2">Correo Electrónico</label>
                <input 
                  type="email"
                  [(ngModel)]="donacionForm.email"
                  name="email"
                  placeholder="correo@ejemplo.com"
                  class="input-base"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold mb-2">Teléfono de Contacto</label>
                <input 
                  type="tel"
                  [(ngModel)]="donacionForm.telefono"
                  name="telefono"
                  placeholder="999 999 999"
                  class="input-base"
                  required
                />
              </div>

              <!-- Donation Details -->
              <div>
                <label class="block text-sm font-semibold mb-2">Tipo de Donativo</label>
                <select 
                  [(ngModel)]="donacionForm.recurso"
                  name="recurso"
                  class="input-base"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Arroz">Arroz</option>
                  <option value="Aceite">Aceite</option>
                  <option value="Menestras">Menestras</option>
                  <option value="Leche">Leche</option>
                  <option value="Productos de Higiene">Productos de Higiene</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Medicamentos">Medicamentos</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold mb-2">Cantidad (kg o unidades)</label>
                <input 
                  type="number"
                  [(ngModel)]="donacionForm.cantidad"
                  name="cantidad"
                  placeholder="50"
                  class="input-base"
                  required
                  min="0"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold mb-2">Olla Común Destino</label>
                <select 
                  [(ngModel)]="donacionForm.ollaDestino"
                  name="ollaDestino"
                  class="input-base"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option *ngFor="let olla of ollas" [value]="olla.id">
                    {{ olla.nombre }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold mb-2">Mensaje (Opcional)</label>
              <textarea 
                [(ngModel)]="donacionForm.mensaje"
                name="mensaje"
                placeholder="Agregue un mensaje de apoyo..."
                rows="4"
                class="input-base"
              ></textarea>
            </div>

            <div *ngIf="formError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {{ formError }}
            </div>

            <div class="flex gap-4">
              <button type="button" (click)="resetForm()" class="btn-outline flex-1">
                Cancelar
              </button>
              <button type="submit" [disabled]="isSubmitting" class="btn-primary flex-1 disabled:opacity-50">
                {{ isSubmitting ? 'Registrando...' : 'Registrar Donación' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Recent Donations Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-foreground">Últimas Donaciones</h2>
          </div>

          <div *ngIf="isLoading" class="p-6 text-center">
            <p class="text-gray-500">Cargando donaciones...</p>
          </div>

          <table *ngIf="!isLoading && donaciones.length > 0" class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Donante</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Recurso</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cantidad</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Destino</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let donacion of donaciones" class="table-row">
                <td class="px-6 py-3 text-sm">{{ donacion.donante }}</td>
                <td class="px-6 py-3 text-sm">{{ donacion.recurso }}</td>
                <td class="px-6 py-3 text-sm font-semibold">{{ donacion.cantidad }} kg</td>
                <td class="px-6 py-3 text-sm">{{ donacion.ollaDestino }}</td>
                <td class="px-6 py-3 text-sm text-gray-500">{{ donacion.fechaDonacion }}</td>
                <td class="px-6 py-3 text-sm">
                  <span [ngClass]="getEstadoClass(donacion.estado)" class="badge text-xs">
                    {{ donacion.estado }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="!isLoading && donaciones.length === 0" class="p-6 text-center text-gray-500">
            <p>No hay donaciones registradas</p>
          </div>
        </div>

        <!-- Transparency Info -->
        <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="flex gap-4">
            <div class="text-4xl">♥</div>
            <div>
              <h3 class="font-bold text-foreground mb-2">Transparencia Total</h3>
              <p class="text-gray-600 text-sm">
                Todas las donaciones son registradas y trazadas desde su origen hasta su destino final. Puedes consultar el historial completo de donaciones en cualquier momento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DonacionesComponent implements OnInit {
  private donacionService = inject(DonacionService);
  private ollaService = inject(OllaService);

  donaciones: DonacionListItem[] = [];
  ollas: OllaComunas[] = [];
  isLoading = false;
  isSubmitting = false;
  formError: string | null = null;

  donacionForm: CreateDonacionRequest = {
    donante: '',
    email: '',
    telefono: '',
    recurso: '',
    cantidad: 0,
    ollaDestino: 0,
    mensaje: ''
  };

  ngOnInit() {
    this.loadDonaciones();
    this.loadOllas();
  }

  loadDonaciones() {
    this.isLoading = true;
    this.donacionService.obtenerDonaciones().subscribe({
      next: (data) => {
        this.donaciones = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadOllas() {
    this.ollaService.obtenerOllas().subscribe({
      next: (data) => {
        this.ollas = data;
      },
      error: () => {
        console.error('Error loading ollas');
      }
    });
  }

  onSubmitDonation() {
    if (!this.donacionForm.donante || !this.donacionForm.email || !this.donacionForm.recurso) {
      this.formError = 'Por favor completa los campos requeridos';
      return;
    }

    this.isSubmitting = true;
    this.formError = null;

    this.donacionService.crearDonacion(this.donacionForm).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.resetForm();
        this.loadDonaciones();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.formError = err.error?.mensaje || 'Error al registrar la donación';
      }
    });
  }

  openFormModal() {
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm() {
    this.donacionForm = {
      donante: '',
      email: '',
      telefono: '',
      recurso: '',
      cantidad: 0,
      ollaDestino: 0,
      mensaje: ''
    };
    this.formError = null;
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'ENTREGADA': return 'bg-green-100 text-green-800';
      case 'EN_TRÁNSITO': return 'bg-blue-100 text-blue-800';
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
