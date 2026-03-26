import { APP_ROUTES } from '@app/routes'

// 1. Items de menú para el rol "SuperAdmin"
export const superAdminNavItems = [
  {
    label: 'Gestión de Usuarios',
    to: APP_ROUTES.superadminDashboard,
  },
  {
    label: 'Configuración Global',
    to: '/superadmin/configuracion', // despues lo agregaremos a APP_ROUTES
  }
]

// 2. Opciones para el formulario
export const roleOptions = ['Residente', 'Contabilidad', 'Conserje', 'SuperAdmin']

// 3. Estilos visuales para los roles 
export const roleStyles = {
  'SuperAdmin': 'bg-red-100 text-red-800 border border-red-200',
  'Contabilidad': 'bg-blue-100 text-blue-800 border border-blue-200',
  'Conserje': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  'Residente': 'bg-stone-100 text-stone-800 border border-stone-200',
}

// 4. Datos mock iniciales de usuarios
// despues se conectará a @entities/user/model 
export const initialMockUsers = [
  { id: 1, rut: '11.111.111-1', nombre: 'Juan Pérez', email: 'juan@correo.com', rol: 'Residente' },
  { id: 2, rut: '22.222.222-2', nombre: 'Ana Gómez', email: 'ana@correo.com', rol: 'Contabilidad' },
  { id: 3, rut: '33.333.333-3', nombre: 'Carlos Ruiz', email: 'carlos@correo.com', rol: 'Conserje' },
]