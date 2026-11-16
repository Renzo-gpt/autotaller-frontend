import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/api/auth';

  login(credentials: { username: string; password: string }): Observable<{ jwt: string }> {
    return this.http.post<{ jwt: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.jwt) {
          localStorage.setItem('token', response.jwt);
          localStorage.setItem('username', credentials.username);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string {
    return localStorage.getItem('username') || 'Administrador';
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}