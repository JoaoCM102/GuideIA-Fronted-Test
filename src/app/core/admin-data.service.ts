import { Injectable, computed, signal } from '@angular/core';

export type RegistroEstado = 'Activo' | 'Pendiente' | 'Inactivo';
export type RegistroPrioridad = 'Alta' | 'Media' | 'Baja';
export type RegistroCanal = 'Web' | 'API' | 'Batch';
export type RegistroOrigen = 'Manual' | 'Integracion' | 'Migracion';
export type RegistroSla = '24h' | '48h' | '72h';

export type UsuarioEstado = 'Online' | 'Ausente' | 'Bloqueado';
export type UsuarioRol = 'Admin' | 'Editor' | 'Viewer';
export type UsuarioEquipo = 'Operaciones' | 'Finanzas' | 'Legal' | 'Producto';
export type UsuarioZona = 'EMEA' | 'LATAM' | 'NA';
export type UsuarioCanal = 'Email' | 'Slack' | 'Teams';

export type ReporteTipo = 'Calidad' | 'Cumplimiento' | 'Rendimiento';
export type ReporteEstado = 'Estable' | 'En seguimiento' | 'En riesgo';
export type Riesgo = 'Bajo' | 'Medio' | 'Alto';
export type Severidad = 'Info' | 'Warning' | 'Critical';
export type EstadoAprobacion = 'Pendiente' | 'Escalado' | 'Aprobado';
export type EstadoInvitacion = 'Pendiente' | 'Aceptada' | 'Expirada';
export type EstadoIncidencia = 'Abierta' | 'Mitigada' | 'Resuelta';
export type IntegracionTipo = 'REST' | 'Webhook' | 'SFTP' | 'LLM';
export type IntegracionEstado = 'Activa' | 'Pausada' | 'Error';
export type ReglaScope = 'Registros' | 'Usuarios' | 'Reportes' | 'Ajustes';

export interface Registro {
  id: number;
  codigo: string;
  nombre: string;
  resumen: string;
  estado: RegistroEstado;
  prioridad: RegistroPrioridad;
  propietario: string;
  canal: RegistroCanal;
  origen: RegistroOrigen;
  sla: RegistroSla;
  fechaLimite: string;
  etiquetas: string[];
  checklist: number;
  comentarios: number;
  creadoEn: string;
}

export interface RegistroInput {
  codigo: string;
  nombre: string;
  resumen: string;
  estado: RegistroEstado;
  prioridad: RegistroPrioridad;
  propietario: string;
  canal: RegistroCanal;
  origen: RegistroOrigen;
  sla: RegistroSla;
  fechaLimite: string;
  etiquetas: string[];
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: UsuarioRol;
  estado: UsuarioEstado;
  equipo: UsuarioEquipo;
  zona: UsuarioZona;
  canalPreferido: UsuarioCanal;
  mfa: boolean;
  ultimoAcceso: string;
  ticketsAbiertos: number;
  carga: number;
}

export interface UsuarioInput {
  nombre: string;
  email: string;
  rol: UsuarioRol;
  estado: UsuarioEstado;
  equipo: UsuarioEquipo;
  zona: UsuarioZona;
  canalPreferido: UsuarioCanal;
  mfa: boolean;
}

export interface Reporte {
  id: number;
  nombre: string;
  tipo: ReporteTipo;
  estado: ReporteEstado;
  riesgo: Riesgo;
  responsable: string;
  ownerTeam: string;
  progreso: number;
  alertas: number;
  actualizadoEn: string;
  proximaRevision: string;
}

export interface EventoAuditoria {
  id: number;
  actor: string;
  modulo: string;
  accion: string;
  fecha: string;
  severidad: Severidad;
}

export interface Aprobacion {
  id: number;
  tipo: 'Acceso' | 'Despliegue' | 'Proveedor';
  titulo: string;
  responsable: string;
  fechaObjetivo: string;
  estado: EstadoAprobacion;
}

