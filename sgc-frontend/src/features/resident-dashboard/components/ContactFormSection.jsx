import { useState } from 'react'
import FormInput from '@shared/ui/FormInput'
import { defaultContactForm } from '../../contact/model/contact.model'

const ContactFormSection = () => {
  const [email, setEmail] = useState(defaultContactForm.email)
  const [phone, setPhone] = useState(defaultContactForm.phone)
  const [feedback, setFeedback] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setFeedback('Tus datos de contacto fueron actualizados correctamente.')
  }

  return (
    <section className="bg-white/95 p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm">
      <h2 className="text-xl font-bold text-stone-900 uppercase tracking-wide mb-6 border-b border-stone-200 pb-4">
        Datos de contacto
      </h2>

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Correo electronico"
          type="email"
          placeholder="juan@correo.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <FormInput
          label="Telefono movil"
          type="tel"
          placeholder="+56 9 1234 5678"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            className="bg-amber-700 text-amber-50 px-6 py-2.5 rounded-lg font-semibold hover:bg-amber-800 transition-colors shadow-sm"
          >
            Guardar cambios
          </button>
        </div>
      </form>

      {feedback && <p className="mt-4 text-sm text-emerald-700 font-medium">{feedback}</p>}
    </section>
  )
}

export default ContactFormSection
