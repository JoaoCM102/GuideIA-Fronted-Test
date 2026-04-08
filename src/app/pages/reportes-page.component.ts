import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminDataService, Reporte, ReporteEstado, ReporteTipo, Riesgo } from '../core/admin-data.service';

type ReportBoard = 'Radar' | 'Pipeline' | 'Owners';

@Component({
  selector: 'app-reportes-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes-page.component.html',
  styleUrl: './reportes-page.component.css'
})
export class ReportesPageComponent {
  private readonly store = inject(AdminDataService);

  readonly reporteStats = this.store.reporteStats;
  readonly tipoOptions: Array<'Todos' | ReporteTipo> = ['Todos', 'Calidad', 'Cumplimiento', 'Rendimiento'];
  readonly estadoOptions: Array<'Todos' | ReporteEstado> = ['Todos', 'Estable', 'En seguimiento', 'En riesgo'];
  readonly riesgoOptions: Array<'Todos' | Riesgo> = ['Todos', 'Bajo', 'Medio', 'Alto'];
  readonly boards: ReportBoard[] = ['Radar', 'Pipeline', 'Owners'];

  activeBoard: ReportBoard = 'Radar';
  selectedReporteId: number | null = null;
  filterTipo: 'Todos' | ReporteTipo = 'Todos';
  filterEstado: 'Todos' | ReporteEstado = 'Todos';
  filterRiesgo: 'Todos' | Riesgo = 'Todos';

  get visibleReportes(): Reporte[] {
    return this.store.reportes().filter((reporte) => {
      const matchesTipo = this.filterTipo === 'Todos' || reporte.tipo === this.filterTipo;
      const matchesEstado = this.filterEstado === 'Todos' || reporte.estado === this.filterEstado;
      const matchesRiesgo = this.filterRiesgo === 'Todos' || reporte.riesgo === this.filterRiesgo;
      return matchesTipo && matchesEstado && matchesRiesgo;
    });
  }

  get selectedReporte(): Reporte | null {
    return (
      this.visibleReportes.find((reporte) => reporte.id === this.selectedReporteId) ??
      this.visibleReportes[0] ??
      null
    );
  }

  bumpProgress(reporte: Reporte, delta: number): void {
    this.store.advanceReporte(reporte.id, delta);
  }

  selectReporte(reporte: Reporte): void {
    this.selectedReporteId = reporte.id;
  }

  setBoard(board: ReportBoard): void {
    this.activeBoard = board;
  }

  trackByReporteId(_: number, reporte: Reporte): number {
    return reporte.id;
  }
}