export interface Invitacion {
  id: number;
  nombre: string;
  email: string;
  rol: UsuarioRol;
  equipo: UsuarioEquipo;
  estado: EstadoInvitacion;
  enviadaEn: string;
}

export interface Incidencia {
  id: number;
  servicio: string;
  entorno: 'Produccion' | 'Preproduccion' | 'Interno';
  impacto: Riesgo;
  estado: EstadoIncidencia;
  owner: string;
  actualizadoEn: string;
}

export interface Integracion {
  id: number;
  nombre: string;
  tipo: IntegracionTipo;
  estado: IntegracionEstado;
  endpoint: string;
  rateLimit: number;
  propietario: string;
  ultimaSync: string;
  latencia: number;
}

export interface IntegracionInput {
  nombre: string;
  tipo: IntegracionTipo;
  estado: IntegracionEstado;
  endpoint: string;
  rateLimit: number;
  propietario: string;
}

export interface ReglaOperativa {
  id: number;
  nombre: string;
  scope: ReglaScope;
  enabled: boolean;
  severidad: Severidad;
  threshold: number;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private readonly _registros = signal<Registro[]>([
    {
      id: 101,
      codigo: 'REG-101',
      nombre: 'Alta de proveedor externo',
      resumen: 'Onboarding operativo y validacion documental inicial.',
      estado: 'Activo',
      prioridad: 'Alta',
      propietario: 'Operaciones',
      canal: 'Web',
      origen: 'Manual',
      sla: '24h',
      fechaLimite: '2026-03-24',
      etiquetas: ['onboarding', 'proveedores'],
      checklist: 7,
      comentarios: 3,
      creadoEn: '2026-03-17 10:20'
    },
    {
      id: 102,
      codigo: 'REG-102',
      nombre: 'Revision de facturas marzo',
      resumen: 'Control de consistencia y estado de aprobacion de proveedores.',
      estado: 'Pendiente',
      prioridad: 'Media',
      propietario: 'Finanzas',
      canal: 'Batch',
      origen: 'Integracion',
      sla: '48h',
      fechaLimite: '2026-03-26',
      etiquetas: ['facturas', 'proveedores'],
      checklist: 4,
      comentarios: 5,
      creadoEn: '2026-03-17 14:50'
    },
    {
      id: 103,
      codigo: 'REG-103',
      nombre: 'Sincronizar catalogo',
      resumen: 'Carga de referencias de producto desde sistema externo.',
      estado: 'Inactivo',
      prioridad: 'Baja',
      propietario: 'Integraciones',
      canal: 'API',
      origen: 'Migracion',
      sla: '72h',
      fechaLimite: '2026-03-30',
      etiquetas: ['catalogo', 'erp'],
      checklist: 2,
      comentarios: 1,
      creadoEn: '2026-03-18 09:12'
    },
    {
      id: 104,
      codigo: 'REG-104',
      nombre: 'Auditoria de permisos premium',
      resumen: 'Revision puntual de accesos y segregacion de perfiles sensibles.',
      estado: 'Activo',
      prioridad: 'Alta',
      propietario: 'Seguridad',
      canal: 'Web',
      origen: 'Manual',
      sla: '24h',
      fechaLimite: '2026-03-22',
      etiquetas: ['seguridad', 'permisos'],
      checklist: 9,
      comentarios: 6,
      creadoEn: '2026-03-19 07:45'
    }
  ]);

