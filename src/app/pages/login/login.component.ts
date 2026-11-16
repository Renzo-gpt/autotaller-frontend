import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <div class="brand">
          <div class="brand-icon"><i class="bi bi-car-front-fill"></i></div>
          <h2>AutoTaller Pro</h2>
          <p>Panel Administrativo</p>
        </div>

        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label>Usuario</label>
            <input type="text" [(ngModel)]="username" name="username" placeholder="Ej. admin" required />
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="••••••" required />
          </div>

          <div *ngIf="errorMsg" class="error-banner">
            <i class="bi bi-exclamation-circle"></i> {{ errorMsg }}
          </div>

          <button type="submit" [disabled]="loading">
            {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      font-family: 'Segoe UI', system-ui, sans-serif;
    }
    .login-card {
      background: #ffffff;
      padding: 2.5rem;
      border-radius: 16px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.25);
    }
    .brand { text-align: center; margin-bottom: 2rem; }
    .brand-icon {
      width: 56px; height: 56px; background: #2563eb; color: #fff;
      border-radius: 14px; display: inline-flex; align-items: center;
      justify-content: center; font-size: 1.6rem; margin-bottom: 0.75rem;
    }
    .brand h2 { margin: 0; color: #0f172a; font-size: 1.5rem; }
    .brand p { margin: 0.25rem 0 0; color: #64748b; font-size: 0.9rem; }
    .form-group { margin-bottom: 1.25rem; }
    label { display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 0.4rem; }
    input {
      width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1;
      border-radius: 10px; font-size: 0.95rem; box-sizing: border-box;
    }
    input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
    button {
      width: 100%; padding: 0.85rem; background: #2563eb; color: #fff;
      border: none; border-radius: 10px; font-weight: 600; font-size: 1rem;
      cursor: pointer; transition: background 0.2s;
    }
    button:hover { background: #1d4ed8; }
    .error-banner {
      background: #fee2e2; color: #b91c1c; padding: 0.75rem;
      border-radius: 8px; font-size: 0.85rem; margin-bottom: 1rem;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = 'admin';
  password = '';
  errorMsg = '';
  loading = false;

  onLogin(): void {
    this.loading = true;
    this.errorMsg = '';
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Credenciales inválidas o servidor desconectado.';
      }
    });
  }
}