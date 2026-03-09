// ============================================
// RBAC Engine - Solvo Platform Prototype
// Role-Based Access Control (el rol es el permiso)
// ============================================

// === ROLE DEFINITIONS ===
// No existe tabla de permisos — el rol define directamente el acceso
const ROLES = {
  comercial: {
    name: 'Comercial',
    description: 'Ejecutivo de ventas. Ve y gestiona exclusivamente sus asignaciones.'
  },
  coordinador: {
    name: 'Coordinador',
    description: 'Coordinador de operaciones. Ve todos los registros, asigna empresas y vacantes a comerciales.'
  },
  administrador: {
    name: 'Administrador',
    description: 'Director/gerente. Acceso completo de lectura/edición + visualización de usuarios.'
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

// === ROLE-BASED ACCESS FUNCTIONS ===

function getCurrentUser() {
  const data = localStorage.getItem('user');
  return data ? JSON.parse(data) : null;
}

function getCurrentRole() {
  const user = getCurrentUser();
  return user ? user.role : null;
}

function getRoleName() {
  const role = getCurrentRole();
  return role && ROLES[role] ? ROLES[role].name : '';
}

// Can see all records (empresas/vacantes) — coordinador and admin
function canViewAll() {
  const role = getCurrentRole();
  return role === 'coordinador' || role === 'administrador';
}

// Can assign empresas/vacantes to comerciales — only coordinador
function canAssign() {
  const role = getCurrentRole();
  return role === 'coordinador';
}

// Can access admin section (/admin/*) — only admin
function canAccessAdmin() {
  const role = getCurrentRole();
  return role === 'administrador';
}

// Can see team KPIs — coordinador and admin
function canViewTeamKPIs() {
  const role = getCurrentRole();
  return role === 'coordinador' || role === 'administrador';
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

  const roleName = getRoleName();
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
    window.location.href = 'access-denied.html?type=section';
    return false;
  }
  return true;
}

// === COMMERCIAL SEARCHBOX COMPONENT ===
// Reusable searchbox for selecting comerciales (used in assignment UIs)

function renderCommercialSearchbox(containerId, options = {}) {
  const {
    onSelect = () => {},
    currentValue = null,
    placeholder = 'Buscar comercial...',
    showUnassigned = true
  } = options;

  const container = document.getElementById(containerId);
  if (!container) return;

  const commercials = getActiveCommercials();
  let isOpen = false;
  let selectedId = currentValue;

  const currentCommercial = currentValue ? commercials.find(c => c.id === currentValue) : null;

  container.innerHTML = `
    <div class="searchbox-commercial" style="position: relative;">
      <input type="text" class="form-input searchbox-input" id="${containerId}-input"
        placeholder="${placeholder}"
        value="${currentCommercial ? currentCommercial.name : ''}"
        autocomplete="off" />
      <div class="searchbox-results" id="${containerId}-results" style="display: none; position: absolute; top: 100%; left: 0; right: 0; z-index: 100; max-height: 240px; overflow-y: auto; background: var(--bg-primary, #1a1a1a); border: 1px solid var(--border-primary, #333); border-radius: 6px; margin-top: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
      </div>
    </div>`;

  const input = document.getElementById(`${containerId}-input`);
  const resultsEl = document.getElementById(`${containerId}-results`);

  function renderResults(filter = '') {
    const query = filter.toLowerCase().trim();
    let filtered = commercials;
    if (query) {
      filtered = commercials.filter(c =>
        c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query)
      );
    }

    let html = '';

    if (showUnassigned) {
      html += `<div class="searchbox-item" data-id="" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid var(--border-primary, #333); color: var(--text-tertiary, #888); font-style: italic;">
        Sin asignar
      </div>`;
    }

    if (filtered.length === 0 && query) {
      html += `<div style="padding: 8px 12px; color: var(--text-tertiary, #888); font-size: 13px;">No se encontraron comerciales</div>`;
    } else {
      filtered.forEach(c => {
        const isSelected = c.id === selectedId;
        html += `<div class="searchbox-item${isSelected ? ' searchbox-item-selected' : ''}" data-id="${c.id}" style="padding: 8px 12px; cursor: pointer;">
          <div style="font-size: 14px; color: var(--text-primary, #fff);">${c.name}</div>
          <div style="font-size: 12px; color: var(--text-tertiary, #888);">${c.email}</div>
        </div>`;
      });
    }

    resultsEl.innerHTML = html;

    // Hover styles
    resultsEl.querySelectorAll('.searchbox-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.background = 'var(--bg-tertiary, #2a2a2a)';
      });
      item.addEventListener('mouseleave', () => {
        item.style.background = '';
      });
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        if (id === '') {
          // Sin asignar
          selectedId = null;
          input.value = '';
          onSelect(null, null);
        } else {
          const selected = commercials.find(c => c.id === id);
          if (selected) {
            selectedId = selected.id;
            input.value = selected.name;
            onSelect(selected.id, selected);
          }
        }
        closeResults();
      });
    });
  }

  function openResults() {
    isOpen = true;
    resultsEl.style.display = 'block';
    renderResults(input.value);
  }

  function closeResults() {
    isOpen = false;
    resultsEl.style.display = 'none';
  }

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (!isOpen) openResults();
      renderResults(input.value);
    }, 300);
  });

  input.addEventListener('focus', () => {
    openResults();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      closeResults();
    }
  });

  return {
    getValue: () => selectedId,
    setValue: (id) => {
      selectedId = id;
      const c = commercials.find(c => c.id === id);
      input.value = c ? c.name : '';
    },
    clear: () => {
      selectedId = null;
      input.value = '';
    }
  };
}