  private readonly _usuarios = signal<Usuario[]>([
    {
      id: 1,
      nombre: 'Ana Ruiz',
      email: 'ana.ruiz@guideia.local',
      rol: 'Admin',
      estado: 'Online',
      equipo: 'Operaciones',
      zona: 'EMEA',
      canalPreferido: 'Slack',
      mfa: true,
      ultimoAcceso: 'Hace 2 min',
      ticketsAbiertos: 1,
      carga: 78
    },
    {
      id: 2,
      nombre: 'Carlos Vega',
      email: 'carlos.vega@guideia.local',
      rol: 'Editor',
      estado: 'Ausente',
      equipo: 'Finanzas',
      zona: 'LATAM',
      canalPreferido: 'Email',
      mfa: true,
      ultimoAcceso: 'Hace 18 min',
      ticketsAbiertos: 3,
      carga: 54
    },
    {
      id: 3,
      nombre: 'Laura Ortega',
      email: 'laura.ortega@guideia.local',
      rol: 'Viewer',
      estado: 'Bloqueado',
      equipo: 'Legal',
      zona: 'EMEA',
      canalPreferido: 'Teams',
      mfa: false,
      ultimoAcceso: 'Hace 1 dia',
      ticketsAbiertos: 0,
      carga: 21
    },
    {
      id: 4,
      nombre: 'Diego Ramos',
      email: 'diego.ramos@guideia.local',
      rol: 'Editor',
      estado: 'Online',
      equipo: 'Producto',
      zona: 'NA',
      canalPreferido: 'Slack',
      mfa: true,
      ultimoAcceso: 'Hace 5 min',
      ticketsAbiertos: 2,
      carga: 67
    }
  ]);

  private readonly _reportes = signal<Reporte[]>([
    {
      id: 5001,
      nombre: 'Calidad de datos CRM',
      tipo: 'Calidad',
      estado: 'En seguimiento',
      riesgo: 'Medio',
      responsable: 'Data Ops',
      ownerTeam: 'Operaciones',
      progreso: 62,
      alertas: 4,
      actualizadoEn: 'Hoy 09:30',
      proximaRevision: '2026-03-22'
    },
    {
      id: 5002,
      nombre: 'Cumplimiento RGPD Q1',
      tipo: 'Cumplimiento',
      estado: 'Estable',
      riesgo: 'Bajo',
      responsable: 'Legal',
      ownerTeam: 'Legal',
      progreso: 88,
      alertas: 1,
      actualizadoEn: 'Hoy 08:10',
      proximaRevision: '2026-03-28'
    },
    {
      id: 5003,
      nombre: 'Performance API clientes',
      tipo: 'Rendimiento',
      estado: 'En riesgo',
      riesgo: 'Alto',
      responsable: 'Plataforma',
      ownerTeam: 'Producto',
      progreso: 41,
      alertas: 6,
      actualizadoEn: 'Ayer 19:40',
      proximaRevision: '2026-03-21'
    },
    {
      id: 5004,
      nombre: 'Cobertura pruebas checkout',
      tipo: 'Calidad',
      estado: 'En seguimiento',
      riesgo: 'Medio',
      responsable: 'QA Guild',
      ownerTeam: 'Producto',
      progreso: 74,
      alertas: 2,
      actualizadoEn: 'Ayer 16:05',
      proximaRevision: '2026-03-25'
    }
  ]);

  private readonly _auditoria = signal<EventoAuditoria[]>([
    {
      id: 9001,
      actor: 'Sistema',
      modulo: 'Seguridad',
      accion: 'Rotacion de token de integracion',
      fecha: '2026-03-18 22:20',
      severidad: 'Info'
    },
    {
      id: 9002,
      actor: 'Ana Ruiz',
      modulo: 'Registros',
      accion: 'Actualizo estado de 6 elementos',
      fecha: '2026-03-19 08:45',
      severidad: 'Warning'
    },
    {
      id: 9003,
      actor: 'Sistema',
      modulo: 'Monitoreo',
      accion: 'Latencia alta detectada en API /sync',
      fecha: '2026-03-19 10:12',
      severidad: 'Critical'
    },
    {
      id: 9004,
      actor: 'Carlos Vega',
      modulo: 'Usuarios',
      accion: 'Reasigno permisos temporales para auditoria',
      fecha: '2026-03-19 12:35',
      severidad: 'Info'
    }
  ]);

