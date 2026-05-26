import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-10">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Dashboard de Administrador</h1>
          <p class="text-gray-600">Resumen general de los usuarios, ollas comunes y donaciones.</p>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-sm text-gray-500">Total de usuarios</p>
          <p class="mt-4 text-4xl font-semibold text-cyan-700">{{ stats.total_usuarios }}</p>
        </div>
        <div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-sm text-gray-500">Ollas comunes activas</p>
          <p class="mt-4 text-4xl font-semibold text-cyan-700">{{ stats.total_ollas }}</p>
        </div>
        <div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-sm text-gray-500">Donantes registrados</p>
          <p class="mt-4 text-4xl font-semibold text-cyan-700">{{ stats.total_donantes }}</p>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-3 mt-6">
        <div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-sm text-gray-500">Responsables de olla</p>
          <p class="mt-4 text-4xl font-semibold text-cyan-700">{{ stats.total_responsables }}</p>
        </div>
        <div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-sm text-gray-500">Donaciones registradas</p>
          <p class="mt-4 text-4xl font-semibold text-cyan-700">{{ stats.total_donaciones }}</p>
        </div>
        <div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-sm text-gray-500">Última actualización</p>
          <p class="mt-4 text-2xl font-semibold text-gray-800">{{ updatedAt }}</p>
        </div>
      </div>

      <div *ngIf="errorMessage" class="mt-8 rounded-2xl bg-red-50 border border-red-200 p-6 text-red-800">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
  stats = {
    total_usuarios: 0,
    total_ollas: 0,
    total_donantes: 0,
    total_responsables: 0,
    total_donaciones: 0
  };
  updatedAt = new Date().toLocaleString();
  errorMessage: string | null = null;

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/admin/dashboard`).subscribe({
      next: data => {
        this.stats = data;
        this.updatedAt = new Date().toLocaleString();
      },
      error: err => {
        this.errorMessage = err.error?.detail || 'No se pudieron cargar los datos del dashboard.';
      }
    });
  }
}
