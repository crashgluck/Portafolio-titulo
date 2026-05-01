import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AuthLayout from '@features/auth/components/AuthLayout'
import useAuth from '@features/auth/hooks/useAuth'
import { USER_ROLES } from '@features/auth/model/auth.constants'
import { getHomeRouteByRole } from '@features/auth/model/roleRedirect'
import FormInput from '@shared/ui/FormInput'
import { APP_ROUTES } from '@app/routes'

const roleOptions = [
  { value: USER_ROLES.residente, label: 'Residente' },
  { value: USER_ROLES.conserje, label: 'Conserje' },
  { value: USER_ROLES.admin, label: 'Administrador' },
  { value: USER_ROLES.superadmin, label: 'Super Admin' },
]

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    rut: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    role: USER_ROLES.residente,
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
      const session = await register(formData)
      navigate(getHomeRouteByRole(session?.user?.role), { replace: true })
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
      <form onSubmit={handleSubmit} className="animate-fade-in">
        <FormInput
          label="RUT"
          value={formData.rut}
          onChange={handleChange('rut')}
          placeholder="12.345.678-9"
          required
        />
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

        <label htmlFor="role" className="mb-1.5 text-sm font-semibold text-stone-700 flex items-center gap-1">
          Rol
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={handleChange('role')}
          className="input-base mb-4 bg-stone-50"
        >
          {roleOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>

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

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full bg-amber-700 text-amber-50 hover:bg-amber-800"
        >
          {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
