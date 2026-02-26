// ============================================
// RBAC Engine - Solvo Platform Prototype
// Module-Scoped Role-Based Access Control
// ============================================

// === PERMISSIONS CATALOG ===
// All available permissions organized by module
const PERMISSIONS_CATALOG = {
  empresas: [
    { code: 'ver_propias', label: 'Ver empresas propias' },
    { code: 'ver_todas', label: 'Ver todas las empresas' },
    { code: 'editar_propias', label: 'Editar empresas propias' },
    { code: 'editar_cualquiera', label: 'Editar cualquier empresa' },
    { code: 'crear', label: 'Crear empresas' },
    { code: 'asignar', label: 'Asignar empresas' }
  ],
  vacantes: [
    { code: 'ver_propias', label: 'Ver vacantes propias' },
    { code: 'ver_todas', label: 'Ver todas las vacantes' },
    { code: 'editar_propias', label: 'Editar vacantes propias' },
    { code: 'editar_cualquiera', label: 'Editar cualquier vacante' },
    { code: 'crear', label: 'Crear vacantes' },
    { code: 'asignar', label: 'Asignar vacantes' }
  ],
  dashboard: [
    { code: 'ver_kpis_propios', label: 'Ver KPIs propios' },
    { code: 'ver_kpis_equipo', label: 'Ver KPIs del equipo' }
  ],
  administracion: [
    { code: 'ver_usuarios', label: 'Ver listado de usuarios' }
  ]
};

const MODULE_LABELS = {
  empresas: 'Empresas',
  vacantes: 'Vacantes',
  dashboard: 'Dashboard',
  administracion: 'Administración'
};

// === ROLE DEFINITIONS (Initial Configuration) ===
const DEFAULT_ROLES = {
  comercial: {
    name: 'Comercial',
    description: 'Ejecutivo de ventas. Gestiona exclusivamente sus asignaciones.',
    permissions: {
      empresas: ['ver_propias', 'editar_propias', 'crear'],
      vacantes: ['ver_propias', 'editar_propias', 'crear'],
      dashboard: ['ver_kpis_propios'],
      administracion: []
    }
  },
  coordinador: {
    name: 'Coordinador',
    description: 'Coordinador de operaciones. Ve todo, asigna empresas y vacantes.',
    permissions: {
      empresas: ['ver_propias', 'ver_todas', 'editar_propias', 'editar_cualquiera', 'crear', 'asignar'],
      vacantes: ['ver_propias', 'ver_todas', 'editar_propias', 'editar_cualquiera', 'crear', 'asignar'],
      dashboard: ['ver_kpis_propios', 'ver_kpis_equipo'],
      administracion: []
    }
  },
  administrador: {
    name: 'Administrador',
    description: 'Director/gerente. Lectura/edición total + visualización de usuarios.',
    permissions: {
      empresas: ['ver_propias', 'ver_todas', 'editar_propias', 'editar_cualquiera', 'crear'],
      vacantes: ['ver_propias', 'ver_todas', 'editar_propias', 'editar_cualquiera', 'crear'],
      dashboard: ['ver_kpis_propios', 'ver_kpis_equipo'],
      administracion: ['ver_usuarios']
    }
  }
};

// === MOCK TEAM DATA ===
const TEAM_MEMBERS = [
  { id: 'uuid-staff-001', name: 'Carlos Mendoza', shortName: 'Carlos M.', email: 'carlos.mendoza@solvo.global', roleKey: 'comercial', title: 'Senior Account Executive', department: 'Sales', isActive: true, companiesCount: 47, vacanciesCount: 1234 },
  { id: 'uuid-staff-002', name: 'María García', shortName: 'María G.', email: 'maria.garcia@solvo.global', roleKey: 'comercial', title: 'Account Executive', department: 'Sales', isActive: true, companiesCount: 38, vacanciesCount: 987 },
  { id: 'uuid-staff-003', name: 'Juan Pérez', shortName: 'Juan P.', email: 'juan.perez@solvo.global', roleKey: 'comercial', title: 'Account Executive', department: 'Sales', isActive: true, companiesCount: 42, vacanciesCount: 1102 },
  { id: 'uuid-staff-004', name: 'Ana Rodríguez', shortName: 'Ana R.', email: 'ana.rodriguez@solvo.global', roleKey: 'coordinador', title: 'Operations Coordinator', department: 'Operations', isActive: true, companiesCount: 0, vacanciesCount: 0 },
  { id: 'uuid-staff-005', name: 'Pedro Sánchez', shortName: 'Pedro S.', email: 'pedro.sanchez@solvo.global', roleKey: 'administrador', title: 'Sales Director', department: 'Management', isActive: true, companiesCount: 0, vacanciesCount: 0 },
  { id: 'uuid-staff-006', name: 'Laura Torres', shortName: 'Laura T.', email: 'laura.torres@solvo.global', roleKey: 'comercial', title: 'Junior Account Executive', department: 'Sales', isActive: false, companiesCount: 15, vacanciesCount: 412 }
];

