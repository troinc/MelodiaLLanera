import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

// Definición del tipo Categoria
interface Categoria {
  cod_cat: string;
  nom_cat: string;
  desc_cat?: string; // Descripción opcional
}

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [currentCategoria, setCurrentCategoria] = useState<Categoria | null>(null);

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await fetch('/php/cargar_categorias.php'); // Ajusta la ruta si es necesario
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      // Asumiendo que la API devuelve un array de categorías con cod_cat y nom_cat
      setCategorias(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar categorías: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error fetching categorias:', err);
      setCategorias([]); // Limpia las categorías en caso de error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setCurrentCategoria(categoria);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar esta categoría? Esto podría afectar a los productos asociados.')) return;

    try {
      const response = await fetch('/php/eliminar_categoria.php', { // Ajusta la ruta si es necesario
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cod_cat: id }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error HTTP: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        fetchCategorias(); // Recargar la lista de categorías
      } else {
        throw new Error(result.message || 'Error al eliminar la categoría desde el backend');
      }
    } catch (err) {
      setError('Error al eliminar categoría: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error deleting categoria:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data: { [key: string]: any } = {};
    formData.forEach((value, key) => { data[key] = value; });

    // Determinar la URL y el cuerpo de la solicitud
    let url = '/php/insertar_categoria.php'; // Ajusta la ruta si es necesario
    let body: any = data;

    if (currentCategoria) {
      url = '/php/actualizar_categoria.php'; // Ajusta la ruta si es necesario
      body.cod_cat = currentCategoria.cod_cat; // Añadir el ID para actualizar
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
        setCurrentCategoria(null); // Limpiar categoría actual
        fetchCategorias(); // Recargar la lista
      } else {
        throw new Error(result.message || 'Error al guardar la categoría desde el backend');
      }
    } catch (err) {
      setError('Error al guardar categoría: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error saving categoria:', err);
    }
  };

  return (
    <div className="p-6 bg-custom-grey min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-custom-dark">Gestión de Categorías</h1>
        <button
          onClick={() => {
            setCurrentCategoria(null);
            setShowForm(true);
          }}
          className="bg-custom-blue hover:bg-custom-light-blue text-custom-light font-bold py-2 px-4 rounded-lg shadow flex items-center transition duration-150 ease-in-out"
        >
          <FiPlus className="mr-2" /> Nueva Categoría
        </button>
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
          <p className="text-custom-dark-grey text-lg">Cargando categorías...</p>
        </div>
      ) : (
        // Tabla de categorías
        <div className="overflow-x-auto bg-custom-light rounded-lg shadow">
          <table className="min-w-full divide-y divide-custom-dark-grey">
            <thead className="bg-custom-grey">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Descripción</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-custom-light divide-y divide-custom-dark-grey">
              {categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <tr key={categoria.cod_cat} className="hover:bg-custom-grey transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-custom-dark">{categoria.cod_cat}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-dark">{categoria.nom_cat}</td>
                    <td className="px-6 py-4 text-sm text-custom-dark-grey">{categoria.desc_cat || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(categoria)}
                          className="text-custom-blue hover:text-custom-light-blue flex items-center"
                          title="Editar"
                        >
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(categoria.cod_cat)}
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
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-custom-dark-grey">
                    No hay categorías disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal/Formulario para agregar/editar categoría */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-8 bg-custom-light w-full max-w-md m-auto flex-col flex rounded-lg shadow-lg">
            <button
              onClick={() => {
                setShowForm(false);
                setCurrentCategoria(null);
              }}
              className="absolute top-0 right-0 mt-4 mr-4 text-custom-dark-grey hover:text-custom-dark"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" className="fill-red-500" />
              </svg>
            </button>

            <h2 className="text-2xl font-semibold text-custom-dark mb-4">{currentCategoria ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="nom_cat" className="block text-custom-dark-grey text-sm font-bold mb-2">Nombre:</label>
                <input
                  type="text"
                  id="nom_cat"
                  name="nom_cat"
                  defaultValue={currentCategoria?.nom_cat || ''}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-custom-light text-custom-dark leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="desc_cat" className="block text-custom-dark-grey text-sm font-bold mb-2">Descripción:</label>
                <textarea
                  id="desc_cat"
                  name="desc_cat"
                  defaultValue={currentCategoria?.desc_cat || ''}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-custom-light text-custom-dark leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-custom-blue hover:bg-custom-light-blue text-custom-light font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Guardar
                </button>
                <button
                  className="inline-block align-baseline font-bold text-sm text-custom-blue hover:text-custom-light-blue"
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setCurrentCategoria(null);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categorias;
