import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TallerService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api';

  // Ajusta las rutas finales si tus @RequestMapping tienen otro nombre
  getInventario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/inventario`).pipe(catchError(() => of([])));
  }

  getOrdenes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ordenes`).pipe(catchError(() => of([])));
  }

  getCitas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/citas`).pipe(catchError(() => of([])));
  }

  getVehiculos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/vehiculos`).pipe(catchError(() => of([])));
  }

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/clientes`).pipe(catchError(() => of([])));
  }
}