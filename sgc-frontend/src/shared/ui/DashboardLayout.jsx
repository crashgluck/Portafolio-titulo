import { useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '@features/auth/hooks/useAuth'
import backgroundImage from '../../assets/condominio.jpg'

const DashboardLayout = ({ children, userRole, userName, title, navItems = [] }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const safeUserName = userName?.trim() || 'Usuario SGC'
  const safeRole = userRole?.trim() || 'Perfil'
  const safeTitle = title?.trim() || `Portal ${safeRole}`

  // LOGOUT
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const normalizedNavItems = useMemo(() => {
    if (!Array.isArray(navItems) || navItems.length === 0) {
      return [{ label: 'Panel principal', to: '/' }]
    }
    return navItems
  }, [navItems])

  return (
    <div className="relative flex h-screen w-screen overflow-hidden text-stone-900">
      {/* Fondo visual global */}
      <div className="absolute inset-0">
        <img src={backgroundImage} alt="Fondo condominio" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950/40 via-stone-950/20 to-amber-950/35" />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col backdrop-blur-[1px]">
        {/* Header superior */}
        <header className="h-[70px] bg-stone-50/95 border-b border-stone-200 flex justify-between items-center px-4 md:px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="p-2 rounded-md hover:bg-stone-200 text-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="m-0 text-xl md:text-2xl font-black text-stone-900 tracking-[0.2em] hidden sm:block select-none">SGC</h1>
          </div>

          <nav className="flex items-center gap-4 md:gap-6 shrink-0">
            <div className="hidden lg:flex items-center gap-5 border-l border-stone-200 pl-6 text-xs font-medium text-stone-600">
              <div className="flex flex-col">
                <span className="text-stone-500 text-[10px] uppercase tracking-wider font-bold">Valor UF</span>
                <span className="text-stone-800 font-extrabold">$38.500,20</span>
              </div>
              <div className="flex flex-col">
                <span className="text-stone-500 text-[10px] uppercase tracking-wider font-bold">Valor UTM</span>
                <span className="text-stone-800 font-extrabold">$64.793</span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-l border-stone-200 pl-4 md:pl-6">
              <span className="text-sm text-stone-700 font-semibold hidden sm:block max-w-[200px] truncate" title={safeUserName}>
                {safeUserName}
              </span>
              <div className="w-10 h-10 bg-amber-700 rounded-full border-2 border-stone-100 flex items-center justify-center text-amber-50 font-bold shrink-0">
                {safeUserName.charAt(0).toUpperCase()}
              </div>
            </div>
          </nav>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Sidebar lateral */}
          <aside
            className={`bg-stone-900/95 border-r border-stone-700/50 flex flex-col transition-all duration-300 ease-in-out shadow-xl z-20 overflow-hidden shrink-0 ${
              isSidebarOpen ? 'w-64 absolute sm:relative h-full' : 'w-0 sm:w-20'
            }`}
          >
            <nav className="flex-1 py-6 overflow-y-auto overflow-x-hidden">
              <ul className="list-none p-0 m-0 text-stone-300 space-y-2 px-2">
                {normalizedNavItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                          isActive ? 'bg-amber-600 text-amber-50 shadow-sm' : 'hover:bg-stone-700/70 text-stone-300'
                        }`
                      }
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-current opacity-70 shrink-0" />
                      {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* --- ZONA INFERIOR DEL SIDEBAR: BOTÓN SALIR --- */}
            <div className="p-4 border-t border-stone-700/50 shrink-0 mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-500/10 text-stone-400 hover:text-red-400 transition-colors focus:outline-none group"
                title="Cerrar sesión"
              >
                <svg className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {isSidebarOpen && <span className="font-medium whitespace-nowrap">Cerrar Sesión</span>}
              </button>
            </div>
          </aside>

          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black/30 z-10 sm:hidden" onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />
          )}

          <div className="flex-1 flex flex-col overflow-y-auto relative bg-stone-50/90 backdrop-blur-sm">
            <div className="px-4 md:px-8 py-4 md:py-5 border-b border-stone-200 shrink-0 sticky top-0 z-10 bg-stone-50/95">
              <h2 className="m-0 text-stone-900 font-bold text-lg md:text-xl uppercase tracking-wide truncate">{safeTitle}</h2>
            </div>
            <main className="p-4 md:p-8 flex-1">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout