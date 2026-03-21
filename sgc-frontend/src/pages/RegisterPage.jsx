import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AuthLayout from '@features/auth/components/AuthLayout'
import useAuth from '@features/auth/hooks/useAuth'
import FormInput from '@shared/ui/FormInput'
import { APP_ROUTES } from '@app/routes'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (key) => (event) => {
    setFormData((previous) => ({ ...previous, [key]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (formData.password !== formData.passwordConfirmation) {
      setError('Las contrasenas no coinciden.')
      return
    }

    setIsSubmitting(true)

    try {
      await register(formData)
      navigate(APP_ROUTES.residentDashboard, { replace: true })
    } catch (submitError) {
      setError(submitError.message || 'No fue posible registrar la cuenta.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Registra tu acceso al portal SGC"
      footer={
        <>
          Ya tienes cuenta?{' '}
          <Link to={APP_ROUTES.login} className="text-amber-700 font-semibold hover:underline">
            Inicia sesion
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Nombre"
          value={formData.firstName}
          onChange={handleChange('firstName')}
          placeholder="Juan"
          required
        />
        <FormInput
          label="Apellido"
          value={formData.lastName}
          onChange={handleChange('lastName')}
          placeholder="Perez"
          required
        />
        <FormInput
          label="Correo electronico"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="usuario@correo.com"
          required
        />
        <FormInput
          label="Contrasena"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          placeholder="Minimo 8 caracteres"
          required
        />
        <FormInput
          label="Confirmar contrasena"
          type="password"
          value={formData.passwordConfirmation}
          onChange={handleChange('passwordConfirmation')}
          placeholder="Repite tu contrasena"
          required
        />

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-700 text-amber-50 py-2.5 rounded-lg font-semibold hover:bg-amber-800 transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
