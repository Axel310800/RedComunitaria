import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../../../domain/services/autenticacion.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="splash-container">
      <div class="splash-content">
        <div class="logo-wrapper">
          <div class="logo-animation">
            <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="55" fill="none" stroke="#0891b2" stroke-width="2"/>
              <path d="M 60 30 Q 75 45 70 60 Q 65 75 60 85 Q 55 75 50 60 Q 45 45 60 30" 
                    fill="#0891b2" class="heart-pulse"/>
              <circle cx="35" cy="70" r="3" fill="#1e3a8a" class="pulse-dot pulse-1"/>
              <circle cx="50" cy="85" r="3" fill="#1e3a8a" class="pulse-dot pulse-2"/>
              <circle cx="70" cy="85" r="3" fill="#1e3a8a" class="pulse-dot pulse-3"/>
              <circle cx="85" cy="70" r="3" fill="#1e3a8a" class="pulse-dot pulse-4"/>
            </svg>
          </div>
        </div>
        
        <h1 class="welcome-text">
          Bienvenido{{ userName ? ' ' + userName : '' }}
        </h1>
        <p class="subtitle">a RedComunitaria</p>
        
        <div class="loader">
          <div class="loader-bar"></div>
        </div>
        
        <p class="loading-text">Cargando...</p>
      </div>
    </div>
  `,
  styles: [`
    .splash-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeOut 3s ease-in forwards;
    }

    .splash-content {
      text-align: center;
      color: white;
    }

    .logo-wrapper {
      margin-bottom: 40px;
      animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .logo-animation {
      display: inline-block;
      animation: rotate 3s linear infinite;
    }

    .logo-animation svg {
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
    }

    .heart-pulse {
      animation: pulse 1.5s ease-in-out infinite;
      transform-origin: 60px 60px;
    }

    .pulse-dot {
      animation: dotPulse 1.5s ease-in-out infinite;
    }

    .pulse-1 {
      animation-delay: 0s;
    }

    .pulse-2 {
      animation-delay: 0.3s;
    }

    .pulse-3 {
      animation-delay: 0.6s;
    }

    .pulse-4 {
      animation-delay: 0.9s;
    }

    .welcome-text {
      font-size: 32px;
      font-weight: 700;
      margin: 20px 0 0 0;
      letter-spacing: -0.5px;
      animation: slideUp 0.8s ease-out 0.2s both;
    }

    .subtitle {
      font-size: 24px;
      font-weight: 300;
      margin: 5px 0 30px 0;
      opacity: 0.95;
      animation: slideUp 0.8s ease-out 0.4s both;
    }

    .loader {
      width: 150px;
      height: 4px;
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      margin: 30px auto;
      overflow: hidden;
      animation: slideUp 0.8s ease-out 0.6s both;
    }

    .loader-bar {
      height: 100%;
      background-color: white;
      width: 30%;
      border-radius: 10px;
      animation: loadProgress 2.5s ease-in-out infinite;
    }

    .loading-text {
      font-size: 14px;
      opacity: 0.8;
      margin-top: 15px;
      animation: slideUp 0.8s ease-out 0.8s both;
    }

    @keyframes fadeOut {
      0% {
        opacity: 1;
      }
      70% {
        opacity: 1;
      }
      100% {
        opacity: 0;
        pointer-events: none;
      }
    }

    @keyframes bounceIn {
      0% {
        transform: scale(0.3);
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      70% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }

    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.6;
      }
    }

    @keyframes dotPulse {
      0% {
        r: 3;
        opacity: 1;
      }
      100% {
        r: 8;
        opacity: 0;
      }
    }

    @keyframes slideUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes loadProgress {
      0% {
        width: 30%;
        margin-left: 0;
      }
      50% {
        width: 70%;
      }
      100% {
        width: 30%;
        margin-left: 70%;
      }
    }
  `]
})
export class SplashComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AutenticacionService);
  userName: string | null = null;

  ngOnInit() {
    this.authService.getAuthState$().subscribe(state => {
      if (state.usuario) {
        this.userName = state.usuario.nombre || state.usuario.email?.split('@')[0] || null;
      }
    });

    setTimeout(() => {
      this.router.navigate(['/inicio']);
    }, 3000);
  }
}