// Demo users mapped to roles (for login selector)
const DEMO_USERS = {
  comercial: TEAM_MEMBERS[0],   // Carlos Mendoza
  coordinador: TEAM_MEMBERS[3], // Ana Rodríguez
  administrador: TEAM_MEMBERS[4] // Pedro Sánchez
};

// === PERMISSION FUNCTIONS ===

function getCurrentUser() {
  const data = localStorage.getItem('user');
  return data ? JSON.parse(data) : null;
}

function getCurrentRole() {
  const user = getCurrentUser();
  return user ? user.role : null;
}

function getRoles() {
  const stored = localStorage.getItem('roles');
  return stored ? JSON.parse(stored) : DEFAULT_ROLES;
}

function getUserPermissions() {
  const user = getCurrentUser();
  if (!user) return {};
  const roles = getRoles();
  const roleData = roles[user.role];
  return roleData ? roleData.permissions : {};
}

function hasPermission(module, permission) {
  const perms = getUserPermissions();
  return perms[module] && perms[module].includes(permission);
}

function canViewAll(module) {
  return hasPermission(module, 'ver_todas');
}

function canAssign(module) {
  return hasPermission(module, 'asignar');
}

function canAccessAdmin() {
  const perms = getUserPermissions();
  return perms.administracion && perms.administracion.length > 0;
}

function getActiveCommercials() {
  return TEAM_MEMBERS.filter(m => m.roleKey === 'comercial' && m.isActive);
}

// === SESSION MANAGEMENT ===

function initSession() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// === SIDEBAR RENDERING ===

function renderSidebar(activePage) {
  const user = getCurrentUser();
  if (!user) return;

  const roles = getRoles();
  const roleData = roles[user.role];
  const roleName = roleData ? roleData.name : user.role;
  const initials = user.name.split(' ').map(n => n[0]).join('');

  const showAdmin = canAccessAdmin();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: '<rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect>' },
    { id: 'vacancies', label: 'Vacancies', href: 'vacancies.html', icon: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect>' },
    { id: 'companies', label: 'Companies', href: 'companies.html', icon: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path>' }
  ];

  const adminItems = [
    { id: 'admin-users', label: 'Usuarios', href: 'admin-users.html', icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>' }
  ];

  function renderNavItem(item) {
    const isActive = activePage === item.id ? ' active' : '';
    return `<a href="${item.href}" class="nav-item${isActive}">
      <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
      <span>${item.label}</span>
    </a>`;
  }

  let adminSection = '';
  if (showAdmin) {
    adminSection = `
      <div class="nav-section">
        <span class="nav-section-title">Administración</span>
        ${adminItems.map(renderNavItem).join('')}
      </div>`;
  }

  const sidebarHTML = `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <div class="logo-icon">S</div>
          <span class="logo-text">Solvo Platform</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section">
          ${navItems.map(renderNavItem).join('')}
        </div>
        ${adminSection}
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="user-avatar">${initials}</div>
          <div class="user-info">
            <span class="user-name">${user.name}</span>
            <span class="badge badge-role badge-role-${user.role}">${roleName}</span>
          </div>
        </div>
        <button class="btn-logout" onclick="logout()" title="Sign out">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" x2="9" y1="12" y2="12"></line>
          </svg>
        </button>
      </div>
    </aside>`;

  const container = document.getElementById('sidebar-container');
  if (container) {
    container.innerHTML = sidebarHTML;
  }
}

// === SIDEBAR MOBILE TOGGLE ===

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('show');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
}

// Close sidebar on ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeSidebar();
});

// === TOAST NOTIFICATIONS ===

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" x2="9" y1="9" y2="15"></line><line x1="9" x2="15" y1="9" y2="15"></line></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg>'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span class="toast-message">${message}</span>`;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// === ACCESS GUARD ===

function requireAdmin() {
  if (!canAccessAdmin()) {
    window.location.href = 'access-denied.html';
    return false;
  }
  return true;
}
