const ProfileCard = ({ name, role, extraInfo, status = 'Al dia', balance = '$0' }) => {
  const safeName = name?.trim() || 'Usuario sin registrar'
  const initial = safeName.charAt(0).toUpperCase()

  return (
    <div className="bg-stone-50 rounded-xl shadow-sm border border-stone-200 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:shadow-md">
      <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-stone-100 text-stone-700 border-2 border-amber-600 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold shrink-0 shadow-inner">
          {initial}
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 m-0 leading-tight truncate" title={safeName}>
            {safeName}
          </h2>
          <span className="text-amber-700 font-semibold text-xs sm:text-sm mt-1 uppercase tracking-wide truncate">
            {role || 'Rol no asignado'}
          </span>

          {extraInfo?.trim() && (
            <span className="text-stone-600 text-sm mt-2 flex items-center gap-1.5 font-medium">
              <span className="w-4 h-4 rounded-sm bg-amber-100 border border-amber-600 shrink-0" />
              <span className="truncate" title={extraInfo}>
                {extraInfo}
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="w-full md:w-auto flex flex-row md:flex-col gap-4 md:gap-2 justify-between md:justify-center md:text-right border-t md:border-t-0 md:border-l border-stone-200 pt-4 md:pt-0 md:pl-8">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Estado</span>
          <span
            className={`text-sm font-bold flex items-center md:justify-end gap-1.5 ${
              status === 'Al dia' ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${status === 'Al dia' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
            {status}
          </span>
        </div>

        <div className="flex flex-col mt-0 md:mt-2">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Saldo adeudado</span>
          <span className="text-xl md:text-2xl font-extrabold text-stone-900 leading-none mt-1">{balance}</span>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
