// Rutas centralizadas para evitar strings duplicados en toda la app.
export const APP_ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  unauthorized: '/unauthorized',

  residentDashboard: '/resident/dashboard',
  residentPayments: '/resident/pagos',
  residentProfile: '/resident/perfil',

  adminDashboard: '/admin/dashboard',
  conserjeDashboard: '/conserje/dashboard',
  superadminDashboard: '/superadmin/dashboard',
}
