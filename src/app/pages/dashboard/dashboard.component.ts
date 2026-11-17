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
  username = this.authService.getUsername() || 'Admin';

  inventario: any[] = [];
  ordenes: any[] = [];
  citas: any[] = [];
  vehiculos: any[] = [];
  clientes: any[] = [];

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.tallerService.getInventario().subscribe(data => this.inventario = data || []);
    this.tallerService.getOrdenes().subscribe(data => this.ordenes = data || []);
    this.tallerService.getCitas().subscribe(data => this.citas = data || []);
    this.tallerService.getVehiculos().subscribe(data => this.vehiculos = data || []);
    this.tallerService.getClientes().subscribe(data => this.clientes = data || []);
  }

  get clientesFiltrados() {
    if (!this.searchQuery) return this.clientes;
    const q = this.searchQuery.toLowerCase();
    return this.clientes.filter(c => 
      (c.nombre || '').toLowerCase().includes(q) || 
      (c.apellido || '').toLowerCase().includes(q) || 
      (c.email || '').toLowerCase().includes(q) || 
      (c.dni || '').includes(q)
    );
  }

  get vehiculosFiltrados() {
    if (!this.searchQuery) return this.vehiculos;
    const q = this.searchQuery.toLowerCase();
    return this.vehiculos.filter(v => 
      (v.placa || '').toLowerCase().includes(q) || 
      (v.marca || '').toLowerCase().includes(q) || 
      (v.modelo || '').toLowerCase().includes(q)
    );
  }

  get citasFiltradas() {
    if (!this.searchQuery) return this.citas;
    const q = this.searchQuery.toLowerCase();
    return this.citas.filter(c => 
      (c.motivo || c.descripcion || '').toLowerCase().includes(q) ||
      (c.estado || '').toLowerCase().includes(q)
    );
  }

  get ordenesFiltradas() {
    if (!this.searchQuery) return this.ordenes;
    const q = this.searchQuery.toLowerCase();
    return this.ordenes.filter(o => 
      (o.descripcionTrabajo || o.descripcion_trabajo || '').toLowerCase().includes(q) ||
      (o.estado || '').toLowerCase().includes(q) ||
      (o.vehiculo?.placa || '').toLowerCase().includes(q)
    );
  }

  get inventarioFiltrado() {
    if (!this.searchQuery) return this.inventario;
    const q = this.searchQuery.toLowerCase();
    return this.inventario.filter(i => 
      (i.nombre || '').toLowerCase().includes(q) || 
      (i.descripcion || '').toLowerCase().includes(q)
    );
  }

  get alertasInventario(): any[] {
    return this.inventarioFiltrado.filter(item => item.stock <= 5);
  }

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

  mostrarModalVehiculo = false;
  mostrarModalCita = false;
  mostrarModalEstadoCita = false;
  mostrarModalOrden = false;

  mostrarModalPerfil = false;
  editandoPerfil = false; 
  datosPerfil: any = { 
    usuario: this.username, 
    correo: 'admin@autotaller.com', 
    password: '',
    foto: '' 
  };

  nuevoVehiculo: any = { placa: '', marca: '', modelo: '', anio: null };
  nuevaCita: any = { fechaHora: '', motivo: '' };
  estadoCitaObj: any = { id: null, estado: 'PENDIENTE' };
  nuevaOrden: any = { descripcionTrabajo: '', costoTotal: null };

  abrirPerfil() {
    this.editandoPerfil = false; 
    this.mostrarModalPerfil = true;
  }

  cerrarPerfil() {
    this.mostrarModalPerfil = false;
    this.editandoPerfil = false;
  }

  activarEdicionPerfil() {
    this.editandoPerfil = true; 
  }

  cancelarEdicionPerfil() {
    this.editandoPerfil = false; 
  }

  cambiarFoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.datosPerfil.foto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarPerfil() {
    if (this.datosPerfil.usuario) {
      this.username = this.datosPerfil.usuario;
    }
    this.editandoPerfil = false; 
    alert("Datos de perfil actualizados correctamente.");
  }

  abrirFormularioVehiculo() { this.mostrarModalVehiculo = true; }
  cerrarModalVehiculo() { this.mostrarModalVehiculo = false; this.nuevoVehiculo = { placa: '', marca: '', modelo: '', anio: null }; }
  guardarVehiculo() {
    const vehiculoCreado = { id: Math.floor(Math.random() * 1000), ...this.nuevoVehiculo };
    this.vehiculos.push(vehiculoCreado);
    this.cerrarModalVehiculo();
    alert("Vehículo registrado correctamente.");
  }

  abrirFormularioCita() { this.mostrarModalCita = true; }
  cerrarModalCita() { this.mostrarModalCita = false; this.nuevaCita = { fechaHora: '', motivo: '' }; }
  guardarCita() {
    const citaCreada = { id: Math.floor(Math.random() * 1000), ...this.nuevaCita, estado: 'PENDIENTE' };
    this.citas.push(citaCreada);
    this.cerrarModalCita();
    alert("Cita registrada correctamente.");
  }
  actualizarEstadoCita() { this.mostrarModalEstadoCita = true; }
  cerrarModalEstadoCita() { this.mostrarModalEstadoCita = false; this.estadoCitaObj = { id: null, estado: 'PENDIENTE' }; }
  guardarEstadoCita() {
    const index = this.citas.findIndex(c => c.id === this.estadoCitaObj.id);
    if (index !== -1) {
      this.citas[index].estado = this.estadoCitaObj.estado;
      alert("Estado actualizado correctamente.");
    } else {
      alert("No se encontró la cita con ID " + this.estadoCitaObj.id);
    }
    this.cerrarModalEstadoCita();
  }

  abrirFormularioOrden() { this.mostrarModalOrden = true; }
  cerrarModalOrden() { this.mostrarModalOrden = false; this.nuevaOrden = { descripcionTrabajo: '', costoTotal: null }; }
  guardarOrden() {
    const ordenCreada = { id: Math.floor(Math.random() * 1000), ...this.nuevaOrden, estado: 'RECIBIDO' };
    this.ordenes.push(ordenCreada);
    this.cerrarModalOrden();
    alert("Orden creada correctamente.");
  }
}