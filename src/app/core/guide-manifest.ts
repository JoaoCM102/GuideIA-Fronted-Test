import type { GuideProjectManifest } from 'guideai-npm';

export const guideManifest: GuideProjectManifest = {
  selectors: {
    openMenu: '[data-guideia="menu-hamburguesa"]',
    goDashboard: '[data-guideia="menu-dashboard"]',
    goRegistros: '[data-guideia="menu-registros"]',
    goUsuarios: '[data-guideia="menu-usuarios"]',
    goReportes: '[data-guideia="menu-reportes"]',
    goAjustes: '[data-guideia="menu-ajustes"]',
    dashboardOpenRegistros: '[data-guideia="dashboard-open-registros"]',
    dashboardOpenUsuarios: '[data-guideia="dashboard-open-usuarios"]',
    dashboardOpenReportes: '[data-guideia="dashboard-open-reportes"]',
    dashboardOpenAjustes: '[data-guideia="dashboard-open-ajustes"]',
    registrosSwitcher: '[data-guideia="registros-switcher"]',
    registrosOperativos: '[data-guideia="registros-tab-operativos"]',
    registrosBacklog: '[data-guideia="registros-tab-backlog"]',
    registrosArchivados: '[data-guideia="registros-tab-archivados"]',
    usuariosSwitcher: '[data-guideia="usuarios-switcher"]',
    usuariosDirectorio: '[data-guideia="usuarios-tab-directorio"]',
    usuariosPermisos: '[data-guideia="usuarios-tab-permisos"]',
    usuariosInvitaciones: '[data-guideia="usuarios-tab-invitaciones"]',
    reportesSwitcher: '[data-guideia="reportes-switcher"]',
    reportesRadar: '[data-guideia="reportes-tab-radar"]',
    reportesPipeline: '[data-guideia="reportes-tab-pipeline"]',
    reportesOwners: '[data-guideia="reportes-tab-owners"]',
    reportesTipo: '[data-guideia="reportes-tipo-select"]',
    reportesEstado: '[data-guideia="reportes-estado-select"]',
    reportesRiesgo: '[data-guideia="reportes-riesgo-select"]',
    ajustesSwitcher: '[data-guideia="ajustes-switcher"]',
    ajustesIntegraciones: '[data-guideia="ajustes-tab-integraciones"]',
    ajustesPoliticas: '[data-guideia="ajustes-tab-politicas"]',
    ajustesAuditoria: '[data-guideia="ajustes-tab-auditoria"]',
    ajustesConfigForm: '[data-guideia="ajustes-config-form"]',
    ajustesIntegrationForm: '[data-guideia="integracion-form"]',
    ajustesAuditForm: '[data-guideia="auditoria-form"]'
  },
  modules: {
    dashboard: {
      route: '/dashboard',
      menuSelector: '[data-guideia="menu-dashboard"]',
      pageSelector: '[data-guideia="dashboard-page"]',
      aliases: ['inicio', 'panel', 'home', 'dashboard', 'centro de control']
    },
    registros: {
      route: '/registros',
      menuSelector: '[data-guideia="menu-registros"]',
      pageSelector: '[data-guideia="registro-feature"]',
      aliases: ['registros', 'registro', 'operativos', 'backlog', 'archivados'],
      forms: {
        create: {
          rootSelector: '[data-guideia="form-registro"]',
          submitSelector: '[data-guideia="registro-guardar"]',
          visibleStatePath: 'forms.registro.visible',
          fields: {
            codigo: {
              selector: '[data-guideia="registro-codigo-input"]',
              aliases: ['codigo', 'cod', 'clave']
            },
            nombre: {
              selector: '[data-guideia="registro-nombre-input"]',
              required: true,
              aliases: ['nombre', 'titulo']
            },
            resumen: {
              selector: '[data-guideia="registro-resumen-input"]',
              required: true,
              aliases: ['resumen', 'descripcion', 'objetivo']
            },
            estado: {
              selector: '[data-guideia="registro-estado-select"]',
              required: true,
              aliases: ['estado'],
              defaultValue: 'Activo',
              options: ['Activo', 'Pendiente', 'Inactivo']
            },
            prioridad: {
              selector: '[data-guideia="registro-prioridad-select"]',
              required: true,
              aliases: ['prioridad'],
              defaultValue: 'Media',
              options: ['Alta', 'Media', 'Baja']
            },
            canal: {
              selector: '[data-guideia="registro-canal-select"]',
              aliases: ['canal'],
              defaultValue: 'Web',
              options: ['Web', 'API', 'Batch']
            },
            origen: {
              selector: '[data-guideia="registro-origen-select"]',
              aliases: ['origen'],
              defaultValue: 'Manual',
              options: ['Manual', 'Integracion', 'Migracion']
            },
            sla: {
              selector: '[data-guideia="registro-sla-select"]',
              aliases: ['sla', 'ventana'],
              defaultValue: '48h',
              options: ['24h', '48h', '72h']
            },
            fechaLimite: {
              selector: '[data-guideia="registro-fecha-input"]',
              aliases: ['fecha limite', 'fecha', 'deadline']
            },
            propietario: {
              selector: '[data-guideia="registro-propietario-input"]',
              required: true,
              aliases: ['propietario', 'responsable', 'owner'],
              defaultValue: 'Equipo Web'
            },
            etiquetas: {
              selector: '[data-guideia="registro-etiquetas-input"]',
              aliases: ['etiquetas', 'tags'],
              defaultValue: 'operativa, guiada'
            }
          }
        }
      }
    },
    usuarios: {
      route: '/usuarios',
      menuSelector: '[data-guideia="menu-usuarios"]',
      pageSelector: '[data-guideia="usuarios-page"]',
      aliases: ['usuarios', 'usuario', 'directorio', 'permisos', 'invitaciones'],
      forms: {
        create: {
          rootSelector: '[data-guideia="form-usuario"]',
          submitSelector: '[data-guideia="usuario-guardar"]',
          visibleStatePath: 'forms.user.visible',
          fields: {
            nombre: {
              selector: '[data-guideia="usuario-nombre-input"]',
              required: true,
              aliases: ['nombre']
            },
            email: {
              selector: '[data-guideia="usuario-email-input"]',
              required: true,
              aliases: ['email', 'correo']
            },
            rol: {
              selector: '[data-guideia="usuario-rol-select"]',
              required: true,
              aliases: ['rol'],
              defaultValue: 'Editor',
              options: ['Admin', 'Editor', 'Viewer']
            },
            estado: {
              selector: '[data-guideia="usuario-estado-select"]',
              required: true,
              aliases: ['estado'],
              defaultValue: 'Online',
              options: ['Online', 'Ausente', 'Bloqueado']
            },
            equipo: {
              selector: '[data-guideia="usuario-equipo-select"]',
              aliases: ['equipo', 'team'],
              defaultValue: 'Operaciones',
              options: ['Operaciones', 'Finanzas', 'Legal', 'Producto']
            },
            zona: {
              selector: '[data-guideia="usuario-zona-select"]',
              aliases: ['zona', 'region'],
              defaultValue: 'EMEA',
              options: ['EMEA', 'LATAM', 'NA']
            },
            canal: {
              selector: '[data-guideia="usuario-canal-select"]',
              aliases: ['canal', 'preferencia'],
              defaultValue: 'Email',
              options: ['Email', 'Slack', 'Teams']
            },
            mfa: {
              selector: '[data-guideia="usuario-mfa-toggle"]',
              aliases: ['mfa', 'doble factor', '2fa'],
              defaultValue: 'false'
            }
          }
        },
        invite: {
          rootSelector: '[data-guideia="usuario-invitacion-form"]',
          submitSelector: '[data-guideia="usuario-invitacion-guardar"]',
          visibleStatePath: 'workspaces.usuarios.invitacionFormVisible',
          fields: {
            nombre: {
              selector: '[data-guideia="usuario-invitacion-nombre-input"]',
              required: true,
              aliases: ['nombre']
            },
            email: {
              selector: '[data-guideia="usuario-invitacion-email-input"]',
              required: true,
              aliases: ['email', 'correo']
            },
            rol: {
              selector: '[data-guideia="usuario-invitacion-rol-select"]',
              aliases: ['rol'],
              defaultValue: 'Viewer',
              options: ['Admin', 'Editor', 'Viewer']
            },
            equipo: {
              selector: '[data-guideia="usuario-invitacion-equipo-select"]',
              aliases: ['equipo'],
              defaultValue: 'Producto',
              options: ['Operaciones', 'Finanzas', 'Legal', 'Producto']
            }
          }
        }
      }
    },
    reportes: {
      route: '/reportes',
      menuSelector: '[data-guideia="menu-reportes"]',
      pageSelector: '[data-guideia="reportes-page"]',
      aliases: ['reportes', 'reporte', 'radar', 'pipeline', 'owners']
    },
    ajustes: {
      route: '/ajustes',
      menuSelector: '[data-guideia="menu-ajustes"]',
      pageSelector: '[data-guideia="servicios-feature"]',
      aliases: ['ajustes', 'configuracion', 'integraciones', 'servicios', 'politicas', 'auditoria'],
      forms: {
        integration: {
          rootSelector: '[data-guideia="integracion-form"]',
          submitSelector: '[data-guideia="integracion-guardar"]',
          visibleStatePath: 'workspaces.ajustes.integrationFormVisible',
          fields: {
            nombre: {
              selector: '[data-guideia="integracion-nombre-input"]',
              required: true,
              aliases: ['nombre', 'integracion', 'conector']
            },
            tipo: {
              selector: '[data-guideia="integracion-tipo-select"]',
              aliases: ['tipo'],
              defaultValue: 'REST',
              options: ['REST', 'Webhook', 'SFTP', 'LLM']
            },
            estado: {
              selector: '[data-guideia="integracion-estado-select"]',
              aliases: ['estado'],
              defaultValue: 'Activa',
              options: ['Activa', 'Pausada', 'Error']
            },
            endpoint: {
              selector: '[data-guideia="integracion-endpoint-input"]',
              required: true,
              aliases: ['endpoint', 'url', 'dsn']
            },
            rateLimit: {
              selector: '[data-guideia="integracion-rate-limit-input"]',
              aliases: ['rate limit', 'limite', 'rpm'],
              defaultValue: '60'
            },
            propietario: {
              selector: '[data-guideia="integracion-propietario-input"]',
              aliases: ['propietario', 'owner'],
              defaultValue: 'Plataforma'
            }
          }
        },
        audit: {
          rootSelector: '[data-guideia="auditoria-form"]',
          submitSelector: '[data-guideia="auditoria-guardar"]',
          visibleStatePath: 'workspaces.ajustes.auditVisible',
          fields: {
            actor: {
              selector: '[data-guideia="auditoria-actor-input"]',
              aliases: ['actor']
            },
            modulo: {
              selector: '[data-guideia="auditoria-modulo-input"]',
              aliases: ['modulo']
            },
            severidad: {
              selector: '[data-guideia="auditoria-severidad-select"]',
              aliases: ['severidad'],
              defaultValue: 'Info',
              options: ['Info', 'Warning', 'Critical']
            },
            accion: {
              selector: '[data-guideia="auditoria-accion-input"]',
              aliases: ['accion', 'evento', 'mensaje']
            }
          }
        }
      }
    }
  },
  entities: {
    registro: {
      module: 'registros',
      aliases: ['registro', 'registros'],
      createForm: 'create',
      fields: {
        codigo: { aliases: ['codigo', 'cod', 'clave'] },
        nombre: { aliases: ['nombre', 'titulo'] },
        resumen: { aliases: ['resumen', 'descripcion', 'objetivo'] },
        estado: { aliases: ['estado'] },
        prioridad: { aliases: ['prioridad'] },
        canal: { aliases: ['canal'] },
        origen: { aliases: ['origen'] },
        sla: { aliases: ['sla', 'ventana'] },
        fechaLimite: { aliases: ['fecha limite', 'fecha', 'deadline'] },
        propietario: { aliases: ['propietario', 'responsable', 'owner'] },
        etiquetas: { aliases: ['etiquetas', 'tags'] }
      }
    },
    usuario: {
      module: 'usuarios',
      aliases: ['usuario', 'usuarios'],
      createForm: 'create',
      fields: {
        nombre: { aliases: ['nombre'] },
        email: { aliases: ['email', 'correo'] },
        rol: { aliases: ['rol'] },
        estado: { aliases: ['estado'] },
        equipo: { aliases: ['equipo', 'team'] },
        zona: { aliases: ['zona', 'region'] },
        canal: { aliases: ['canal', 'preferencia'] },
        mfa: { aliases: ['mfa', 'doble factor', '2fa'] }
      }
    },
    invitacionUsuario: {
      module: 'usuarios',
      aliases: ['invitacion', 'invitar usuario', 'onboarding', 'invitar'],
      createForm: 'invite',
      fields: {
        nombre: { aliases: ['nombre'] },
        email: { aliases: ['email', 'correo'] },
        rol: { aliases: ['rol'] },
        equipo: { aliases: ['equipo'] }
      }
    },
    integracion: {
      module: 'ajustes',
      aliases: ['integracion', 'integraciones', 'conector', 'endpoint'],
      createForm: 'integration',
      fields: {
        nombre: { aliases: ['nombre', 'integracion', 'conector'] },
        tipo: { aliases: ['tipo'] },
        estado: { aliases: ['estado'] },
        endpoint: { aliases: ['endpoint', 'url', 'dsn'] },
        rateLimit: { aliases: ['rate limit', 'limite', 'rpm'] },
        propietario: { aliases: ['propietario', 'owner'] }
      }
    }
  }
};
