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
  adminPayments: '/admin/pagos',
  adminStatement: '/admin/estado-cuenta',
  adminMonthClose: '/admin/cierre-mes',
  conserjeDashboard: '/conserje/dashboard',
  superadminDashboard: '/superadmin/dashboard',
  superadminReservations: '/superadmin/reservas',

  
}
