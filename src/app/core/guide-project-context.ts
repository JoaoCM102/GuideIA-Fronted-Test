import type { GuideContextChunk } from 'guideai-npm';

export function getGuideProjectContext(): GuideContextChunk[] {
  return [
    {
      source: 'project_map',
      id: 'admin-suite-overview',
      content:
        'GuideIA Admin es una demo de backoffice avanzada con workspaces densos. Cada modulo mezcla tablas, paneles laterales, tabs internas, metricas y formularios. La guia debe priorizar siempre selectores data-guideia y estado semantico de uiState antes que inferencias genericas del DOM.'
    },
    {
      source: 'docs',
      id: 'dashboard-flow',
      content:
        'El dashboard vive en /dashboard y no es solo una portada. Tiene un grid de accesos rapidos en dashboard-command-grid con atajos directos dashboard-open-registros, dashboard-open-usuarios, dashboard-open-reportes y dashboard-open-ajustes. Tambien muestra paneles operativos dashboard-approvals, dashboard-incidents, dashboard-team-load y dashboard-radar-reportes.'
    },
    {
      source: 'docs',
      id: 'registros-flow',
      content:
        'El modulo /registros es un workspace de tres columnas con tabs internas. La pestaña activa sale en uiState.workspaces.registros.activeView y se cambia con registros-tab-operativos, registros-tab-backlog o registros-tab-archivados. El formulario principal usa form-registro y ya no es simple: incluye registro-codigo-input, registro-nombre-input, registro-resumen-input, registro-estado-select, registro-prioridad-select, registro-canal-select, registro-origen-select, registro-sla-select, registro-fecha-input, registro-propietario-input y registro-etiquetas-input. El guardado se hace con registro-guardar. La tabla vive en tabla-registros y el panel derecho en registro-inspector.'
    },
    {
      source: 'docs',
      id: 'usuarios-flow',
      content:
        'El modulo /usuarios es un workspace mixto con tres vistas internas: Directorio, Permisos e Invitaciones. La vista activa sale en uiState.workspaces.usuarios.activeView y se cambia con usuarios-tab-directorio, usuarios-tab-permisos y usuarios-tab-invitaciones. El alta principal usa form-usuario con usuario-nombre-input, usuario-email-input, usuario-rol-select, usuario-estado-select, usuario-equipo-select, usuario-zona-select, usuario-canal-select, usuario-mfa-toggle y usuario-guardar. El panel lateral es usuarios-side-panel. La subvista de invitaciones contiene usuario-invitacion-form con usuario-invitacion-nombre-input, usuario-invitacion-email-input, usuario-invitacion-rol-select, usuario-invitacion-equipo-select y usuario-invitacion-guardar.'
    },
    {
      source: 'docs',
      id: 'reportes-flow',
      content:
        'El modulo /reportes tambien tiene vistas internas, no solo una tabla fija. El board activo sale en uiState.workspaces.reportes.activeBoard y se cambia con reportes-tab-radar, reportes-tab-pipeline y reportes-tab-owners. Los filtros son reportes-tipo-select, reportes-estado-select y reportes-riesgo-select. Los paneles principales son reportes-radar-panel y reportes-side-panel.'
    },
    {
      source: 'docs',
      id: 'ajustes-flow',
      content:
        'El modulo /ajustes ahora es un workspace completo con tres vistas internas: Integraciones, Politicas y Auditoria. La vista activa sale en uiState.workspaces.ajustes.activeView y se cambia con ajustes-tab-integraciones, ajustes-tab-politicas y ajustes-tab-auditoria. La configuracion base usa ajustes-config-form con ajustes-endpoint-input, ajustes-modelo-input, ajustes-contexto-input, ajustes-retries-input, ajustes-streaming-toggle, ajustes-modo-guiado-toggle y ajustes-guardar. La alta de conectores usa integracion-form con integracion-nombre-input, integracion-tipo-select, integracion-estado-select, integracion-endpoint-input, integracion-rate-limit-input, integracion-propietario-input e integracion-guardar. La auditoria manual usa auditoria-form y la tabla vive en tabla-auditoria.'
    },
    {
      source: 'docs',
      id: 'navigation-rules',
      content:
        'Regla de navegacion: los cambios de modulo principales se hacen con menu-dashboard, menu-registros, menu-usuarios, menu-reportes y menu-ajustes. Si uiState.sidebar.open es false, primero debe abrirse menu-hamburguesa. Si el modulo destino ya esta visible, no repitas la navegacion. Si una vista interna ya coincide con la intencion del usuario, usa el tab existente y sigue desde ahi.'
    },
    {
      source: 'docs',
      id: 'behavior-rules',
      content:
        'Reglas de comportamiento: si el usuario pide crear un registro y el formulario form-registro ya esta visible, empieza directamente a rellenar. Si pide crear un usuario y form-usuario esta visible, no navegues otra vez. Si el usuario pide invitar a alguien, primero comprueba si la subvista usuarios-invitaciones-panel esta activa; si no, cambia a esa vista antes de rellenar el formulario secundario. Si el usuario pide crear una integracion, debe terminar en la vista Integraciones del modulo Ajustes y usar integracion-form. Los pasos de guardar deben validarse observando cambios visibles en la interfaz.'
    },
    {
      source: 'docs',
      id: 'defaults-and-rules',
      content:
        'Defaults demo: registros suele usar estado Activo, prioridad Media, canal Web, origen Manual y SLA 48h si el usuario dice "da igual". Usuarios suele usar rol Editor, estado Online, equipo Operaciones, zona EMEA y canal Email si el usuario no concreta. Invitaciones usa rol Viewer y equipo Producto como defaults. Integraciones usa tipo REST, estado Activa, rate limit 60 y propietario Plataforma si el usuario no concreta. La guia debe usar estos defaults solo cuando el usuario no haya dado un valor especifico.'
    },
    {
      source: 'docs',
      id: 'factual-answer-rules',
      content:
        'Para dudas factuales como totales, estados o cuantos elementos hay, la prioridad no es el DOM sino el knowledgeState estructurado que expone metricas y colecciones resumidas del store. Solo usa el DOM como respaldo si el knowledgeState no trae el dato.'
    }
  ];
}
