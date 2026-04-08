import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AdminDataService,
  Registro,
  RegistroCanal,
  RegistroEstado,
  RegistroInput,
  RegistroOrigen,
  RegistroPrioridad,
  RegistroSla
} from '../core/admin-data.service';

type SortField = 'id' | 'codigo' | 'nombre' | 'estado' | 'prioridad' | 'fechaLimite' | 'creadoEn';
type SortDirection = 'asc' | 'desc';
type RegistroVista = 'Operativos' | 'Backlog' | 'Archivados';

@Component({
  selector: 'app-registros-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registros-page.component.html',
  styleUrl: './registros-page.component.css'
})
export class RegistrosPageComponent {
  private readonly store = inject(AdminDataService);

  readonly registroStats = this.store.registroStats;
  readonly estadoOptions: RegistroEstado[] = ['Activo', 'Pendiente', 'Inactivo'];
  readonly prioridadOptions: RegistroPrioridad[] = ['Alta', 'Media', 'Baja'];
  readonly canalOptions: RegistroCanal[] = ['Web', 'API', 'Batch'];
  readonly origenOptions: RegistroOrigen[] = ['Manual', 'Integracion', 'Migracion'];
  readonly slaOptions: RegistroSla[] = ['24h', '48h', '72h'];
  readonly vistas: RegistroVista[] = ['Operativos', 'Backlog', 'Archivados'];

  activeVista: RegistroVista = 'Operativos';
  selectedRegistroId: number | null = null;
  searchTerm = '';
  filterEstado: 'Todos' | RegistroEstado = 'Todos';
  filterPrioridad: 'Todas' | RegistroPrioridad = 'Todas';
  filterCanal: 'Todos' | RegistroCanal = 'Todos';
  filterOrigen: 'Todos' | RegistroOrigen = 'Todos';
  sortBy: SortField = 'fechaLimite';
  sortDirection: SortDirection = 'asc';

  editingId: number | null = null;
  formCodigo = this.buildNextCode();
  formNombre = '';
  formResumen = '';
  formEstado: RegistroEstado = 'Activo';
  formPrioridad: RegistroPrioridad = 'Media';
  formCanal: RegistroCanal = 'Web';
  formOrigen: RegistroOrigen = 'Manual';
  formSla: RegistroSla = '48h';
  formFechaLimite = this.defaultDate(4);
  formPropietario = 'Equipo Web';
  formEtiquetas = 'operativo, seguimiento';

  readonly vistaCounters = computed(() => {
    const registros = this.store.registros();
    return {
      Operativos: registros.filter((item) => item.estado === 'Activo').length,
      Backlog: registros.filter((item) => item.estado === 'Pendiente').length,
      Archivados: registros.filter((item) => item.estado === 'Inactivo').length
    } as Record<RegistroVista, number>;
  });

  get visibleRegistros(): Registro[] {
    const search = this.searchTerm.trim().toLowerCase();

    const filtered = this.store.registros().filter((registro) => {
      const matchesVista =
        this.activeVista === 'Operativos'
          ? registro.estado === 'Activo'
          : this.activeVista === 'Backlog'
            ? registro.estado === 'Pendiente'
            : registro.estado === 'Inactivo';

      const matchesSearch =
        search.length === 0 ||
        registro.nombre.toLowerCase().includes(search) ||
        registro.resumen.toLowerCase().includes(search) ||
        registro.codigo.toLowerCase().includes(search) ||
        registro.propietario.toLowerCase().includes(search) ||
        registro.etiquetas.join(' ').toLowerCase().includes(search);

      const matchesEstado =
        this.filterEstado === 'Todos' || registro.estado === this.filterEstado;

      const matchesPrioridad =
        this.filterPrioridad === 'Todas' || registro.prioridad === this.filterPrioridad;

      const matchesCanal = this.filterCanal === 'Todos' || registro.canal === this.filterCanal;
      const matchesOrigen =
        this.filterOrigen === 'Todos' || registro.origen === this.filterOrigen;

      return (
        matchesVista &&
        matchesSearch &&
        matchesEstado &&
        matchesPrioridad &&
        matchesCanal &&
        matchesOrigen
      );
    });

    return filtered.sort((a, b) => this.sortComparator(a, b));
  }

  get selectedRegistro(): Registro | null {
    const visible = this.visibleRegistros;
    if (visible.length === 0) {
      return null;
    }

    return (
      visible.find((registro) => registro.id === this.selectedRegistroId) ??
      visible[0]
    );
  }

