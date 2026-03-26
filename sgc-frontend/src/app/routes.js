// Rutas centralizadas para evitar strings duplicados en toda la app.
export const APP_ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  unauthorized: '/unauthorized',

  //Residente
  residentDashboard: '/resident/dashboard',
  residentPayments: '/resident/pagos',
  residentProfile: '/resident/perfil',

  //SuperAdmin
  superadminDashboard: '/superadmin/dashboard',
}
