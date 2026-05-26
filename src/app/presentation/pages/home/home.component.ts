import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AutenticacionService } from '../../../domain/services/autenticacion.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary via-cyan-400 to-secondary text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <div class="mb-4 inline-block">
          <span class="text-sm bg-white bg-opacity-20 rounded-full px-4 py-1">
            ♥ Solidaridad que conecta
          </span>
        </div>
        <p class="text-sm uppercase tracking-[0.3em] mb-4 opacity-90">
          {{ welcomeMessage }}
        </p>
        <h1 class="text-4xl md:text-5xl font-bold mb-6 text-balance">
          Distribución Equitativa de Recursos en Ollas Comunes
        </h1>
        <p class="text-lg mb-8 text-balance opacity-90">
          Plataforma digital que conecta, organiza y transparenta la gestión de recursos para ollas comunes en el Perú
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <button 
            routerLink="/ollas-comunes"
            class="btn-primary bg-white text-primary hover:bg-opacity-90">
            Ver Ollas Comunes
          </button>
          <button 
            routerLink="/donar"
            class="btn-outline">
            Donar Ahora
          </button>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div class="text-center p-6 bg-white rounded-lg shadow-sm">
            <div class="text-3xl md:text-4xl font-bold text-primary mb-2">150+</div>
            <p class="text-gray-600">Ollas Comunes</p>
          </div>
          <div class="text-center p-6 bg-white rounded-lg shadow-sm">
            <div class="text-3xl md:text-4xl font-bold text-secondary mb-2">5,000+</div>
            <p class="text-gray-600">Familias Beneficiadas</p>
          </div>
          <div class="text-center p-6 bg-white rounded-lg shadow-sm">
            <div class="text-3xl md:text-4xl font-bold text-success mb-2">200+</div>
            <p class="text-gray-600">Donantes Activos</p>
          </div>
          <div class="text-center p-6 bg-white rounded-lg shadow-sm">
            <div class="text-3xl md:text-4xl font-bold text-primary mb-2">98%</div>
            <p class="text-gray-600">Transparencia</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4 text-foreground">¿Cómo Funciona?</h2>
        <p class="text-center text-gray-600 mb-12 text-balance">
          Una plataforma completa para gestionar recursos de manera transparente y eficiente
        </p>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="card">
            <div class="text-4xl mb-4">📍</div>
            <h3 class="text-lg font-bold mb-2 text-foreground">Registro de Ollas Comunes</h3>
            <p class="text-gray-600">
              Soporte y gestión de ollas con información detallada sobre ubicación y necesidades
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="card">
            <div class="text-4xl mb-4">🤝</div>
            <h3 class="text-lg font-bold mb-2 text-foreground">Sistema de Donaciones</h3>
            <p class="text-gray-600">
              Directorio completo de recursos disponibles en cada olla comun
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="card">
            <div class="text-4xl mb-4">✅</div>
            <h3 class="text-lg font-bold mb-2 text-foreground">Gestión Inteligente</h3>
            <p class="text-gray-600">
              Distribución automatizada según prioridades y disponibilidad de recursos
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="card">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-lg font-bold mb-2 text-foreground">Distribución Equitativa</h3>
            <p class="text-gray-600">
              Algoritmo justo para asegurar reparto equilibrado utilizando criterios transparentes
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="card">
            <div class="text-4xl mb-4">🔒</div>
            <h3 class="text-lg font-bold mb-2 text-foreground">Transparencia Total</h3>
            <p class="text-gray-600">
              Trazabilidad completa de donaciones y distribución de recursos
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="card">
            <div class="text-4xl mb-4">🔔</div>
            <h3 class="text-lg font-bold mb-2 text-foreground">Notificaciones</h3>
            <p class="text-gray-600">
              Alertas sobre disponibilidad de recursos y oportunidades de contribución
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gradient-to-r from-primary to-secondary text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">Contribuye a la Reducción de Desigualdades</h2>
        <p class="text-lg mb-8 opacity-90 text-balance">
          Únete a una red de solidaridad real donde tu aporte hace diferencia en cada familia
        </p>
        <button routerLink="/donar" class="btn-primary bg-white text-primary hover:bg-opacity-90">
          Comienza a Ayudar
        </button>
      </div>
    </section>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  private authService = inject(AutenticacionService);
  welcomeMessage = 'Bienvenido a RedComunitaria';

  ngOnInit() {
    this.authService.getAuthState$().subscribe(state => {
      if (state.usuario?.nombre) {
        this.welcomeMessage = `Hola, ${state.usuario.nombre}`;
      } else {
        this.welcomeMessage = 'Bienvenido a RedComunitaria';
      }
    });
  }
}
