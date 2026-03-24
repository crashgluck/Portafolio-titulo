const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-stone-200 shadow-md rounded-xl p-8 text-center">
        <h1 className="text-2xl font-extrabold text-stone-900">Acceso no autorizado</h1>
        <p className="text-stone-600 mt-3">Tu perfil no tiene permisos para acceder a este modulo.</p>
      </div>
    </div>
  )
}

export default UnauthorizedPage
