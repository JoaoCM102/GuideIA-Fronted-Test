import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AdminDataService,
  Invitacion,
  Usuario,
  UsuarioCanal,
  UsuarioEquipo,
  UsuarioEstado,
  UsuarioInput,
  UsuarioRol,
  UsuarioZona
} from '../core/admin-data.service';

type UsuarioVista = 'Directorio' | 'Permisos' | 'Invitaciones';

@Component({
  selector: 'app-usuarios-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-page.component.html',
  styleUrl: './usuarios-page.component.css'
})
export class UsuariosPageComponent {
  private readonly store = inject(AdminDataService);

  readonly usuarioStats = this.store.usuarioStats;
  readonly roleOptions: UsuarioRol[] = ['Admin', 'Editor', 'Viewer'];
  readonly statusOptions: UsuarioEstado[] = ['Online', 'Ausente', 'Bloqueado'];
  readonly teamOptions: UsuarioEquipo[] = ['Operaciones', 'Finanzas', 'Legal', 'Producto'];
  readonly zoneOptions: UsuarioZona[] = ['EMEA', 'LATAM', 'NA'];
  readonly channelOptions: UsuarioCanal[] = ['Email', 'Slack', 'Teams'];
  readonly vistas: UsuarioVista[] = ['Directorio', 'Permisos', 'Invitaciones'];

  activeVista: UsuarioVista = 'Directorio';
  selectedUserId: number | null = null;

  filterRole: 'Todos' | UsuarioRol = 'Todos';
  filterStatus: 'Todos' | UsuarioEstado = 'Todos';
  filterTeam: 'Todos' | UsuarioEquipo = 'Todos';
  searchTerm = '';

  formNombre = '';
  formEmail = '';
  formRol: UsuarioRol = 'Viewer';
  formEstado: UsuarioEstado = 'Online';
  formEquipo: UsuarioEquipo = 'Operaciones';
  formZona: UsuarioZona = 'EMEA';
  formCanal: UsuarioCanal = 'Slack';
  formMfa = true;

  inviteNombre = '';
  inviteEmail = '';
  inviteRol: UsuarioRol = 'Viewer';
  inviteEquipo: UsuarioEquipo = 'Operaciones';

  readonly permissionMatrix = [
    { modulo: 'Registros', admin: 'Total', editor: 'Edicion', viewer: 'Lectura' },
    { modulo: 'Usuarios', admin: 'Total', editor: 'Parcial', viewer: 'Sin acceso' },
    { modulo: 'Reportes', admin: 'Total', editor: 'Edicion', viewer: 'Lectura' },
    { modulo: 'Ajustes', admin: 'Total', editor: 'Lectura', viewer: 'Sin acceso' }
  ];

  get usuarios(): Usuario[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.store.usuarios().filter((usuario) => {
      const matchesRole = this.filterRole === 'Todos' || usuario.rol === this.filterRole;
      const matchesStatus =
        this.filterStatus === 'Todos' || usuario.estado === this.filterStatus;
      const matchesTeam = this.filterTeam === 'Todos' || usuario.equipo === this.filterTeam;
      const matchesSearch =
        search.length === 0 ||
        usuario.nombre.toLowerCase().includes(search) ||
        usuario.email.toLowerCase().includes(search) ||
        usuario.rol.toLowerCase().includes(search) ||
        usuario.equipo.toLowerCase().includes(search);

      return matchesRole && matchesStatus && matchesTeam && matchesSearch;
    });
  }

  get selectedUsuario(): Usuario | null {
    const visible = this.usuarios;
    if (visible.length === 0) {
      return null;
    }

    return visible.find((usuario) => usuario.id === this.selectedUserId) ?? visible[0];
  }

  get invitaciones(): Invitacion[] {
    return this.store.invitaciones();
  }

  submitUsuario(): void {
    const nombre = this.formNombre.trim();
    const email = this.formEmail.trim();

    if (!nombre || !email || !this.formRol || !this.formEstado) {
      return;
    }

    const payload: UsuarioInput = {
      nombre,
      email,
      rol: this.formRol,
      estado: this.formEstado,
      equipo: this.formEquipo,
      zona: this.formZona,
      canalPreferido: this.formCanal,
      mfa: this.formMfa
    };

    this.store.addUsuario(payload);
    this.resetForm();
  }

  createNewUsuario(): void {
    this.resetForm();
  }

  setVista(vista: UsuarioVista): void {
    this.activeVista = vista;
  }

  selectUsuario(usuario: Usuario): void {
    this.selectedUserId = usuario.id;
  }

  cycleEstado(id: number): void {
    this.store.cycleUsuarioEstado(id);
  }

  changeRol(id: number, event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.store.setUsuarioRol(id, target.value as UsuarioRol);
  }

  submitInvitation(): void {
    const nombre = this.inviteNombre.trim();
    const email = this.inviteEmail.trim();

    if (!nombre || !email) {
      return;
    }

    this.store.addInvitacion(nombre, email, this.inviteRol, this.inviteEquipo);
    this.inviteNombre = '';
    this.inviteEmail = '';
    this.inviteRol = 'Viewer';
    this.inviteEquipo = 'Operaciones';
    this.activeVista = 'Invitaciones';
  }

  trackByUsuarioId(_: number, usuario: Usuario): number {
    return usuario.id;
  }

  private resetForm(): void {
    this.formNombre = '';
    this.formEmail = '';
    this.formRol = 'Viewer';
    this.formEstado = 'Online';
    this.formEquipo = 'Operaciones';
    this.formZona = 'EMEA';
    this.formCanal = 'Slack';
    this.formMfa = true;
  }
}
