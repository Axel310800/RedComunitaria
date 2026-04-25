import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AutenticacionService } from '../../../../domain/services/autenticacion.service';
import { Usuario } from '../../../../domain/models/usuario.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white shadow-md sticky top-0 z-40">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              <span>♥</span>
            </div>
            <span class="font-bold text-lg text-foreground">RedComunitaria</span>
            <span class="text-xs text-gray-500 ml-2">Solidaridad que conecta</span>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center gap-6">
            <a *ngIf="isAuthenticated" 
               routerLink="/inicio" 
               routerLinkActive="text-primary font-semibold"
               class="text-foreground hover:text-primary transition">
              Inicio
            </a>
            <a *ngIf="isAuthenticated" 
               routerLink="/ollas-comunes" 
               routerLinkActive="text-primary font-semibold"
               class="text-foreground hover:text-primary transition">
              Ollas Comunes
            </a>
            <a *ngIf="isAuthenticated" 
               routerLink="/donar" 
               routerLinkActive="text-primary font-semibold"
               class="text-foreground hover:text-primary transition">
              Donar
            </a>
          </div>

          <!-- Auth Button -->
          <div class="flex items-center gap-4">
            <button *ngIf="!isAuthenticated" 
                    routerLink="/login"
                    class="btn-primary">
              Iniciar Sesión
            </button>
            <button *ngIf="isAuthenticated" 
                    (click)="logout()"
                    class="btn-primary">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NavbarComponent implements OnInit {
  private authService = inject(AutenticacionService);
  private router = inject(Router);
  
  isAuthenticated = false;
  usuario: Usuario | null = null;

  ngOnInit() {
    this.authService.getAuthState$().subscribe(state => {
      this.isAuthenticated = state.isAuthenticated;
      this.usuario = state.usuario;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
