import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AuthLayout from '@features/auth/components/AuthLayout'
import useAuth from '@features/auth/hooks/useAuth'
import { getHomeRouteByRole } from '@features/auth/model/roleRedirect'
import FormInput from '@shared/ui/FormInput'
import { APP_ROUTES } from '@app/routes'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = location.state?.from?.pathname

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const session = await login({ email, password })
      const fallbackRoute = getHomeRouteByRole(session?.user?.role)
      navigate(from || fallbackRoute, { replace: true })
    } catch (submitError) {
      setError(submitError.message || 'No fue posible iniciar sesion.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Iniciar sesion"
      subtitle="Accede con tu cuenta para administrar tu condominio"
      footer={
        <>
          No tienes cuenta?{' '}
          <Link to={APP_ROUTES.register} className="text-amber-700 font-semibold hover:underline">
            Registrate
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Correo electronico"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="usuario@correo.com"
          required
        />
        <FormInput
          label="Contrasena"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Tu contrasena"
          required
        />

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-stone-900 text-stone-50 py-2.5 rounded-lg font-semibold hover:bg-stone-800 transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