  readonly registroTrail = computed(() =>
    this.store
      .auditoria()
      .filter((item) => item.modulo === 'Registros')
      .slice(0, 5)
  );

  submitRegistro(): void {
    const nombre = this.formNombre.trim();
    const resumen = this.formResumen.trim();
    const propietario = this.formPropietario.trim();
    const codigo = this.formCodigo.trim();

    if (!nombre || !resumen || !codigo || !this.formEstado || !this.formPrioridad) {
      return;
    }

    const payload: RegistroInput = {
      codigo,
      nombre,
      resumen,
      estado: this.formEstado,
      prioridad: this.formPrioridad,
      propietario,
      canal: this.formCanal,
      origen: this.formOrigen,
      sla: this.formSla,
      fechaLimite: this.formFechaLimite,
      etiquetas: this.formEtiquetas
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    };

    if (this.editingId === null) {
      this.store.addRegistro(payload);
    } else {
      this.store.updateRegistro(this.editingId, payload);
    }

    this.resetForm();
  }

  editRegistro(registro: Registro): void {
    this.editingId = registro.id;
    this.selectedRegistroId = registro.id;
    this.formCodigo = registro.codigo;
    this.formNombre = registro.nombre;
    this.formResumen = registro.resumen;
    this.formEstado = registro.estado;
    this.formPrioridad = registro.prioridad;
    this.formCanal = registro.canal;
    this.formOrigen = registro.origen;
    this.formSla = registro.sla;
    this.formFechaLimite = registro.fechaLimite;
    this.formPropietario = registro.propietario;
    this.formEtiquetas = registro.etiquetas.join(', ');
  }

  deleteRegistro(id: number): void {
    this.store.deleteRegistro(id);

    if (this.editingId === id) {
      this.resetForm();
    }

    if (this.selectedRegistroId === id) {
      this.selectedRegistroId = null;
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  createNewRegistro(): void {
    this.resetForm();
  }

  selectRegistro(registro: Registro): void {
    this.selectedRegistroId = registro.id;
  }

  setVista(vista: RegistroVista): void {
    this.activeVista = vista;
    this.selectedRegistroId = null;
  }

  setSort(field: SortField): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      return;
    }

    this.sortBy = field;
    this.sortDirection = field === 'fechaLimite' ? 'asc' : 'desc';
  }

  trackByRegistroId(_: number, registro: Registro): number {
    return registro.id;
  }

  private resetForm(): void {
    this.editingId = null;
    this.formCodigo = this.buildNextCode();
    this.formNombre = '';
    this.formResumen = '';
    this.formEstado = 'Activo';
    this.formPrioridad = 'Media';
    this.formCanal = 'Web';
    this.formOrigen = 'Manual';
    this.formSla = '48h';
    this.formFechaLimite = this.defaultDate(4);
    this.formPropietario = 'Equipo Web';
    this.formEtiquetas = 'operativo, seguimiento';
  }

  private buildNextCode(): string {
    const maxId = Math.max(...this.store.registros().map((registro) => registro.id), 100);
    return `REG-${maxId + 1}`;
  }

  private defaultDate(offset: number): string {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
  }

  private sortComparator(a: Registro, b: Registro): number {
    const normalize = (value: string | number): string | number =>
      typeof value === 'string' ? value.toLowerCase() : value;

    const leftMap: Record<SortField, string | number> = {
      id: a.id,
      codigo: normalize(a.codigo),
      nombre: normalize(a.nombre),
      estado: normalize(a.estado),
      prioridad: normalize(a.prioridad),
      fechaLimite: normalize(a.fechaLimite),
      creadoEn: normalize(a.creadoEn)
    };

    const rightMap: Record<SortField, string | number> = {
      id: b.id,
      codigo: normalize(b.codigo),
      nombre: normalize(b.nombre),
      estado: normalize(b.estado),
      prioridad: normalize(b.prioridad),
      fechaLimite: normalize(b.fechaLimite),
      creadoEn: normalize(b.creadoEn)
    };

    const direction = this.sortDirection === 'asc' ? 1 : -1;
    const left = leftMap[this.sortBy];
    const right = rightMap[this.sortBy];

    if (left < right) {
      return -1 * direction;
    }
    if (left > right) {
      return 1 * direction;
    }
    return 0;
  }
}
