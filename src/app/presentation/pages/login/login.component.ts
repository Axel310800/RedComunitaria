import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../../domain/services/autenticacion.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styles: []
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

  onSubmit() {
    if (!this.form.email || !this.form.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.authService.login(this.form.email, this.form.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/inicio']);
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.error?.mensaje || 'Error al iniciar sesión';
        }
      });
  }
}
