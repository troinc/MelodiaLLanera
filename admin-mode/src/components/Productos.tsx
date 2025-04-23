import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';

// Definición del tipo Producto
interface Producto {
  id: string;
  name: string;
  description?: string; // Hacer opcional si no siempre está presente
  price: number;
  stock: number;
  category: string; // O podría ser un ID de categoría si se relaciona
  category_id?: string; // Añadir si se usa ID
  image_url?: string; // URL de la imagen
  status?: 'activo' | 'inactivo'; // Estado del producto
}

// Definición del tipo Categoria
interface Categoria {
  cod_cat: string;
  nom_cat: string;
}

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [currentProducto, setCurrentProducto] = useState<Producto | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  // Filtrar productos cuando cambie el término de búsqueda o la lista de productos
  useEffect(() => {
    let result = productos;
    if (searchTerm) {
      result = productos.filter(producto =>
        producto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Aquí se podrían añadir más filtros (por categoría, estado, etc.)
    setFilteredProductos(result);
  }, [searchTerm, productos]);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      // Asegúrate que la ruta al PHP sea correcta desde la ubicación del HTML/JS
      const response = await fetch('/php/cargar_productos.php'); // Ajusta la ruta si es necesario
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      // Asumiendo que la API devuelve un array de productos con las propiedades correctas
      // Mapea los datos si es necesario para que coincidan con la interfaz Producto
      const mappedData = data.map((item: any) => ({
        id: item.cod_prod,
        name: item.nom_prod,
        description: item.desc_prod,
        price: parseFloat(item.precio_prod),
        stock: parseInt(item.stock_prod, 10),
        category: item.nom_cat, // Asume que el backend une el nombre de la categoría
        category_id: item.cod_cat,
        image_url: item.imagen_url || '/assets/placeholder.png', // Usa una imagen por defecto si no hay
        status: item.estado || 'activo' // Asume un estado por defecto
      }));
      setProductos(mappedData);
      setError(null);
    } catch (err) {
      setError('Error al cargar productos: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error fetching productos:', err);
      setProductos([]); // Limpia los productos en caso de error
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch('/php/cargar_categorias.php'); // Ajusta la ruta si es necesario
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      setCategorias(data);
    } catch (err) {
      console.error('Error fetching categorias:', err);
      // Podrías establecer un error específico para categorías si es necesario
    }
  };

  const handleEdit = (producto: Producto) => {
    setCurrentProducto(producto);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar este producto?')) return;

    try {
      const response = await fetch('/php/eliminar_producto.php', { // Ajusta la ruta si es necesario
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cod_prod: id }),
      });

      if (!response.ok) {
        const errorData = await response.text(); // Leer el cuerpo del error
        throw new Error(`Error HTTP: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        fetchProductos(); // Recargar la lista de productos
      } else {
        throw new Error(result.message || 'Error al eliminar el producto desde el backend');
      }
    } catch (err) {
      setError('Error al eliminar producto: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error deleting producto:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Si estamos editando, añadir el ID del producto al FormData
    if (currentProducto) {
      formData.append('cod_prod', currentProducto.id);
    }

    // Determinar la URL del script PHP
    const url = currentProducto
      ? '/php/actualizar_producto.php' // Ajusta la ruta si es necesario
      : '/php/insertar_producto_admin.php'; // Ajusta la ruta si es necesario

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // FormData se encarga del Content-Type multipart/form-data
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error HTTP: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        setShowForm(false);
        setCurrentProducto(null); // Limpiar producto actual
        fetchProductos(); // Recargar la lista
      } else {
        throw new Error(result.message || 'Error al guardar el producto desde el backend');
      }
    } catch (err) {
      setError('Error al guardar producto: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error saving producto:', err);
    }
  };

  return (
    <div className="p-6 bg-custom-grey min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-custom-dark">Gestión de Productos</h1>
        <button
          onClick={() => {
            setCurrentProducto(null);
            setShowForm(true);
          }}
          className="bg-custom-blue hover:bg-custom-light-blue text-custom-light font-bold py-2 px-4 rounded-lg shadow flex items-center transition duration-150 ease-in-out"
        >
          <FiPlus className="mr-2" /> Nuevo Producto
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
            placeholder="Buscar por ID, nombre, categoría..."
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
          <p className="text-custom-dark-grey text-lg">Cargando productos...</p>
          {/* Podrías añadir un spinner aquí */}
        </div>
      ) : (
        // Tabla de productos
        <div className="overflow-x-auto bg-custom-light rounded-lg shadow">
          <table className="min-w-full divide-y divide-custom-dark-grey">
            <thead className="bg-custom-grey">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Imagen</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Categoría</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Precio</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-custom-light divide-y divide-custom-dark-grey">
              {filteredProductos.length > 0 ? (
                filteredProductos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-custom-grey transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={producto.image_url || '/assets/tienda.png'} alt={producto.name} className="h-10 w-10 rounded-full object-cover" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-custom-dark">{producto.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-dark">{producto.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-dark">{producto.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-dark">${producto.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-dark">{producto.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${producto.status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {producto.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(producto)}
                          className="text-custom-blue hover:text-custom-light-blue flex items-center"
                          title="Editar"
                        >
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(producto.id)}
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
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-custom-dark-grey">
                    {searchTerm ? 'No se encontraron productos que coincidan con la búsqueda.' : 'No hay productos disponibles.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal/Formulario para agregar/editar producto */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out">
          <div className="bg-custom-grey p-8 rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 ease-in-out scale-100">
            <h2 className="text-2xl font-bold mb-6 text-white">
              {currentProducto ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Campos del formulario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-white text-sm font-bold mb-2" htmlFor="nom_prod">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    id="nom_prod"
                    name="nom_prod"
                    defaultValue={currentProducto?.name || ''}
                    className="appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 bg-custom-light text-custom-dark leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-bold mb-2" htmlFor="cod_cat">
                    Categoría
                  </label>
                  <select
                    id="cod_cat"
                    name="cod_cat"
                    defaultValue={currentProducto?.category_id || ''}
                    className="appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 bg-custom-light text-custom-dark leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
                    required
                  >
                    <option value="" disabled className="text-white">Seleccione una categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.cod_cat} value={cat.cod_cat} className="text-white">{cat.nom_cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2" htmlFor="desc_prod">
                  Descripción
                </label>
                <textarea
                  id="desc_prod"
                  name="desc_prod"
                  defaultValue={currentProducto?.description || ''}
                  className="appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 bg-custom-light text-custom-dark leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-white text-sm font-bold mb-2" htmlFor="precio_prod">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    id="precio_prod"
                    name="precio_prod"
                    defaultValue={currentProducto?.price || ''}
                    className="appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 bg-custom-light text-custom-dark leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-bold mb-2" htmlFor="stock_prod">
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock_prod"
                    name="stock_prod"
                    defaultValue={currentProducto?.stock || ''}
                    className="appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 bg-custom-light text-custom-dark leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-white text-sm font-bold mb-2" htmlFor="imagen">
                  Imagen del Producto
                </label>
                <input
                  type="file"
                  id="imagen"
                  name="imagen"
                  className="block w-full text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-400 file:text-white hover:file:bg-orange-300"
                  accept="image/*"
                />
                {currentProducto?.image_url && (
                  <div className="mt-2">
                    <p className="text-sm text-white">Imagen actual:</p>
                    <img src={currentProducto.image_url} alt="Imagen actual" className="h-16 w-16 mt-1 rounded object-cover"/>
                    <p className="text-xs text-white mt-1">Deje el campo de archivo vacío si no desea cambiar la imagen.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setCurrentProducto(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-orange-400 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
                >
                  {currentProducto ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;