  private readonly _aprobaciones = signal<Aprobacion[]>([
    {
      id: 3001,
      tipo: 'Proveedor',
      titulo: 'Alta de proveedor Nexus Supply',
      responsable: 'Finanzas',
      fechaObjetivo: '2026-03-22',
      estado: 'Pendiente'
    },
    {
      id: 3002,
      tipo: 'Acceso',
      titulo: 'Permiso temporal a consola de incidencias',
      responsable: 'Seguridad',
      fechaObjetivo: '2026-03-20',
      estado: 'Escalado'
    },
    {
      id: 3003,
      tipo: 'Despliegue',
      titulo: 'Ventana nocturna modulo billing',
      responsable: 'Producto',
      fechaObjetivo: '2026-03-24',
      estado: 'Pendiente'
    }
  ]);

  private readonly _invitaciones = signal<Invitacion[]>([
    {
      id: 7001,
      nombre: 'Maria Sanz',
      email: 'maria.sanz@externo.local',
      rol: 'Viewer',
      equipo: 'Legal',
      estado: 'Pendiente',
      enviadaEn: '2026-03-18 11:40'
    },
    {
      id: 7002,
      nombre: 'Pablo León',
      email: 'pablo.leon@partner.local',
      rol: 'Editor',
      equipo: 'Operaciones',
      estado: 'Aceptada',
      enviadaEn: '2026-03-17 09:05'
    }
  ]);

  private readonly _incidencias = signal<Incidencia[]>([
    {
      id: 8201,
      servicio: 'API /sync',
      entorno: 'Produccion',
      impacto: 'Alto',
      estado: 'Abierta',
      owner: 'Plataforma',
      actualizadoEn: 'Hace 7 min'
    },
    {
      id: 8202,
      servicio: 'Worker facturacion',
      entorno: 'Preproduccion',
      impacto: 'Medio',
      estado: 'Mitigada',
      owner: 'Finanzas',
      actualizadoEn: 'Hace 42 min'
    },
    {
      id: 8203,
      servicio: 'SSO interno',
      entorno: 'Interno',
      impacto: 'Bajo',
      estado: 'Resuelta',
      owner: 'Seguridad',
      actualizadoEn: 'Hace 3 h'
    }
  ]);

  private readonly _integraciones = signal<Integracion[]>([
    {
      id: 6101,
      nombre: 'CRM Master',
      tipo: 'REST',
      estado: 'Activa',
      endpoint: 'https://crm.demo.local/api/sync',
      rateLimit: 120,
      propietario: 'Operaciones',
      ultimaSync: 'Hace 4 min',
      latencia: 180
    },
    {
      id: 6102,
      nombre: 'Pasarela legal',
      tipo: 'Webhook',
      estado: 'Pausada',
      endpoint: 'https://legal.demo.local/hooks/casos',
      rateLimit: 40,
      propietario: 'Legal',
      ultimaSync: 'Hace 2 h',
      latencia: 0
    },
    {
      id: 6103,
      nombre: 'Almacen historico',
      tipo: 'SFTP',
      estado: 'Error',
      endpoint: 'sftp://warehouse.demo.local/outbound',
      rateLimit: 12,
      propietario: 'Finanzas',
      ultimaSync: 'Ayer 23:12',
      latencia: 920
    },
    {
      id: 6104,
      nombre: 'Motor IA Python',
      tipo: 'LLM',
      estado: 'Activa',
      endpoint: 'http://127.0.0.1:8000/ask',
      rateLimit: 80,
      propietario: 'Producto',
      ultimaSync: 'Hace 30 s',
      latencia: 240
    }
  ]);

  private readonly _reglas = signal<ReglaOperativa[]>([
    {
      id: 6401,
      nombre: 'Escalado por SLA vencido',
      scope: 'Registros',
      enabled: true,
      severidad: 'Warning',
      threshold: 48,
      descripcion: 'Escala registros activos cuando superan la ventana de SLA.'
    },
    {
      id: 6402,
      nombre: 'Bloqueo por login anomalo',
      scope: 'Usuarios',
      enabled: true,
      severidad: 'Critical',
      threshold: 3,
      descripcion: 'Bloquea usuarios tras multiples eventos de riesgo consecutivos.'
    },
    {
      id: 6403,
      nombre: 'Alerta por progreso bajo',
      scope: 'Reportes',
      enabled: true,
      severidad: 'Warning',
      threshold: 50,
      descripcion: 'Marca reportes por debajo del umbral y los envia a seguimiento.'
    },
    {
      id: 6404,
      nombre: 'Revision de tokens inactivos',
      scope: 'Ajustes',
      enabled: false,
      severidad: 'Info',
      threshold: 30,
      descripcion: 'Lanza una revision programada de secretos sin uso reciente.'
    }
  ]);

