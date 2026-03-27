import { useId, useState } from 'react'

const FormInput = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  disabled = false,
  required = false,
}) => {
  const generatedId = useId()
  const safeLabel = label?.replace(/\s+/g, '-').toLowerCase()
  const safeId = id || `input-${safeLabel || generatedId}`

  // --- NUEVO: ESTADO Y LÓGICA PARA EL OJITO ---
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordType = type === 'password'
  
  // Si es contraseña y el usuario hizo clic al ojito, cambiamos a 'text'. Si no, respetamos el type original.
  const currentType = isPasswordType && showPassword ? 'text' : type

  return (
    <div className="flex flex-col w-full mb-4">
      {label && (
        <label htmlFor={safeId} className="mb-1.5 text-sm font-semibold text-stone-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500" title="Campo obligatorio">*</span>}
        </label>
      )}

      {/* Envolvemos el input en un div relativo para poder posicionar el ojito */}
      <div className="relative w-full">
        <input
          id={safeId}
          type={currentType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-2.5 rounded-lg border bg-stone-50 text-stone-900 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-amber-500/30 placeholder:text-stone-400
            disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed
            ${error ? 'border-red-400 focus:border-red-500' : 'border-stone-200 hover:border-amber-600 focus:border-amber-600'}
            ${isPasswordType ? 'pr-11' : ''} 
          `}
        />

        {/* Solo dibujamos el botón si este input es específicamente de tipo contraseña */}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )}
          </button>
        )}
      </div>

      {error && (
        <span className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </span>
      )}
    </div>
  )
}

export default FormInput