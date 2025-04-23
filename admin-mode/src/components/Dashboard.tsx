import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiBox, FiUsers, FiMessageSquare, FiPlus, FiEye } from 'react-icons/fi';

// Interfaz para las estadísticas del dashboard
interface DashboardStats {
  ventasHoy: number;
  ventasSemana: number;
  ventasMes: number;
  productosTop: { nombre: string; cantidad: number }[];
  usuariosNuevos: number;
  resenasPendientes: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Asegúrate que la ruta al PHP sea correcta
      const response = await fetch('/php/cargar_dashboard_stats.php'); // Ajusta la ruta si es necesario
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      // Asumiendo que la API devuelve un objeto con las estadísticas
      setStats({
        ventasHoy: data.ventas_hoy || 0,
        ventasSemana: data.ventas_semana || 0,
        ventasMes: data.ventas_mes || 0,
        productosTop: data.productos_top || [],
        usuariosNuevos: data.usuarios_nuevos || 0,
        resenasPendientes: data.resenas_pendientes || 0,
      });
      setError(null);
    } catch (err) {
      setError('Error al cargar estadísticas: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-custom-grey min-h-screen">
      <h1 className="text-3xl font-bold text-custom-dark mb-6">Dashboard</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-custom-red text-custom-red px-4 py-3 rounded mb-6 shadow" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <p className="text-custom-dark-grey text-lg">Cargando datos del dashboard...</p>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Card Ventas Hoy */}
          <div className="bg-custom-light p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4"> {/* Mantener colores específicos de estado si se desea */} 
                <FiShoppingCart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-custom-dark-grey uppercase">Ventas Hoy</p>
                <p className="text-2xl font-semibold text-custom-dark">${stats.ventasHoy.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Card Ventas Semana */}
          <div className="bg-custom-light p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-custom-blue mr-4"> {/* Ajustar color */} 
                <FiShoppingCart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-custom-dark-grey uppercase">Ventas Semana</p>
                <p className="text-2xl font-semibold text-custom-dark">${stats.ventasSemana.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Card Ventas Mes */}
          <div className="bg-custom-light p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-custom-blue mr-4"> {/* Ajustar color */} 
                <FiShoppingCart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-custom-dark-grey uppercase">Ventas Mes</p>
                <p className="text-2xl font-semibold text-custom-dark">${stats.ventasMes.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Card Usuarios Nuevos */}
          <div className="bg-custom-light p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-custom-yellow mr-4"> {/* Ajustar color */} 
                <FiUsers className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-custom-dark-grey uppercase">Usuarios Nuevos (Mes)</p>
                <p className="text-2xl font-semibold text-custom-dark">{stats.usuariosNuevos}</p>
              </div>
            </div>
          </div>

          {/* Card Reseñas Pendientes */}
          <div className="bg-custom-light p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4"> {/* Mantener color específico si se desea */} 
                <FiMessageSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-custom-dark-grey uppercase">Reseñas Pendientes</p>
                <p className="text-2xl font-semibold text-custom-dark">{stats.resenasPendientes}</p>
              </div>
            </div>
          </div>

          {/* Placeholder para Productos Más Vendidos */}
          <div className="bg-custom-light p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-custom-red mr-4"> {/* Ajustar color */} 
                <FiBox className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-custom-dark-grey uppercase">Productos Top</p>
                {stats.productosTop.length > 0 ? (
                  <ul className="text-sm text-custom-dark mt-1">
                    {stats.productosTop.slice(0, 3).map((p, index) => (
                      <li key={index}>{p.nombre} ({p.cantidad})</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-custom-dark-grey mt-1">No hay datos</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        !loading && <p className="text-center text-custom-dark-grey">No se pudieron cargar los datos del dashboard.</p>
      )}

      {/* Sección de Gráficos (Placeholder) */}
      <div className="bg-custom-light p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold text-custom-dark mb-4">Gráficos de Tendencias</h2>
        <div className="text-center text-custom-dark-grey py-10">
          <p>(Aquí irían los gráficos - ej. Ventas mensuales, registros de usuarios)</p>
          {/* Puedes integrar una librería como Chart.js o Recharts aquí */}
        </div>
      </div>

      {/* Sección de Accesos Rápidos */}
      <div className="bg-custom-light p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-custom-dark mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a href="/admin/productos" className="flex items-center p-4 bg-custom-grey rounded-lg hover:bg-custom-dark-grey transition duration-150">
            <FiPlus className="h-5 w-5 text-custom-blue mr-3" />
            <span className="text-custom-dark font-medium">Agregar Nuevo Producto</span>
          </a>
          <a href="/admin/usuarios" className="flex items-center p-4 bg-custom-grey rounded-lg hover:bg-custom-dark-grey transition duration-150">
            <FiEye className="h-5 w-5 text-custom-blue mr-3" />
            <span className="text-custom-dark font-medium">Ver Usuarios Recientes</span>
          </a>
          {/* Añade más accesos rápidos según sea necesario */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
