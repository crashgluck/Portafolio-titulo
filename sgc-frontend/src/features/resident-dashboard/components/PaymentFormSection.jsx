import { useState } from 'react'
import FileUploader from '@shared/ui/FileUploader'
import FormInput from '@shared/ui/FormInput'

const PaymentFormSection = ({ sectionId = 'seccion-pago' }) => {
  const [amount, setAmount] = useState('')
  const [receipt, setReceipt] = useState(null)
  const [feedback, setFeedback] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setFeedback('Comprobante enviado. El equipo validara tu pago dentro de 24 horas habiles.')
    setAmount('')
    setReceipt(null)
  }

  return (
    <section id={sectionId} className="bg-white/95 p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm">
      <h2 className="text-xl font-bold text-stone-900 uppercase tracking-wide mb-2 border-b border-stone-200 pb-4">
        Informar pago
      </h2>
      <p className="text-sm text-stone-600 mb-6 mt-4">
        Sube el comprobante de tu transferencia para acelerar la conciliacion de tu cuenta.
      </p>

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Monto transferido"
          type="number"
          placeholder="Ej. 85000"
          required
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <FileUploader label="Comprobante adjunto" onFileSelect={setReceipt} />

        <button
          type="submit"
          disabled={!amount || !receipt}
          className="w-full mt-4 bg-stone-900 text-stone-50 px-6 py-3 rounded-lg font-bold hover:bg-stone-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar a validacion
        </button>
      </form>

      {feedback && <p className="mt-4 text-sm text-emerald-700 font-medium">{feedback}</p>}
    </section>
  )
}

export default PaymentFormSection
