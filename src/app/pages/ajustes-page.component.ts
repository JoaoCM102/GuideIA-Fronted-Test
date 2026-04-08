import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AdminDataService,
  Integracion,
  IntegracionEstado,
  IntegracionInput,
  IntegracionTipo,
  ReglaOperativa,
  Severidad
} from '../core/admin-data.service';

type AjustesVista = 'Integraciones' | 'Politicas' | 'Auditoria';

@Component({
  selector: 'app-ajustes-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajustes-page.component.html',
  styleUrl: './ajustes-page.component.css'
})
export class AjustesPageComponent {
  private readonly store = inject(AdminDataService);

  readonly auditoria = this.store.auditoria;
  readonly integraciones = this.store.integraciones;
  readonly reglas = this.store.reglas;
  readonly integrationStats = this.store.integrationStats;
  readonly severidadOptions: Severidad[] = ['Info', 'Warning', 'Critical'];
  readonly integrationTypeOptions: IntegracionTipo[] = ['REST', 'Webhook', 'SFTP', 'LLM'];
  readonly integrationStateOptions: IntegracionEstado[] = ['Activa', 'Pausada', 'Error'];
  readonly vistas: AjustesVista[] = ['Integraciones', 'Politicas', 'Auditoria'];

  activeVista: AjustesVista = 'Integraciones';
  selectedIntegrationId: number | null = null;

  endpoint = 'http://127.0.0.1:8000/ask';
  modeloActivo = 'deepseek-chat';
  streaming = true;
  modoGuiado = true;
  maxContexto = 18000;
  retries = 2;

  formNombre = '';
  formTipo: IntegracionTipo = 'REST';
  formEstado: IntegracionEstado = 'Activa';
  formEndpoint = '';
  formRateLimit = 60;
  formPropietario = 'Plataforma';

  actor = 'Operador';
  modulo = 'General';
  accion = '';
  severidad: Severidad = 'Info';
  filterSeveridad: 'Todas' | Severidad = 'Todas';
  filterModulo = 'Todos';

  get selectedIntegration(): Integracion | null {
    const items = this.integraciones();
    if (items.length === 0) {
      return null;
    }

    return items.find((item) => item.id === this.selectedIntegrationId) ?? items[0];
  }

  get enabledRulesCount(): number {
    return this.reglas().filter((item) => item.enabled).length;
  }

  get visibleAudit() {
    return this.auditoria().filter((item) => {
      const matchesSeverity =
        this.filterSeveridad === 'Todas' || item.severidad === this.filterSeveridad;
      const matchesModule =
        this.filterModulo === 'Todos' ||
        item.modulo.toLowerCase().includes(this.filterModulo.trim().toLowerCase());
      return matchesSeverity && matchesModule;
    });
  }

  setVista(vista: AjustesVista): void {
    this.activeVista = vista;
  }

  saveSettings(): void {
    this.store.registrarEvento(
      'Administrador',
      'Ajustes',
      `Guardo configuracion. Endpoint: ${this.endpoint}. Modelo: ${this.modeloActivo}. Retries: ${this.retries}`,
      'Info'
    );
  }

  submitIntegration(): void {
    const nombre = this.formNombre.trim();
    const endpoint = this.formEndpoint.trim();

    if (!nombre || !endpoint) {
      return;
    }

    const payload: IntegracionInput = {
      nombre,
      tipo: this.formTipo,
      estado: this.formEstado,
      endpoint,
      rateLimit: this.formRateLimit,
      propietario: this.formPropietario.trim()
    };

    this.store.addIntegracion(payload);
    this.resetIntegrationForm();
    this.activeVista = 'Integraciones';
  }

  selectIntegration(item: Integracion): void {
    this.selectedIntegrationId = item.id;
    this.activeVista = 'Integraciones';
  }

  cycleIntegration(id: number): void {
    this.selectedIntegrationId = id;
    this.store.cycleIntegracionEstado(id);
  }

  toggleRule(rule: ReglaOperativa): void {
    this.store.toggleRegla(rule.id);
  }

  updateRuleThreshold(rule: ReglaOperativa, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.store.updateReglaThreshold(rule.id, Number(target.value));
  }

  addManualEvent(): void {
    const accion = this.accion.trim();
    if (!accion) {
      return;
    }

    this.store.registrarEvento(this.actor, this.modulo, accion, this.severidad);
    this.accion = '';
    this.activeVista = 'Auditoria';
  }

  trackByIntegrationId(_: number, item: Integracion): number {
    return item.id;
  }

  trackByRuleId(_: number, item: ReglaOperativa): number {
    return item.id;
  }

  private resetIntegrationForm(): void {
    this.formNombre = '';
    this.formTipo = 'REST';
    this.formEstado = 'Activa';
    this.formEndpoint = '';
    this.formRateLimit = 60;
    this.formPropietario = 'Plataforma';
  }
}
