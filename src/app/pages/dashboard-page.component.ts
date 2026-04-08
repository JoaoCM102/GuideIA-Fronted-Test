import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminDataService, Aprobacion, Incidencia } from '../core/admin-data.service';

type KpiCard = {
  label: string;
  value: string;
  trend: string;
  tone: 'positive' | 'neutral' | 'warning';
};

type QuickLink = {
  label: string;
  route: string;
  caption: string;
  selector: string;
};

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
  private readonly store = inject(AdminDataService);

  readonly cards = computed<KpiCard[]>(() => {
    const registroStats = this.store.registroStats();
    const usuarioStats = this.store.usuarioStats();
    const reporteStats = this.store.reporteStats();
    const ops = this.store.operationalStats();

    return [
      {
        label: 'Registros calientes',
        value: `${registroStats.criticos}`,
        trend: `${registroStats.integraciones} originados por integraciones`,
        tone: registroStats.criticos > 2 ? 'warning' : 'positive'
      },
      {
        label: 'Usuarios operativos',
        value: `${usuarioStats.online}/${usuarioStats.total}`,
        trend: `${usuarioStats.mfaEnabled} con MFA habilitado`,
        tone: usuarioStats.bloqueados > 0 ? 'warning' : 'neutral'
      },
      {
        label: 'Riesgo reportes',
        value: `${reporteStats.enRiesgo}`,
        trend: `${reporteStats.progresoPromedio}% de avance medio`,
        tone: reporteStats.enRiesgo > 0 ? 'warning' : 'positive'
      },
      {
        label: 'Cola operativa',
        value: `${ops.aprobacionesPendientes}`,
        trend: `${ops.incidenciasAbiertas} incidencias activas`,
        tone: ops.aprobacionesPendientes > 2 ? 'warning' : 'neutral'
      }
    ];
  });

  readonly topRegistros = computed(() => this.store.registros().slice(0, 5));
  readonly activity = computed(() => this.store.auditoria().slice(0, 8));
  readonly approvals = computed(() => this.store.aprobaciones().slice(0, 4));
  readonly incidents = computed(() => this.store.incidencias().slice(0, 4));
  readonly teamLoad = computed(() =>
    [...this.store.usuarios()]
      .sort((left, right) => right.carga - left.carga)
      .slice(0, 5)
  );
  readonly reportRadar = computed(() => this.store.reportes().slice(0, 4));

  readonly quickLinks: QuickLink[] = [
    {
      label: 'Abrir registros',
      route: '/registros',
      caption: 'Cola operativa, formularios y trazabilidad',
      selector: 'dashboard-open-registros'
    },
    {
      label: 'Gestion de usuarios',
      route: '/usuarios',
      caption: 'Accesos, invitaciones y permisos cruzados',
      selector: 'dashboard-open-usuarios'
    },
    {
      label: 'Radar de reportes',
      route: '/reportes',
      caption: 'Riesgo, revisiones y progreso por owner team',
      selector: 'dashboard-open-reportes'
    },
    {
      label: 'Centro de ajustes',
      route: '/ajustes',
      caption: 'Integraciones, bitacora y eventos manuales',
      selector: 'dashboard-open-ajustes'
    }
  ];

  approve(item: Aprobacion): void {
    this.store.approveSolicitud(item.id);
  }

  escalate(item: Aprobacion): void {
    this.store.escalateSolicitud(item.id);
  }

  cycleIncident(item: Incidencia): void {
    this.store.cycleIncidenciaEstado(item.id);
  }

  trackByApprovalId(_: number, item: Aprobacion): number {
    return item.id;
  }

  trackByIncidentId(_: number, item: Incidencia): number {
    return item.id;
  }
}
