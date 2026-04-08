import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import {
  animate,
  group,
  query,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';
import {
  mountAngularGuideChat,
  type GuideChatWidgetHandle,
} from 'guideai-npm';
import { AdminDataService } from './core/admin-data.service';
import { guideManifest } from './core/guide-manifest';
import { getGuideProjectContext } from './core/guide-project-context';

type NavigationItem = {
  label: string;
  route: string;
  icon: string;
  guideSelector: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('routeMotion', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(
          ':enter, :leave',
          [
            style({
              position: 'absolute',
              inset: 0,
              width: '100%'
            })
          ],
          { optional: true }
        ),
        query(
          ':enter',
          [style({ opacity: 0, transform: 'translateY(18px) scale(0.99)' })],
          { optional: true }
        ),
        group([
          query(
            ':leave',
            [animate('240ms ease-in', style({ opacity: 0, transform: 'translateY(-12px)' }))],
            { optional: true }
          ),
          query(
            ':enter',
            [animate('320ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'none' }))],
            { optional: true }
          )
        ])
      ])
    ])
  ]
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private readonly store = inject(AdminDataService);
  readonly title = 'GuideIA Admin';
  readonly navigation: NavigationItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '▣', guideSelector: 'menu-dashboard' },
    { label: 'Registros', route: '/registros', icon: '▤', guideSelector: 'menu-registros' },
    { label: 'Usuarios', route: '/usuarios', icon: '◉', guideSelector: 'menu-usuarios' },
    { label: 'Reportes', route: '/reportes', icon: '◨', guideSelector: 'menu-reportes' },
    { label: 'Ajustes', route: '/ajustes', icon: '⚙', guideSelector: 'menu-ajustes' }
  ];

  sidebarOpen = true;

  private widget?: GuideChatWidgetHandle;
  private readonly isBrowser: boolean;
  private readonly hashToRoute: Record<string, string> = {
    dashboard: '/dashboard',
    registros: '/registros',
    usuarios: '/usuarios',
    reportes: '/reportes',
    ajustes: '/ajustes'
  };
  private readonly hashListener = (): void => this.syncHashRoute();
  private readonly resizeListener = (): void => this.syncSidebarForViewport();

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private readonly router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.syncSidebarForViewport();

    this.widget = mountAngularGuideChat({
      baseUrl: 'http://127.0.0.1:8000',
      askPath: '/ask',
      buttonLabel: 'Guia IA',
      title: 'GuideIA Assistant',
      position: { bottom: 20, right: 20 },
      autoStartGuide: true,
      guideOverlayOpacity: 0.68,
      projectManifest: guideManifest,
      additionalContext: () => getGuideProjectContext(),
      getKnowledgeState: () => this.getGuideKnowledgeState(),
      getRuntimeState: () => ({
        route: this.currentRoute,
        hash: this.isBrowser ? window.location.hash || '' : '',
        sidebarOpen: this.sidebarOpen,
        currentModuleId: this.currentModuleId,
        currentModuleLabel: this.currentSectionLabel,
        forms: {
          registro: {
            visible: this.currentRoute.startsWith('/registros'),
            mode: 'create'
          },
          user: {
            visible: this.currentRoute.startsWith('/usuarios'),
            mode: 'create'
          }
        },
        extras: this.guideUiState
      })
    });

    this.syncHashRoute();
    window.addEventListener('hashchange', this.hashListener);
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) {
      return;
    }

    window.removeEventListener('hashchange', this.hashListener);
    window.removeEventListener('resize', this.resizeListener);
    this.widget?.destroy();
  }

  get currentSectionLabel(): string {
    const current = this.navigation.find((item) => this.router.url.startsWith(item.route));
    return current?.label ?? 'Dashboard';
  }

  get currentModuleId(): string {
    const current = this.navigation.find((item) => this.router.url.startsWith(item.route));
    return current?.guideSelector.replace(/^menu-/, '') ?? 'dashboard';
  }

  get currentRoute(): string {
    return this.router.url || '/dashboard';
  }

  get guideUiState() {
    return {
      route: {
        pathname: this.currentRoute,
        hash: this.isBrowser ? window.location.hash || '' : ''
      },
      sidebar: {
        open: this.sidebarOpen
      },
      modules: {
        currentLabel: this.currentSectionLabel,
        currentId: this.currentModuleId
      },
      forms: {
        registro: {
          visible: this.currentRoute.startsWith('/registros')
        },
        user: {
          visible: this.currentRoute.startsWith('/usuarios')
        }
      },
      workspaces: this.getWorkspaceSnapshot()
    };
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebarOnMobile(): void {
    if (this.isBrowser && window.innerWidth <= 1120) {
      this.sidebarOpen = false;
    }
  }

  prepareRoute(outlet: RouterOutlet): string {
    return (outlet.activatedRouteData?.['animation'] as string | undefined) ?? 'default';
  }

  private syncHashRoute(): void {
    if (!this.isBrowser) {
      return;
    }

    const hash = window.location.hash.replace(/^#/, '').trim().toLowerCase();
    if (!hash) {
      return;
    }

    const targetRoute = this.hashToRoute[hash];
    if (!targetRoute || this.router.url.startsWith(targetRoute)) {
      return;
    }

    void this.router.navigateByUrl(targetRoute);
  }

  private syncSidebarForViewport(): void {
    if (!this.isBrowser) {
      return;
    }

    if (window.innerWidth <= 1120) {
      this.sidebarOpen = false;
      return;
    }

    this.sidebarOpen = true;
  }

  private getGuideKnowledgeState() {
    const registros = this.store.registros();
    const usuarios = this.store.usuarios();
    const reportes = this.store.reportes();
    const integraciones = this.store.integraciones();
    const invitaciones = this.store.invitaciones();
    const incidencias = this.store.incidencias();
    const aprobaciones = this.store.aprobaciones();
    const reglas = this.store.reglas();
    const auditoria = this.store.auditoria();

    return {
      route: this.currentRoute,
      module: this.currentModuleId,
      metrics: {
        registros: this.store.registroStats(),
        usuarios: this.store.usuarioStats(),
        reportes: this.store.reporteStats(),
        operativa: this.store.operationalStats(),
        integraciones: this.store.integrationStats(),
        ajustes: {
          reglasActivas: reglas.filter((item) => item.enabled).length,
          eventosAuditoria: auditoria.length
        }
      },
      collections: {
        registrosActivos: registros
          .filter((item) => item.estado === 'Activo')
          .map((item) => ({
            id: item.id,
            codigo: item.codigo,
            nombre: item.nombre,
            prioridad: item.prioridad
          }))
          .slice(0, 6),
        usuariosBloqueados: usuarios
          .filter((item) => item.estado === 'Bloqueado')
          .map((item) => ({
            id: item.id,
            nombre: item.nombre,
            email: item.email
          }))
          .slice(0, 6),
        reportesEnRiesgo: reportes
          .filter((item) => item.estado === 'En riesgo')
          .map((item) => ({
            id: item.id,
            nombre: item.nombre,
            responsable: item.responsable
          }))
          .slice(0, 6),
        integracionesConError: integraciones
          .filter((item) => item.estado === 'Error')
          .map((item) => ({
            id: item.id,
            nombre: item.nombre,
            endpoint: item.endpoint
          }))
          .slice(0, 6),
        invitacionesPendientes: invitaciones
          .filter((item) => item.estado === 'Pendiente')
          .map((item) => ({
            id: item.id,
            nombre: item.nombre,
            email: item.email
          }))
          .slice(0, 6),
        incidenciasAbiertas: incidencias
          .filter((item) => item.estado !== 'Resuelta')
          .map((item) => ({
            id: item.id,
            servicio: item.servicio,
            estado: item.estado,
            impacto: item.impacto
          }))
          .slice(0, 6),
        aprobacionesPendientes: aprobaciones
          .filter((item) => item.estado !== 'Aprobado')
          .map((item) => ({
            id: item.id,
            titulo: item.titulo,
            responsable: item.responsable,
            estado: item.estado
          }))
          .slice(0, 6),
        usuariosMayorCarga: [...usuarios]
          .sort((a, b) => b.carga - a.carga)
          .map((item) => ({
            id: item.id,
            nombre: item.nombre,
            carga: item.carga,
            equipo: item.equipo
          }))
          .slice(0, 6),
        integracionesMayorLatencia: [...integraciones]
          .sort((a, b) => b.latencia - a.latencia)
          .map((item) => ({
            id: item.id,
            nombre: item.nombre,
            latencia: item.latencia,
            endpoint: item.endpoint
          }))
          .slice(0, 6),
        reglasActivas: reglas
          .filter((item) => item.enabled)
          .map((item) => ({
            id: item.id,
            nombre: item.nombre,
            scope: item.scope,
            severidad: item.severidad
          }))
          .slice(0, 6)
      }
    };
  }

  private getWorkspaceSnapshot() {
    return {
      dashboard: {
        visible: this.isGuideVisible('[data-guideia="dashboard-page"]'),
        commandGridVisible: this.isGuideVisible('[data-guideia="dashboard-command-grid"]'),
        approvalsVisible: this.isGuideVisible('[data-guideia="dashboard-approvals"]'),
        incidentsVisible: this.isGuideVisible('[data-guideia="dashboard-incidents"]')
      },
      registros: {
        visible: this.isGuideVisible('[data-guideia="registro-feature"]'),
        activeView: this.getActiveSwitcherValue('[data-guideia="registros-switcher"]'),
        formVisible: this.isGuideVisible('[data-guideia="form-registro"]'),
        tableVisible: this.isGuideVisible('[data-guideia="tabla-registros"]'),
        inspectorVisible: this.isGuideVisible('[data-guideia="registro-inspector"]'),
        rowCount: this.countVisibleRows('[data-guideia^="fila-registro-"]')
      },
      usuarios: {
        visible: this.isGuideVisible('[data-guideia="usuarios-page"]'),
        activeView: this.getActiveSwitcherValue('[data-guideia="usuarios-switcher"]'),
        formVisible: this.isGuideVisible('[data-guideia="form-usuario"]'),
        sidePanelVisible: this.isGuideVisible('[data-guideia="usuarios-side-panel"]'),
        permisosVisible: this.isGuideVisible('[data-guideia="usuarios-permisos-panel"]'),
        invitacionesVisible: this.isGuideVisible('[data-guideia="usuarios-invitaciones-panel"]'),
        invitacionFormVisible: this.isGuideVisible('[data-guideia="usuario-invitacion-form"]'),
        rowCount: this.countVisibleRows('[data-guideia^="fila-usuario-"]')
      },
      reportes: {
        visible: this.isGuideVisible('[data-guideia="reportes-page"]'),
        activeBoard: this.getActiveSwitcherValue('[data-guideia="reportes-switcher"]'),
        toolbarVisible: this.isGuideVisible('[data-guideia="reportes-toolbar"]'),
        radarVisible: this.isGuideVisible('[data-guideia="reportes-radar-panel"]'),
        sidePanelVisible: this.isGuideVisible('[data-guideia="reportes-side-panel"]'),
        rowCount: this.countVisibleRows('[data-guideia^="fila-reporte-"]')
      },
      ajustes: {
        visible: this.isGuideVisible('[data-guideia="servicios-feature"]'),
        activeView: this.getActiveSwitcherValue('[data-guideia="ajustes-switcher"]'),
        configVisible: this.isGuideVisible('[data-guideia="ajustes-config-form"]'),
        integrationFormVisible: this.isGuideVisible('[data-guideia="integracion-form"]'),
        integrationsVisible: this.isGuideVisible('[data-guideia="integraciones-panel"]'),
        rulesVisible: this.isGuideVisible('[data-guideia="ajustes-reglas-panel"]'),
        auditVisible: this.isGuideVisible('[data-guideia="ajustes-auditoria-panel"]'),
        sidePanelVisible: this.isGuideVisible('[data-guideia="ajustes-side-panel"]'),
        rowCount: this.countVisibleRows('[data-guideia^="fila-integracion-"]')
      }
    };
  }

  private getActiveSwitcherValue(selector: string): string | null {
    if (!this.isBrowser) {
      return null;
    }

    const active = document.querySelector<HTMLElement>(`${selector} .active`);
    const label = active?.querySelector<HTMLElement>('span')?.textContent?.trim();
    return label || active?.textContent?.trim() || null;
  }

  private countVisibleRows(selector: string): number {
    if (!this.isBrowser) {
      return 0;
    }

    return Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((item) =>
      this.isElementVisible(item)
    ).length;
  }

  private isGuideVisible(selector: string): boolean {
    if (!this.isBrowser) {
      return false;
    }

    const element = document.querySelector<HTMLElement>(selector);
    return this.isElementVisible(element);
  }

  private isElementVisible(element: HTMLElement | null): boolean {
    if (!element) {
      return false;
    }

    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }

    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }
}
