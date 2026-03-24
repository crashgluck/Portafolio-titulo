import { useRef, useState } from 'react'

const FileUploader = ({
  label = 'Subir comprobante',
  accept = '.pdf, image/jpeg, image/png',
  maxSizeMB = 5,
  onFileSelect,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const validateAndProcessFile = (file) => {
    setError('')

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`El archivo es muy pesado. Maximo permitido: ${maxSizeMB}MB.`)
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    onFileSelect?.(file)
  }

  const removeFile = (event) => {
    event.stopPropagation()
    setSelectedFile(null)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    onFileSelect?.(null)
  }

  return (
    <div className="flex flex-col w-full mb-4">
      {label && <span className="mb-2 text-sm font-semibold text-stone-700">{label}</span>}

      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setIsDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          if (disabled) return
          const [file] = event.dataTransfer.files
          if (file) validateAndProcessFile(file)
        }}
        className={`
          relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all duration-200 text-center
          ${disabled ? 'bg-stone-100 border-stone-300 cursor-not-allowed opacity-70' : 'cursor-pointer'}
          ${isDragging ? 'bg-amber-100/40 border-amber-600' : 'bg-stone-50 hover:bg-stone-100'}
          ${!isDragging && !disabled && !selectedFile ? 'border-stone-200 hover:border-amber-600' : ''}
          ${selectedFile ? 'border-emerald-400 bg-emerald-50/70' : ''}
          ${error ? 'border-red-400 bg-red-50/60' : ''}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(event) => {
            const [file] = event.target.files
            if (file) validateAndProcessFile(file)
          }}
          accept={accept}
          disabled={disabled}
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 mb-3 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-bold text-stone-900 max-w-[220px] truncate" title={selectedFile.name}>
              {selectedFile.name}
            </p>
            <p className="text-xs text-stone-600 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            {!disabled && (
              <button
                type="button"
                onClick={removeFile}
                className="mt-3 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors px-3 py-1 bg-red-50 rounded-md"
              >
                Quitar archivo
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg className={`w-10 h-10 mb-3 ${isDragging ? 'text-amber-700' : 'text-stone-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm font-medium text-stone-900">
              <span className="text-amber-700 hover:underline">Haz clic para buscar</span> o arrastra un archivo aqui
            </p>
            <p className="text-xs text-stone-600 mt-1">PDF, JPG o PNG (Max. {maxSizeMB}MB)</p>
          </div>
        )}
      </div>

      {error && (
        <span className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </span>
      )}
    </div>
  )
}

export default FileUploader
