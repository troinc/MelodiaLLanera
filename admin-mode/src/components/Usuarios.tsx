import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';

// Definición del tipo Usuario
interface Usuario {
  id: string; // O number, dependiendo de tu BD
  // nombre_usuario: string; // Removed as per user request
  correo_electronico: string;
  rol: 'administrador' | 'cliente'; // Ajusta los roles según tu sistema
  fecha_registro: string; // O Date
  estado: 'activo' | 'inactivo';
}

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Filtrar usuarios cuando cambie el término de búsqueda o la lista de usuarios
  useEffect(() => {
    let result = usuarios;
    if (searchTerm) {
      // Filtrar solo por correo electrónico
      result = usuarios.filter(usuario =>
        usuario.correo_electronico.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Aquí se podrían añadir más filtros (por rol, estado, etc.)
    setFilteredUsuarios(result);
  }, [searchTerm, usuarios]);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/InstrumentosLLaneros/php/cargar_usuarios.php'); // Ajustado a URL absoluta
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.status === 'success') {
        const mappedData = data.usuarios.map((item: any) => ({
          id: item.cod_cli,
          // nombre_usuario: `${item.nom_cli} ${item.ape_cli}`, // Removed mapping
          correo_electronico: item.email_cli,
          rol: item.rol || 'cliente', // Use role from DB if available, default to 'cliente'
          fecha_registro: item.fecha_registro || new Date().toISOString().split('T')[0],
          estado: item.estado || 'activo'
        }));
        setUsuarios(mappedData);
        setError(null);
      } else {
        throw new Error(data.message || 'Error al procesar la respuesta del servidor');
      }
    } catch (err) {
      setError('Error al cargar usuarios: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error fetching usuarios:', err);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setCurrentUser(usuario);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setCurrentUser(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;

    try {
      const response = await fetch('http://localhost/InstrumentosLLaneros/php/eliminar_usuario.php', { // Ajustado a URL absoluta
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_usuario: id }), // Ajusta el nombre del parámetro si es necesario
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error HTTP: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        fetchUsuarios(); // Recargar la lista de usuarios
      } else {
        throw new Error(result.message || 'Error al eliminar el usuario desde el backend');
      }
    } catch (err) {
      setError('Error al eliminar usuario: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error deleting usuario:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data: { [key: string]: any } = {};
    formData.forEach((value, key) => { 
      // Exclude nombre_usuario if it somehow exists in the form data
      if (key !== 'nombre_usuario') {
        data[key] = value; 
      }
    });

    // Determinar la URL y el cuerpo de la solicitud
    let url = 'http://localhost/InstrumentosLLaneros/php/insertar_usuario_admin.php'; // Ajustado a URL absoluta
    let body: any = data;

    if (isEditing && currentUser) {
      url = 'http://localhost/InstrumentosLLaneros/php/actualizar_usuario.php'; // Ajustado a URL absoluta
      body.id_usuario = currentUser.id; // Añadir el ID para actualizar
    }

    // No enviar contraseña si no se ha introducido (al editar)
    if (isEditing && !data.contrasena) {
      delete body.contrasena;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error HTTP: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        setShowForm(false);
        setCurrentUser(null);
        setIsEditing(false);
        fetchUsuarios(); // Recargar la lista
      } else {
        throw new Error(result.message || 'Error al guardar el usuario desde el backend');
      }
    } catch (err) {
      setError('Error al guardar usuario: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error saving usuario:', err);
    }
  };

  return (
    <div className="p-6 bg-custom-grey min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-custom-dark">Gestión de Usuarios</h1>
        <button
          onClick={handleAddNew}
          className="bg-custom-blue hover:bg-custom-light-blue text-custom-light font-bold py-2 px-4 rounded-lg shadow flex items-center transition duration-150 ease-in-out"
        >
          <FiPlus className="mr-2" /> Nuevo Usuario Admin
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-custom-dark-grey">
            <FiSearch />
          </span>
          <input
            type="text"
            placeholder="Buscar por correo electrónico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-custom-dark-grey rounded-lg bg-custom-light text-custom-dark focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
          />
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border-l-4 border-custom-red text-custom-red px-4 py-3 rounded mb-4 shadow" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Indicador de carga */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-custom-dark-grey text-lg">Cargando usuarios...</p>
        </div>
      ) : (
        // Tabla de usuarios
        <div className="overflow-x-auto bg-custom-light rounded-lg shadow">
          <table className="min-w-full divide-y divide-custom-dark-grey">
            <thead className="bg-custom-grey">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">ID</th>
                {/* Removed Nombre Usuario column */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Correo Electrónico</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Rol</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Fecha Registro</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-custom-light divide-y divide-custom-dark-grey">
              {filteredUsuarios.length > 0 ? (
                filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-custom-grey transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-custom-dark">{usuario.id}</td>
                    {/* Removed Nombre Usuario cell */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-dark-grey">{usuario.correo_electronico}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-dark-grey">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.rol === 'administrador' ? 'bg-blue-100 text-custom-blue' : 'bg-green-100 text-green-800'}`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-dark-grey">{new Date(usuario.fecha_registro).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-dark-grey">
                      <div className="flex items-center">
                        <span className={`h-3 w-3 rounded-full mr-2 ${usuario.estado === 'activo' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span>{usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(usuario)}
                          className="text-custom-blue hover:text-custom-light-blue flex items-center"
                          title="Editar"
                        >
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(usuario.id)}
                          className="text-custom-red hover:text-red-700 flex items-center"
                          title="Eliminar"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  {/* Adjusted colSpan from 7 to 6 */}
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-custom-dark-grey">
                    No hay usuarios que coincidan con la búsqueda o no hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal/Formulario para agregar/editar usuario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-8 bg-custom-light w-full max-w-lg m-auto flex-col flex rounded-lg shadow-lg">
            <button
              onClick={() => {
                setShowForm(false);
                setCurrentUser(null);
                setIsEditing(false);
              }}
              className="absolute top-0 right-0 mt-4 mr-4 text-custom-dark-grey hover:text-custom-dark"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-6 text-custom-dark">
              {isEditing ? 'Editar Usuario' : 'Nuevo Usuario Administrador'}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Grid layout adjusted for single column */}
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-custom-dark text-sm font-bold mb-2" htmlFor="correo_electronico">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="correo_electronico"
                    name="correo_electronico"
                    defaultValue={currentUser?.correo_electronico || ''}
                    className="shadow-sm appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 text-custom-dark bg-custom-grey leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Removed the duplicated 'Nombre de Usuario' field block */}

              <div className="mb-4">
                <label className="block text-custom-dark text-sm font-bold mb-2" htmlFor="contrasena">
                  Contraseña {isEditing ? '(Dejar en blanco para no cambiar)' : ''}
                </label>
                <input
                  type="password"
                  id="contrasena"
                  name="contrasena"
                  className="shadow-sm appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 text-custom-dark bg-custom-grey leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
                  required={!isEditing} // Solo requerido al crear
                />
              </div>

              <div className="mb-6">
                <label className="block text-custom-dark text-sm font-bold mb-2" htmlFor="rol">
                  Rol
                </label>
                <select
                  id="rol"
                  name="rol"
                  defaultValue={currentUser?.rol || 'cliente'} // Default a cliente si no es admin
                  className="shadow-sm appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 text-custom-dark bg-custom-grey leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
                  required
                >
                  <option value="cliente">Cliente</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>

              {isEditing && (
                <div className="mb-6">
                  <label className="block text-custom-dark text-sm font-bold mb-2" htmlFor="estado">
                    Estado
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    defaultValue={currentUser?.estado || 'activo'}
                    className="shadow-sm appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 text-custom-dark bg-custom-grey leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
                    required
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setCurrentUser(null);
                    setIsEditing(false);
                  }}
                  className="bg-custom-dark-grey hover:bg-gray-500 text-custom-dark font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-custom-blue hover:bg-custom-light-blue text-custom-light font-bold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
                >
                  {isEditing ? 'Actualizar Usuario' : 'Guardar Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
