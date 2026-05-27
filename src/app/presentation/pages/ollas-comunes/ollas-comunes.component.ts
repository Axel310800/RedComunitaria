import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OllaService } from '../../../domain/services/olla.service';
import { OllaComunas, CreateOllaRequest } from '../../../domain/models/olla.model';

@Component({
  selector: 'app-ollas-comunes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200 py-8">
        <div class="container mx-auto px-4">
          <h1 class="text-3xl font-bold text-foreground mb-2">Ollas Comunes Registradas</h1>
          <p class="text-gray-600">Encuentra y apoya las ollas comunes de tu comunidad</p>
        </div>
      </div>

      <!-- Content -->
      <div class="container mx-auto px-4 py-8">
        <div class="flex gap-4 mb-8 flex-col md:flex-row">
          <!-- Search -->
          <div class="flex-1">
            <input 
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearch()"
              placeholder="Buscar por nombre o ubicación..."
              class="input-base"
            />
          </div>

          <!-- Filter -->
          <select [(ngModel)]="filtroEstado" (ngModelChange)="onSearch()" class="input-base md:w-48">
            <option value="">Todas las prioridades</option>
            <option value="ALTA">Prioridad Alta</option>
            <option value="MEDIA">Prioridad Media</option>
            <option value="BAJA">Prioridad Baja</option>
          </select>

          <!-- Register Button -->
          <button (click)="openFormModal()" class="btn-primary whitespace-nowrap">
            + Registrar Olla
          </button>
        </div>

        <!-- Loading -->
        <div *ngIf="isLoading" class="text-center py-12">
          <p class="text-gray-500">Cargando ollas comunes...</p>
        </div>

        <!-- Ollas Grid -->
        <div *ngIf="!isLoading && ollas.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let olla of ollas" class="card">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-lg font-bold text-foreground">{{ olla.nombre }}</h3>
              <span [ngClass]="getPriorityClass(olla.prioridad)" class="badge text-xs font-semibold">
                {{ olla.prioridad }}
              </span>
            </div>

            <p class="text-sm text-gray-600 mb-2">
              <strong>Responsable:</strong> {{ olla.responsable }}
            </p>

            <p class="text-sm text-gray-600 mb-2">
              <strong>📍 Ubicación:</strong> {{ olla.ubicacion }}
            </p>

            <p class="text-sm text-gray-600 mb-2">
              <strong>👥 Beneficiarios:</strong> {{ olla.numeroBeneficiarios }} familias
            </p>

            <div class="mb-4">
              <strong class="text-sm text-gray-700 block mb-2">Necesidades:</strong>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let necesidad of olla.necesidades" class="badge-info text-xs">
                  {{ necesidad.tipoNecesidad }}
                </span>
              </div>
            </div>

            <div class="flex gap-2">
              <button (click)="openDetailsModal(olla)" class="btn-primary flex-1">
                Ver Detalles
              </button>
              <span [ngClass]="getEstadoClass(olla.estado)" class="badge text-xs flex items-center">
                {{ olla.estado === 'VALIDADA' ? '✓' : '⏳' }} {{ olla.estado }}
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && ollas.length === 0" class="text-center py-12">
          <p class="text-gray-500">No hay ollas comunes registradas</p>
        </div>
      </div>

      <!-- Details Modal -->
      <div *ngIf="showDetailsModal && selectedOlla" class="modal-overlay" (click)="closeDetailsModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-foreground">{{ selectedOlla.nombre }}</h2>
            <button (click)="closeDetailsModal()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-600"><strong>Responsable:</strong> {{ selectedOlla.responsable }}</p>
              <p class="text-sm text-gray-600"><strong>📍 Ubicación:</strong></p>
              <p class="text-sm">{{ selectedOlla.ubicacion }}</p>
              <p class="text-sm text-gray-500">{{ selectedOlla.direccion }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-600"><strong>👥 Beneficiarios:</strong> {{ selectedOlla.numeroBeneficiarios }} familias</p>
            </div>

            <div>
              <p class="text-sm text-gray-600 mb-2"><strong>Necesidades Actuales:</strong></p>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let necesidad of selectedOlla.necesidades" class="badge-warning text-xs">
                  {{ necesidad.tipoNecesidad }}
                </span>
              </div>
            </div>

            <div>
              <p class="text-sm text-gray-600 mb-2"><strong>Stock Disponible:</strong></p>
              <div class="space-y-2">
                <div *ngFor="let stock of selectedOlla.stock" class="text-sm flex justify-between">
                  <span>{{ stock.tipoRecurso }}</span>
                  <span class="font-semibold">{{ stock.cantidadKg }} kg</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <button (click)="makeDonation(selectedOlla.id!)" class="btn-primary w-full">
              Realizar Donación
            </button>
          </div>
        </div>
      </div>

      <!-- Form Modal (Register Olla) -->
      <div *ngIf="showFormModal" class="modal-overlay" (click)="closeFormModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-foreground">Registrar Nueva Olla Común</h2>
            <button (click)="closeFormModal()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          <form (ngSubmit)="onSubmitForm()" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-2">Nombre de la Olla</label>
                <input 
                  type="text"
                  [(ngModel)]="formData.nombre"
                  name="nombre"
                  placeholder="Ej: Olla Común Los Jardines"
                  class="input-base"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold mb-2">Responsable</label>
                <input 
                  type="text"
                  [(ngModel)]="formData.responsable"
                  name="responsable"
                  placeholder="Nombre del responsable"
                  class="input-base"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold mb-2">Distrito/Ubicación</label>
                <input 
                  type="text"
                  [(ngModel)]="formData.ubicacion"
                  name="ubicacion"
                  placeholder="Ej: San Juan de Lurigancho"
                  class="input-base"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold mb-2">Dirección Completa</label>
                <input 
                  type="text"
                  [(ngModel)]="formData.direccion"
                  name="direccion"
                  placeholder="Av. / Jr. / Calle"
                  class="input-base"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold mb-2">Número de Beneficiarios</label>
                <input 
                  type="number"
                  [(ngModel)]="formData.numeroBeneficiarios"
                  name="numeroBeneficiarios"
                  placeholder="Ej: 120"
                  class="input-base"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold mb-2">Necesidades Principales</label>
                <input 
                  type="text"
                  [(ngModel)]="formData.necesidadesPrincipales"
                  name="necesidades"
                  placeholder="Ej: Arroz, Aceite, Menestras"
                  class="input-base"
                  required
                />
              </div>
            </div>

            <div *ngIf="formError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {{ formError }}
            </div>

            <div class="flex gap-4 pt-4">
              <button type="button" (click)="closeFormModal()" class="btn-outline flex-1">
                Cancelar
              </button>
              <button type="submit" [disabled]="isSubmitting" class="btn-primary flex-1 disabled:opacity-50">
                {{ isSubmitting ? 'Registrando...' : 'Registrar Olla' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OllasComunesComponent implements OnInit {
  private readonly ollaService = inject(OllaService);

  ollas: OllaComunas[] = [];
  allOllas: OllaComunas[] = [];
  isLoading = false;
  searchTerm = '';
  filtroEstado = '';
  showDetailsModal = false;
  showFormModal = false;
  selectedOlla: OllaComunas | null = null;
  isSubmitting = false;
  formError: string | null = null;

  formData: CreateOllaRequest = {
    nombre: '',
    responsable: '',
    ubicacion: '',
    direccion: '',
    numeroBeneficiarios: 0,
    necesidadesPrincipales: ''
  };

  ngOnInit() {
    this.loadOllas();
  }

  loadOllas() {
    this.isLoading = true;
    this.ollaService.obtenerOllas().subscribe({
      next: (data) => {
        this.allOllas = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    this.applyFilters();
  }

  private applyFilters() {
    const searchTerm = this.searchTerm?.trim().toLowerCase();

    this.ollas = this.allOllas.filter((olla) => {
      const matchesSearch = !searchTerm ||
        olla.nombre.toLowerCase().includes(searchTerm) ||
        olla.ubicacion.toLowerCase().includes(searchTerm);

      const matchesPriority = !this.filtroEstado || olla.prioridad === this.filtroEstado;

      return matchesSearch && matchesPriority;
    });
  }

  openDetailsModal(olla: OllaComunas) {
    this.selectedOlla = olla;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedOlla = null;
  }

  openFormModal() {
    this.resetForm();
    this.showFormModal = true;
  }

  closeFormModal() {
    this.showFormModal = false;
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      nombre: '',
      responsable: '',
      ubicacion: '',
      direccion: '',
      numeroBeneficiarios: 0,
      necesidadesPrincipales: ''
    };
    this.formError = null;
  }

  onSubmitForm() {
    this.isSubmitting = true;
    this.formError = null;

    this.ollaService.crearOlla(this.formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeFormModal();
        this.loadOllas();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.formError = err.error?.mensaje || 'Error al registrar la olla';
      }
    });
  }

  makeDonation(ollaId: number) {
    // Navigate to donation page
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'ALTA': return 'bg-red-100 text-red-800';
      case 'MEDIA': return 'bg-yellow-100 text-yellow-800';
      case 'BAJA': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getEstadoClass(estado: string): string {
    return estado === 'VALIDADA'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  }
}
