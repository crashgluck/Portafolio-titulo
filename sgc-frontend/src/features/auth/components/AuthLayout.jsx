import logo from '../../../assets/logo_app_portafolio.png';

const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-amber-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-lg p-8">
        <header className="mb-6 text-center">
          <div>
      <img src={logo} alt="Logo" />
    </div>
          <h1 className="text-2xl font-extrabold text-stone-900">{title}</h1>
          {subtitle && <p className="text-sm text-stone-600 mt-2">{subtitle}</p>}
        </header>

        {children}

        {footer && <footer className="mt-6 text-sm text-center text-stone-600">{footer}</footer>}
      </div>
    </div>
  )
}

export default AuthLayout
