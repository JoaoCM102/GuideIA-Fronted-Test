import { Routes } from '@angular/router';
import { AjustesPageComponent } from './pages/ajustes-page.component';
import { DashboardPageComponent } from './pages/dashboard-page.component';
import { RegistrosPageComponent } from './pages/registros-page.component';
import { ReportesPageComponent } from './pages/reportes-page.component';
import { UsuariosPageComponent } from './pages/usuarios-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    data: { animation: 'dashboard' }
  },
  {
    path: 'registros',
    component: RegistrosPageComponent,
    data: { animation: 'registros' }
  },
  {
    path: 'usuarios',
    component: UsuariosPageComponent,
    data: { animation: 'usuarios' }
  },
  {
    path: 'reportes',
    component: ReportesPageComponent,
    data: { animation: 'reportes' }
  },
  {
    path: 'ajustes',
    component: AjustesPageComponent,
    data: { animation: 'ajustes' }
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
