import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TallerService } from '../../services/taller.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private tallerService = inject(TallerService);

  activeMenu = 'dashboard';
  searchQuery = '';
  username = this.authService.getUsername();

  // Datos reales desde MySQL / Spring Boot
  inventario: any[] = [];
  ordenes: any[] = [];
  citas: any[] = [];
  vehiculos: any[] = [];
  clientes: any[] = [];

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.tallerService.getInventario().subscribe(data => this.inventario = data);
    this.tallerService.getOrdenes().subscribe(data => this.ordenes = data);
    this.tallerService.getCitas().subscribe(data => this.citas = data);
    this.tallerService.getVehiculos().subscribe(data => this.vehiculos = data);
    this.tallerService.getClientes().subscribe(data => this.clientes = data);
  }

  // Alertas de inventario (stock <= 5)
  get alertasInventario(): any[] {
    return this.inventario.filter(item => item.stock <= 5);
  }

  // Cálculo de ingresos totales de órdenes
  get ingresosTotales(): number {
    return this.ordenes.reduce((acc, o) => acc + (Number(o.total || o.costoTotal || o.costo_total) || 0), 0);
  }
  
  get ordenesActivasCount(): number {
    return this.ordenes.filter(o => o.estado !== 'FINALIZADO' && o.estado !== 'FINALIZADA').length;
  }

  get ordenesListasCount(): number {
    return this.ordenes.filter(o => o.estado === 'FINALIZADO' || o.estado === 'FINALIZADA').length;
  }

  setMenu(menu: string): void {
    this.activeMenu = menu;
  }

  logout(): void {
    this.authService.logout();
  }
}