// Searchbox for filter bar (includes "Todos" option)
function renderCommercialFilterSearchbox(containerId, options = {}) {
  const {
    onSelect = () => {},
    placeholder = 'Filtrar por comercial...'
  } = options;

  const container = document.getElementById(containerId);
  if (!container) return;

  const commercials = getActiveCommercials();
  let isOpen = false;
  let selectedId = 'all'; // 'all' = Todos, 'unassigned' = Sin asignar, or a UUID

  container.innerHTML = `
    <div class="searchbox-commercial" style="position: relative;">
      <input type="text" class="form-input searchbox-input" id="${containerId}-input"
        placeholder="${placeholder}"
        value="Todos"
        autocomplete="off" />
      <div class="searchbox-results" id="${containerId}-results" style="display: none; position: absolute; top: 100%; left: 0; right: 0; z-index: 100; max-height: 240px; overflow-y: auto; background: var(--bg-primary, #1a1a1a); border: 1px solid var(--border-primary, #333); border-radius: 6px; margin-top: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
      </div>
    </div>`;

  const input = document.getElementById(`${containerId}-input`);
  const resultsEl = document.getElementById(`${containerId}-results`);

  function renderResults(filter = '') {
    const query = filter.toLowerCase().trim();
    // Don't filter when showing "Todos" text
    const isDefaultText = filter === 'Todos';
    let filtered = commercials;
    if (query && !isDefaultText) {
      filtered = commercials.filter(c =>
        c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query)
      );
    }

    let html = '';

    // "Todos" always visible at top
    html += `<div class="searchbox-item${selectedId === 'all' ? ' searchbox-item-selected' : ''}" data-id="all" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid var(--border-primary, #333); font-weight: 500;">
      Todos
    </div>`;

    // "Sin asignar" always visible
    html += `<div class="searchbox-item${selectedId === 'unassigned' ? ' searchbox-item-selected' : ''}" data-id="unassigned" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid var(--border-primary, #333); color: var(--text-tertiary, #888); font-style: italic;">
      Sin asignar
    </div>`;

    if (filtered.length === 0 && query && !isDefaultText) {
      html += `<div style="padding: 8px 12px; color: var(--text-tertiary, #888); font-size: 13px;">No se encontraron comerciales</div>`;
    } else {
      filtered.forEach(c => {
        const isSelected = c.id === selectedId;
        html += `<div class="searchbox-item${isSelected ? ' searchbox-item-selected' : ''}" data-id="${c.id}" style="padding: 8px 12px; cursor: pointer;">
          <div style="font-size: 14px; color: var(--text-primary, #fff);">${c.name}</div>
          <div style="font-size: 12px; color: var(--text-tertiary, #888);">${c.email}</div>
        </div>`;
      });
    }

    resultsEl.innerHTML = html;

    resultsEl.querySelectorAll('.searchbox-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.background = 'var(--bg-tertiary, #2a2a2a)';
      });
      item.addEventListener('mouseleave', () => {
        item.style.background = '';
      });
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        selectedId = id;
        if (id === 'all') {
          input.value = 'Todos';
          onSelect('all', null);
        } else if (id === 'unassigned') {
          input.value = 'Sin asignar';
          onSelect('unassigned', null);
        } else {
          const selected = commercials.find(c => c.id === id);
          if (selected) {
            input.value = selected.name;
            onSelect(selected.id, selected);
          }
        }
        closeResults();
      });
    });
  }

  function openResults() {
    isOpen = true;
    resultsEl.style.display = 'block';
    renderResults(input.value);
  }

  function closeResults() {
    isOpen = false;
    resultsEl.style.display = 'none';
  }

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (!isOpen) openResults();
      renderResults(input.value);
    }, 300);
  });

  input.addEventListener('focus', () => {
    input.select();
    openResults();
  });

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      closeResults();
    }
  });

  return {
    getValue: () => selectedId,
    reset: () => {
      selectedId = 'all';
      input.value = 'Todos';
    }
  };
}
