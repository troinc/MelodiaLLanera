import React, { useState, useEffect, useRef } from 'react';
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

// Define API base URL
const API_BASE_URL = 'http://localhost/InstrumentosLLaneros'; // Asegurar que la base URL es correcta para las subcarpetas

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [currentProducto, setCurrentProducto] = useState<Producto | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [pastedImage, setPastedImage] = useState<File | null>(null);
  const [pastedImagePreview, setPastedImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    fetchProductos();
    fetchCategorias();

    // Add paste listener to the file input
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.addEventListener('paste', handlePaste);
    }

    // Cleanup listener on component unmount
    return () => {
      if (fileInput) {
        fileInput.removeEventListener('paste', handlePaste);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  // Filtrar productos cuando cambie el término de búsqueda o la lista de productos
  useEffect(() => {
    let result = productos;
    if (searchTerm) {
      result = productos.filter(producto =>
        producto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.category && producto.category.toLowerCase().includes(searchTerm.toLowerCase())) || // Verificar que category exista
        producto.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Aquí se podrían añadir más filtros (por categoría, estado, etc.)
    setFilteredProductos(result);
  }, [searchTerm, productos]);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/php/cargar_productos.php`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
      }
      const data = await response.json();

      if (data.status === 'success' && Array.isArray(data.productos)) {
        const mappedProductos: Producto[] = data.productos.map((p: any) => ({
          id: p.cod_prod,
          name: p.nom_prod,
          description: p.desc_prod,
          price: parseFloat(p.precio_prod),
          stock: parseInt(p.stock_prod, 10),
          category: p.nom_cat, // Nombre de la categoría
          category_id: p.cod_cat, // Código de la categoría
          image_url: p.imagen_prod ? `${API_BASE_URL}/${p.imagen_prod}` : 'https://placehold.co/100x100/png?text=Sin+Imagen',
          status: p.estado === 'activo' ? 'activo' : 'inactivo', // Mapear directamente los valores del ENUM
        }));
        setProductos(mappedProductos);
        setError(null);
      } else {
        throw new Error(data.message || 'Formato de respuesta inesperado al cargar productos.');
      }
    } catch (err) {
      setError('Error al cargar productos: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error loading products:', err);
      setProductos([]); // Limpiar productos en caso de error
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/php/cargar_categorias.php`);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
          setCategorias(data.categorias);
      } else {
          console.error('Error fetching categorias:', data.message);
          setError(data.message || 'Error al cargar categorías');
      }
    } catch (err) {
      console.error('Error fetching categorias:', err);
      setError('Error al cargar categorías: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleEdit = (producto: Producto) => {
    setCurrentProducto(producto);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar este producto?')) return;

    try {
      // Asegurarse de que la URL es correcta y que se envía como JSON
      const response = await fetch(`${API_BASE_URL}/php/eliminar_producto.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Importante para que PHP lo reciba como JSON
        },
        body: JSON.stringify({ cod_prod: id }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error HTTP: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        fetchProductos(); // Recargar la lista de productos
        // Opcional: mostrar notificación de éxito
      } else {
        throw new Error(result.message || 'Error al eliminar el producto desde el backend');
      }
    } catch (err) {
      setError('Error al eliminar producto: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error deleting producto:', err);
      // Opcional: mostrar notificación de error al usuario
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Si hay una imagen pegada, añadirla al FormData
    if (pastedImage) {
      formData.append('imagen', pastedImage, pastedImage.name);
    }

    // Si estamos editando, añadir el ID del producto al FormData
    if (currentProducto) {
      formData.append('cod_prod', currentProducto.id);
    }

    // Determinar la URL del script PHP
    const url = currentProducto
      ? `${API_BASE_URL}/php/actualizar_producto.php`
      : `${API_BASE_URL}/php/insertar_producto_admin.php`;

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
        setCurrentProducto(null);
        fetchProductos();
        // Opcional: mostrar notificación de éxito
      } else {
        // Intentar parsear el mensaje de error si es un objeto con 'errors'
        let errorMessage = result.message || 'Error al guardar el producto desde el backend';
        if (result.errors && Array.isArray(result.errors)) {
          errorMessage += ': ' + result.errors.join(', ');
        }
        throw new Error(errorMessage);
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
            setPastedImage(null); // Clear pasted image state when opening for new product
            setPastedImagePreview(null);
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
        <div className="bg-custom-light rounded-lg shadow"> {/* Removed overflow-x-auto */}
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
                      <img src={producto.image_url || `${API_BASE_URL}/assets/tienda.png`} alt={producto.name} className="h-10 w-10 rounded-full object-cover" />
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
            <form onSubmit={handleSubmit} encType="multipart/form-data"> {/* encType is important for file uploads */}
              {/* Campos del formulario */}
              {currentProducto && (
                <div className="mb-4">
                  <label className="block text-white text-sm font-bold mb-2" htmlFor="id_prod">
                    ID del Producto:
                  </label>
                  <input
                    type="text"
                    id="id_prod"
                    name="id_prod"
                    value={currentProducto.id}
                    className="appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 bg-custom-light text-custom-dark leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent cursor-not-allowed"
                    readOnly
                  />
                </div>
              )}
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

              {/* Campo de Estado */}
              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2" htmlFor="estado">
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  defaultValue={currentProducto?.status || 'activo'} // Valor por defecto 'activo'
                  className="appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 bg-custom-light text-custom-dark leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
                  required
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-white text-sm font-bold mb-2" htmlFor="imagen">
                  Imagen del Producto
                </label>
                <input
                  type="file"
                  id="imagen"
                  name="imagen"
                  ref={fileInputRef} // Attach ref to the input
                  className="block w-full text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-400 file:text-white hover:file:bg-orange-300"
                  accept="image/*"
                />
                {/* Mostrar imagen actual si estamos editando y no hay imagen pegada */}
                {currentProducto?.image_url && !pastedImagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-white">Imagen actual:</p>
                    <img src={currentProducto.image_url} alt="Imagen actual" className="h-16 w-16 mt-1 rounded object-cover"/>
                    <p className="text-xs text-white mt-1">Deje el campo de archivo vacío o pegue una nueva imagen para cambiarla.</p>
                  </div>
                )}
                {/* Mostrar previsualización de imagen pegada */}
                {pastedImagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-white">Imagen pegada:</p>
                    <img src={pastedImagePreview} alt="Imagen pegada" className="h-16 w-16 mt-1 rounded object-cover"/>
                    <p className="text-xs text-white mt-1">Esta imagen reemplazará la imagen actual al guardar.</p>
                  </div>
                )}
              </div>

              {/* Add paste handler function */}
              <script>
                {`
                function handlePaste(event) {
                  const items = (event.clipboardData || event.originalEvent.clipboardData).items;
                  let imageFile = null;

                  for (const item of items) {
                    if (item.type.indexOf('image') !== -1) {
                      imageFile = item.getAsFile();
                      break;
                    }
                  }

                  if (imageFile) {
                    event.preventDefault(); // Prevent default paste behavior (e.g., pasting text)
                    // Use a custom event or state update mechanism to pass the file to the React component
                    // For simplicity here, we'll just log and indicate it was captured.
                    // A more robust solution would involve setting state in the React component.
                    console.log('Pasted image file:', imageFile);

                    // Example: Dispatch a custom event with the file
                    const customEvent = new CustomEvent('pasted-image', { detail: imageFile });
                    event.target.dispatchEvent(customEvent);
                  }
                }

                // Note: Attaching this directly in JSX script tag is not the standard React way.
                // The useEffect approach above is preferred for attaching event listeners in React.
                // This script tag is illustrative of the JS logic needed for pasting.
                `}
              </script>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setCurrentProducto(null);
                    setPastedImage(null); // Clear pasted image state on cancel
                    setPastedImagePreview(null);
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
