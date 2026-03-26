import { useState } from 'react'


import { initialMockUsers, roleOptions, roleStyles } from '../data/superAdminDashboardData'

const UserManagementSection = () => {
  const [users, setUsers] = useState(initialMockUsers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [formData, setFormData] = useState({ id: null, rut: '', nombre: '', email: '', rol: 'Residente' })

  const openCreateModal = () => {
    setModalMode('create')
    setFormData({ id: null, rut: '', nombre: '', email: '', rol: 'Residente' })
    setIsModalOpen(true)
  }

  const openEditModal = (user) => {
    setModalMode('edit')
    setFormData(user)
    setIsModalOpen(true)
  }

  const handleDeleteUser = (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar este usuario?")
    if (confirmacion) {
      setUsers(users.filter(user => user.id !== id))
    }
  }

  const handleSaveUser = (e) => {
    e.preventDefault()
    if (modalMode === 'create') {
      const newUser = { ...formData, id: Date.now() }
      setUsers([...users, newUser])
    } else {
      setUsers(users.map(user => user.id === formData.id ? formData : user))
    }
    setIsModalOpen(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden relative">
      <div className="px-6 py-5 border-b border-stone-200 flex justify-between items-center bg-stone-50">
        <div>
          <h3 className="text-lg font-bold text-stone-800">Directorio de Usuarios</h3>
          <p className="text-sm text-stone-500">Gestiona los accesos y roles del personal y residentes.</p>
        </div>
        <button onClick={openCreateModal} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
          + Nuevo Usuario
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-100/50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
              <th className="px-6 py-4 font-semibold">RUT</th>
              <th className="px-6 py-4 font-semibold">Nombre</th>
              <th className="px-6 py-4 font-semibold">Correo</th>
              <th className="px-6 py-4 font-semibold">Rol</th>
              <th className="px-6 py-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {users.map((user) => {
              
              const badgeClass = roleStyles[user.rol] || 'bg-stone-100 text-stone-700 border-stone-200'
              
              return (
                <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-stone-700">{user.rut}</td>
                  <td className="px-6 py-4 text-sm text-stone-900">{user.nombre}</td>
                  <td className="px-6 py-4 text-sm text-stone-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
                      {user.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right space-x-3">
                    <button onClick={() => openEditModal(user)} className="font-semibold text-amber-600 hover:text-amber-800">Editar</button>
                    <button onClick={() => handleDeleteUser(user.id)} className="font-semibold text-red-600 hover:text-red-800">Eliminar</button>
                  </td>
                </tr>
              )
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-stone-500">No hay usuarios registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h3 className="text-lg font-bold text-stone-800">
                {modalMode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
              </h3>
            </div>
            
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">RUT</label>
                <input type="text" name="rut" value={formData.rut} onChange={handleChange} required className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" placeholder="Ej: 12.345.678-9" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Nombre Completo</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Correo Electrónico</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Rol en el Sistema</label>
                <select name="rol" value={formData.rol} onChange={handleChange} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-white">
                  {roleOptions.map(rol => (
                    <option key={rol} value={rol}>{rol}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-stone-600 hover:bg-stone-100 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                  {modalMode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
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