  readonly registros = this._registros.asReadonly();
  readonly usuarios = this._usuarios.asReadonly();
  readonly reportes = this._reportes.asReadonly();
  readonly auditoria = this._auditoria.asReadonly();
  readonly aprobaciones = this._aprobaciones.asReadonly();
  readonly invitaciones = this._invitaciones.asReadonly();
  readonly incidencias = this._incidencias.asReadonly();
  readonly integraciones = this._integraciones.asReadonly();
  readonly reglas = this._reglas.asReadonly();

  readonly registroStats = computed(() => {
    const registros = this._registros();
    return {
      total: registros.length,
      activos: registros.filter((registro) => registro.estado === 'Activo').length,
      pendientes: registros.filter((registro) => registro.estado === 'Pendiente').length,
      criticos: registros.filter((registro) => registro.prioridad === 'Alta').length,
      integraciones: registros.filter((registro) => registro.origen === 'Integracion').length
    };
  });

  readonly usuarioStats = computed(() => {
    const usuarios = this._usuarios();
    return {
      total: usuarios.length,
      online: usuarios.filter((usuario) => usuario.estado === 'Online').length,
      bloqueados: usuarios.filter((usuario) => usuario.estado === 'Bloqueado').length,
      mfaEnabled: usuarios.filter((usuario) => usuario.mfa).length
    };
  });

  readonly reporteStats = computed(() => {
    const reportes = this._reportes();
    const promedio =
      reportes.length === 0
        ? 0
        : Math.round(
            reportes.reduce((acc, reporte) => acc + reporte.progreso, 0) / reportes.length
          );

    return {
      total: reportes.length,
      progresoPromedio: promedio,
      vencidos: reportes.filter((reporte) => reporte.progreso < 50).length,
      enRiesgo: reportes.filter((reporte) => reporte.estado === 'En riesgo').length
    };
  });

  readonly operationalStats = computed(() => ({
    aprobacionesPendientes: this._aprobaciones().filter((item) => item.estado !== 'Aprobado').length,
    incidenciasAbiertas: this._incidencias().filter((item) => item.estado !== 'Resuelta').length,
    invitacionesPendientes: this._invitaciones().filter((item) => item.estado === 'Pendiente').length
  }));

  readonly integrationStats = computed(() => {
    const integraciones = this._integraciones();
    return {
      total: integraciones.length,
      activas: integraciones.filter((item) => item.estado === 'Activa').length,
      error: integraciones.filter((item) => item.estado === 'Error').length,
      llm: integraciones.filter((item) => item.tipo === 'LLM').length
    };
  });

  addRegistro(input: RegistroInput): void {
    const newRegistro: Registro = {
      id: this.nextId(this._registros().map((registro) => registro.id), 100),
      codigo: input.codigo.trim() || `REG-${this.nextId(this._registros().map((registro) => registro.id), 100)}`,
      nombre: input.nombre.trim(),
      resumen: input.resumen.trim(),
      estado: input.estado,
      prioridad: input.prioridad,
      propietario: input.propietario.trim() || 'Sin asignar',
      canal: input.canal,
      origen: input.origen,
      sla: input.sla,
      fechaLimite: input.fechaLimite || this.nextBusinessDate(3),
      etiquetas: input.etiquetas.filter(Boolean),
      checklist: Math.max(2, Math.min(9, input.etiquetas.length + 3)),
      comentarios: Math.max(1, input.resumen.trim().split(' ').length % 6),
      creadoEn: this.timestamp()
    };

    this._registros.update((registros) => [newRegistro, ...registros]);
    this.pushAudit('Operador', 'Registros', `Creo registro #${newRegistro.id}`, 'Info');
  }

  updateRegistro(id: number, input: RegistroInput): void {
    this._registros.update((registros) =>
      registros.map((registro) =>
        registro.id === id
          ? {
              ...registro,
              codigo: input.codigo.trim() || registro.codigo,
              nombre: input.nombre.trim(),
              resumen: input.resumen.trim(),
              estado: input.estado,
              prioridad: input.prioridad,
              propietario: input.propietario.trim() || 'Sin asignar',
              canal: input.canal,
              origen: input.origen,
              sla: input.sla,
              fechaLimite: input.fechaLimite || registro.fechaLimite,
              etiquetas: input.etiquetas.filter(Boolean)
            }
          : registro
      )
    );
    this.pushAudit('Operador', 'Registros', `Actualizo registro #${id}`, 'Warning');
  }

  deleteRegistro(id: number): void {
    this._registros.update((registros) => registros.filter((registro) => registro.id !== id));
    this.pushAudit('Operador', 'Registros', `Elimino registro #${id}`, 'Warning');
  }

  cycleUsuarioEstado(id: number): void {
    const nextState: Record<UsuarioEstado, UsuarioEstado> = {
      Online: 'Ausente',
      Ausente: 'Bloqueado',
      Bloqueado: 'Online'
    };

    this._usuarios.update((usuarios) =>
      usuarios.map((usuario) =>
        usuario.id === id ? { ...usuario, estado: nextState[usuario.estado] } : usuario
      )
    );

    this.pushAudit('Administrador', 'Usuarios', `Cambio estado del usuario #${id}`, 'Info');
  }

  setUsuarioRol(id: number, rol: UsuarioRol): void {
    this._usuarios.update((usuarios) =>
      usuarios.map((usuario) => (usuario.id === id ? { ...usuario, rol } : usuario))
    );
    this.pushAudit('Administrador', 'Usuarios', `Actualizo rol del usuario #${id}`, 'Warning');
  }

  addUsuario(input: UsuarioInput): void {
    const newUsuario: Usuario = {
      id: this.nextId(this._usuarios().map((usuario) => usuario.id), 0),
      nombre: input.nombre.trim(),
      email: input.email.trim().toLowerCase(),
      rol: input.rol,
      estado: input.estado,
      equipo: input.equipo,
      zona: input.zona,
      canalPreferido: input.canalPreferido,
      mfa: input.mfa,
      ultimoAcceso: 'Ahora mismo',
      ticketsAbiertos: 0,
      carga: 18
    };

    this._usuarios.update((usuarios) => [newUsuario, ...usuarios]);
    this.pushAudit('Administrador', 'Usuarios', `Creo usuario #${newUsuario.id}`, 'Info');
  }

  addInvitacion(nombre: string, email: string, rol: UsuarioRol, equipo: UsuarioEquipo): void {
    const invitacion: Invitacion = {
      id: this.nextId(this._invitaciones().map((item) => item.id), 7000),
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      rol,
      equipo,
      estado: 'Pendiente',
      enviadaEn: this.timestamp()
    };

    this._invitaciones.update((items) => [invitacion, ...items]);
    this.pushAudit('Administrador', 'Usuarios', `Lanzo invitacion ${invitacion.email}`, 'Info');
  }

  advanceReporte(id: number, delta: number): void {
    this._reportes.update((reportes) =>
      reportes.map((reporte) =>
        reporte.id === id
          ? {
              ...reporte,
              progreso: Math.max(0, Math.min(100, reporte.progreso + delta)),
              actualizadoEn: this.timestampShort(),
              estado:
                reporte.progreso + delta >= 85
                  ? 'Estable'
                  : reporte.progreso + delta < 50
                    ? 'En riesgo'
                    : 'En seguimiento'
            }
          : reporte
      )
    );
    this.pushAudit('Analitica', 'Reportes', `Ajusto progreso del reporte #${id}`, 'Info');
  }

