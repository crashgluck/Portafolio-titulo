import { useCallback, useEffect, useMemo, useState } from 'react'
import useAuth from '@features/auth/hooks/useAuth'
import { toBadgeClass } from '@entities/user/model/user.mapper'
import { createUser, deleteUser, listUsers, updateUser } from '../services/userManagement.service'
import { roleOptions } from '../data/superAdminDashboardData'

const emptyForm = {
  id: null,
  rut: '',
  firstName: '',
  lastName: '',
  email: '',
  role: 'residente',
  password: '',
  passwordConfirmation: '',
  isActive: true,
}

const UserManagementSection = () => {
  const { accessToken } = useAuth()

  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [formData, setFormData] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  const submitLabel = useMemo(() => {
    if (isSaving) {
      return modalMode === 'create' ? 'Creando...' : 'Guardando...'
    }

    return modalMode === 'create' ? 'Crear usuario' : 'Guardar cambios'
  }, [isSaving, modalMode])

  const loadUsers = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const rows = await listUsers(accessToken)
      setUsers(rows)
    } catch (loadError) {
      setError(loadError.message || 'No fue posible cargar usuarios.')
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    if (accessToken) {
      loadUsers()
    }
  }, [accessToken, loadUsers])

  const openCreateModal = () => {
    setModalMode('create')
    setFormData(emptyForm)
    setError('')
    setIsModalOpen(true)
  }

  const openEditModal = (user) => {
    setModalMode('edit')
    setFormData({
      id: user.id,
      rut: user.rut === '-' ? '' : user.rut,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      password: '',
      passwordConfirmation: '',
      isActive: user.isActive,
    })
    setError('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormData(emptyForm)
  }

  const handleDeleteUser = async (id) => {
    const confirmation = window.confirm('Seguro que deseas eliminar este usuario?')
    if (!confirmation) {
      return
    }

    try {
      await deleteUser(id, accessToken)
      await loadUsers()
    } catch (deleteError) {
      setError(deleteError.message || 'No fue posible eliminar el usuario.')
    }
  }

  const buildPayload = () => {
    const payload = {
      rut: formData.rut || null,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      role: formData.role,
      is_active: formData.isActive,
    }

    if (modalMode === 'create' || formData.password) {
      payload.password = formData.password
      payload.password_confirmation = formData.passwordConfirmation
    }

    return payload
  }

  const handleSaveUser = async (event) => {
    event.preventDefault()
    setError('')

    if (modalMode === 'create' || formData.password || formData.passwordConfirmation) {
      if (formData.password !== formData.passwordConfirmation) {
        setError('Las contrasenas no coinciden.')
        return
      }
    }

    setIsSaving(true)

    try {
      const payload = buildPayload()

      if (modalMode === 'create') {
        await createUser(payload, accessToken)
      } else {
        await updateUser(formData.id, payload, accessToken)
      }

      closeModal()
      await loadUsers()
    } catch (saveError) {
      setError(saveError.message || 'No fue posible guardar el usuario.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden relative">
      <div className="px-6 py-5 border-b border-stone-200 flex justify-between items-center bg-stone-50">
        <div>
          <h3 className="text-lg font-bold text-stone-800">Directorio de usuarios</h3>
          <p className="text-sm text-stone-500">Gestiona accesos y roles del sistema.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
        >
          + Nuevo usuario
        </button>
      </div>

      <div className="p-4">
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-100/50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
              <th className="px-6 py-4 font-semibold">RUT</th>
              <th className="px-6 py-4 font-semibold">Nombre</th>
              <th className="px-6 py-4 font-semibold">Correo</th>
              <th className="px-6 py-4 font-semibold">Rol</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-stone-500">Cargando usuarios...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-stone-500">No hay usuarios registrados.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-stone-700">{user.rut}</td>
                  <td className="px-6 py-4 text-sm text-stone-900">{user.fullName}</td>
                  <td className="px-6 py-4 text-sm text-stone-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${toBadgeClass(user.role)}`}>
                      {user.roleLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'}`}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right space-x-3">
                    <button onClick={() => openEditModal(user)} className="font-semibold text-amber-600 hover:text-amber-800">
                      Editar
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} className="font-semibold text-red-600 hover:text-red-800">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h3 className="text-lg font-bold text-stone-800">{modalMode === 'create' ? 'Crear usuario' : 'Editar usuario'}</h3>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">RUT</label>
                  <input type="text" name="rut" value={formData.rut} onChange={handleChange} className="w-full px-3 py-2 border border-stone-300 rounded-lg" placeholder="12.345.678-9" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Rol</label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white">
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Nombre</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-3 py-2 border border-stone-300 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Apellido</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-3 py-2 border border-stone-300 rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Correo electronico</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-stone-300 rounded-lg" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Contrasena</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required={modalMode === 'create'} className="w-full px-3 py-2 border border-stone-300 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Confirmar contrasena</label>
                  <input type="password" name="passwordConfirmation" value={formData.passwordConfirmation} onChange={handleChange} required={modalMode === 'create'} className="w-full px-3 py-2 border border-stone-300 rounded-lg" />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                Usuario activo
              </label>

              <div className="pt-2 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-bold text-stone-600 hover:bg-stone-100 rounded-lg">
                  Cancelar
                </button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg disabled:opacity-60">
                  {submitLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagementSection
