import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface AdminUser {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  fecha_creacion: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-10 animate-fadeIn">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Dashboard de Administrador</h1>
          <p class="text-gray-600">Resumen general de usuarios, ollas comunes, donaciones y gestión de roles.</p>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
          <p class="text-sm text-gray-500">Total de usuarios</p>
          <p class="mt-4 text-4xl font-semibold text-cyan-700">{{ stats.total_usuarios }}</p>
          <div class="mt-4 h-2 rounded-full bg-cyan-100 overflow-hidden">
            <div class="h-full rounded-full bg-cyan-600" [style.width.%]="getPercentage(stats.total_usuarios)"></div>
          </div>
        </div>
        <div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
          <p class="text-sm text-gray-500">Ollas comunes activas</p>
          <p class="mt-4 text-4xl font-semibold text-cyan-700">{{ stats.total_ollas }}</p>
          <div class="mt-4 h-2 rounded-full bg-cyan-100 overflow-hidden">
            <div class="h-full rounded-full bg-cyan-600" [style.width.%]="getPercentage(stats.total_ollas)"></div>
          </div>
        </div>
        <div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
          <p class="text-sm text-gray-500">Donaciones registradas</p>
          <p class="mt-4 text-4xl font-semibold text-cyan-700">{{ stats.total_donaciones }}</p>
          <div class="mt-4 h-2 rounded-full bg-cyan-100 overflow-hidden">
            <div class="h-full rounded-full bg-cyan-600" [style.width.%]="getPercentage(stats.total_donaciones)"></div>
          </div>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-3 mt-6">
        <div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
          <p class="text-sm text-gray-500">Donantes registrados</p>
          <p class="mt-4 text-4xl font-semibold text-cyan-700">{{ stats.total_donantes }}</p>
        </div>
        <div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
          <p class="text-sm text-gray-500">Responsables de olla</p>
          <p class="mt-4 text-4xl font-semibold text-cyan-700">{{ stats.total_responsables }}</p>
        </div>
        <div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
          <p class="text-sm text-gray-500">Última actualización</p>
          <p class="mt-4 text-2xl font-semibold text-gray-800">{{ updatedAt }}</p>
        </div>
      </div>

      <div class="mt-10 rounded-3xl bg-white p-6 shadow-sm border border-gray-200 animate-fadeInUp">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Gestión de Usuarios y Roles</h2>
            <p class="text-gray-600">Busca, crea, edita o elimina cuentas de usuario desde un solo lugar.</p>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button (click)="openCreateUser()" class="btn-primary inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold transition hover:bg-cyan-800">
              Crear usuario
            </button>
            <input
              type="search"
              [(ngModel)]="searchQuery"
              (input)="filterUsers()"
              placeholder="Buscar por nombre, email o rol"
              class="input-base w-full sm:w-72"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm text-gray-700">
            <thead class="border-b border-gray-200 bg-gray-50">
              <tr>
                <th class="px-4 py-3">Nombre</th>
                <th class="px-4 py-3">Email</th>
                <th class="px-4 py-3">Rol</th>
                <th class="px-4 py-3">Creado</th>
                <th class="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of filteredUsers" class="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200">
                <td class="px-4 py-4">{{ user.nombre }}</td>
                <td class="px-4 py-4">{{ user.email }}</td>
                <td class="px-4 py-4 capitalize">{{ user.rol }}</td>
                <td class="px-4 py-4">{{ user.fecha_creacion | date:'short' }}</td>
                <td class="px-4 py-4 flex flex-wrap gap-2">
                  <button (click)="openEditUser(user)" class="btn-outline px-3 py-2 rounded-xl">Editar</button>
                  <button (click)="deleteUser(user.id)" class="btn-danger px-3 py-2 rounded-xl">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="!filteredUsers.length" class="mt-6 rounded-2xl bg-yellow-50 border border-yellow-200 p-4 text-yellow-800">
          No se encontraron usuarios con ese criterio.
        </div>
      </div>

      <div *ngIf="showUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
        <div class="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl animate-fadeInUp">
          <div class="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">{{ editingUser ? 'Editar usuario' : 'Nuevo usuario' }}</h3>
              <p class="text-gray-600">{{ editingUser ? 'Actualiza los datos del usuario.' : 'Crea una cuenta nueva para el sistema.' }}</p>
            </div>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-700">Cerrar</button>
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input [(ngModel)]="userForm.nombre" name="nombre" type="text" class="input-base w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input [(ngModel)]="userForm.email" name="email" type="email" class="input-base w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <select [(ngModel)]="userForm.rol" name="rol" class="input-base w-full">
                <option *ngFor="let role of roles" [value]="role">{{ role }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input [(ngModel)]="userForm.password" name="password" type="password" class="input-base w-full" placeholder="{{ editingUser ? 'Opcional' : 'Requerido' }}" />
            </div>
          </div>

          <div *ngIf="modalError" class="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-800">
            {{ modalError }}
          </div>

          <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button (click)="closeModal()" type="button" class="btn-outline w-full sm:w-auto">Cancelar</button>
            <button (click)="saveUser()" type="button" class="btn-primary w-full sm:w-auto">{{ editingUser ? 'Guardar cambios' : 'Crear usuario' }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .animate-fadeIn {
        animation: fadeIn 0.45s ease-out;
      }

      .animate-fadeInUp {
        animation: fadeInUp 0.45s ease-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .input-base {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 1rem;
        background: white;
        outline: none;
      }

      .btn-outline {
        background: white;
        border: 1px solid #cbd5e1;
        color: #0f172a;
      }

      .btn-danger {
        background: #fee2e2;
        color: #b91c1c;
      }
    `
  ]
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
  users: AdminUser[] = [];
  filteredUsers: AdminUser[] = [];
  searchQuery = '';
  showUserModal = false;
  editingUser = false;
  modalError: string | null = null;
  selectedUser: AdminUser | null = null;
  roles = ['admin', 'responsable', 'donante'];

  userForm = {
    nombre: '',
    email: '',
    rol: 'donante',
    password: ''
  };

  ngOnInit() {
    this.loadDashboard();
    this.loadUsers();
  }

  loadDashboard() {
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

  loadUsers() {
    this.http.get<AdminUser[]>(`${environment.apiUrl}/admin/usuarios`).subscribe({
      next: data => {
        this.users = data;
        this.filteredUsers = [...data];
        this.filterUsers();
      },
      error: err => {
        this.errorMessage = err.error?.detail || 'No se pudieron cargar los usuarios.';
      }
    });
  }

  filterUsers() {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.nombre.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.rol.toLowerCase().includes(query)
    );
  }

  openCreateUser() {
    this.editingUser = false;
    this.selectedUser = null;
    this.userForm = { nombre: '', email: '', rol: 'donante', password: '' };
    this.modalError = null;
    this.showUserModal = true;
  }

  openEditUser(user: AdminUser) {
    this.editingUser = true;
    this.selectedUser = user;
    this.userForm = { nombre: user.nombre, email: user.email, rol: user.rol, password: '' };
    this.modalError = null;
    this.showUserModal = true;
  }

  closeModal() {
    this.showUserModal = false;
    this.modalError = null;
  }

  saveUser() {
    if (!this.userForm.nombre || !this.userForm.email || !this.userForm.rol) {
      this.modalError = 'Completa nombre, email y rol antes de guardar.';
      return;
    }

    const payload: any = {
      nombre: this.userForm.nombre,
      email: this.userForm.email,
      rol: this.userForm.rol
    };

    if (this.userForm.password) {
      payload.password = this.userForm.password;
    }

    if (this.editingUser && this.selectedUser) {
      this.http.patch<AdminUser>(`${environment.apiUrl}/admin/usuarios/${this.selectedUser.id}`, payload).subscribe({
        next: () => {
          this.showUserModal = false;
          this.loadUsers();
          this.loadDashboard();
        },
        error: err => {
          this.modalError = err.error?.detail || 'Error al actualizar el usuario.';
        }
      });
      return;
    }

    if (!this.userForm.password) {
      this.modalError = 'La contraseña es requerida para un nuevo usuario.';
      return;
    }

    this.http.post<AdminUser>(`${environment.apiUrl}/admin/usuarios`, payload).subscribe({
      next: () => {
        this.showUserModal = false;
        this.loadUsers();
        this.loadDashboard();
      },
      error: err => {
        this.modalError = err.error?.detail || 'Error al crear el usuario.';
      }
    });
  }

  deleteUser(id: number) {
    if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    this.http.delete(`${environment.apiUrl}/admin/usuarios/${id}`).subscribe({
      next: () => {
        this.loadUsers();
        this.loadDashboard();
      },
      error: err => {
        this.errorMessage = err.error?.detail || 'Error al eliminar el usuario.';
      }
    });
  }

  get maxStat(): number {
    return Math.max(this.stats.total_usuarios, this.stats.total_ollas, this.stats.total_donaciones, this.stats.total_donantes, this.stats.total_responsables, 1);
  }

  getPercentage(value: number): number {
    return this.maxStat ? Math.min(100, Math.round((value / this.maxStat) * 100)) : 0;
  }
}
