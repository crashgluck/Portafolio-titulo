import { useId } from 'react'

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

  return (
    <div className="flex flex-col w-full mb-4">
      {label && (
        <label htmlFor={safeId} className="mb-1.5 text-sm font-semibold text-stone-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500" title="Campo obligatorio">*</span>}
        </label>
      )}

      <input
        id={safeId}
        type={type}
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
        `}
      />

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