  approveSolicitud(id: number): void {
    this._aprobaciones.update((items) =>
      items.map((item) => (item.id === id ? { ...item, estado: 'Aprobado' } : item))
    );
    this.pushAudit('Coordinador', 'Aprobaciones', `Aprobo solicitud #${id}`, 'Info');
  }

  escalateSolicitud(id: number): void {
    this._aprobaciones.update((items) =>
      items.map((item) => (item.id === id ? { ...item, estado: 'Escalado' } : item))
    );
    this.pushAudit('Coordinador', 'Aprobaciones', `Escalo solicitud #${id}`, 'Warning');
  }

  cycleIncidenciaEstado(id: number): void {
    const nextState: Record<EstadoIncidencia, EstadoIncidencia> = {
      Abierta: 'Mitigada',
      Mitigada: 'Resuelta',
      Resuelta: 'Abierta'
    };

    this._incidencias.update((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, estado: nextState[item.estado], actualizadoEn: this.timestampShort() }
          : item
      )
    );
    this.pushAudit('Monitoreo', 'Incidencias', `Actualizo incidencia #${id}`, 'Critical');
  }

  addIntegracion(input: IntegracionInput): void {
    const integracion: Integracion = {
      id: this.nextId(this._integraciones().map((item) => item.id), 6100),
      nombre: input.nombre.trim(),
      tipo: input.tipo,
      estado: input.estado,
      endpoint: input.endpoint.trim(),
      rateLimit: Math.max(5, Math.round(input.rateLimit || 30)),
      propietario: input.propietario.trim() || 'Plataforma',
      ultimaSync: 'Pendiente',
      latencia: input.estado === 'Error' ? 999 : input.tipo === 'LLM' ? 250 : 140
    };

    this._integraciones.update((items) => [integracion, ...items]);
    this.pushAudit('Administrador', 'Ajustes', `Creo integracion ${integracion.nombre}`, 'Info');
  }

  cycleIntegracionEstado(id: number): void {
    const nextState: Record<IntegracionEstado, IntegracionEstado> = {
      Activa: 'Pausada',
      Pausada: 'Error',
      Error: 'Activa'
    };

    this._integraciones.update((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              estado: nextState[item.estado],
              ultimaSync: this.timestampShort(),
              latencia:
                nextState[item.estado] === 'Error'
                  ? 999
                  : nextState[item.estado] === 'Pausada'
                    ? 0
                    : Math.max(90, item.latencia - 45)
            }
          : item
      )
    );

    this.pushAudit('Administrador', 'Ajustes', `Cambio estado de integracion #${id}`, 'Warning');
  }

  toggleRegla(id: number): void {
    this._reglas.update((items) =>
      items.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
    this.pushAudit('Administrador', 'Ajustes', `Cambio estado de regla #${id}`, 'Info');
  }

  updateReglaThreshold(id: number, threshold: number): void {
    this._reglas.update((items) =>
      items.map((item) =>
        item.id === id ? { ...item, threshold: Math.max(1, Math.round(threshold)) } : item
      )
    );
    this.pushAudit('Administrador', 'Ajustes', `Ajusto umbral de regla #${id}`, 'Warning');
  }

  registrarEvento(actor: string, modulo: string, accion: string, severidad: Severidad): void {
    this.pushAudit(actor.trim() || 'Usuario', modulo.trim() || 'General', accion.trim(), severidad);
  }

  private pushAudit(actor: string, modulo: string, accion: string, severidad: Severidad): void {
    if (!accion) {
      return;
    }

    const evento: EventoAuditoria = {
      id: this.nextId(this._auditoria().map((item) => item.id), 9000),
      actor,
      modulo,
      accion,
      fecha: this.timestamp(),
      severidad
    };

    this._auditoria.update((items) => [evento, ...items].slice(0, 160));
  }

  private nextId(ids: number[], fallbackBase: number): number {
    if (ids.length === 0) {
      return fallbackBase + 1;
    }
    return Math.max(...ids) + 1;
  }

  private timestamp(): string {
    return new Date().toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private timestampShort(): string {
    return new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private nextBusinessDate(offsetDays: number): string {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().slice(0, 10);
  }
}
