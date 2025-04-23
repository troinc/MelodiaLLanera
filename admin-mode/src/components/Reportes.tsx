import React, { useState, useEffect } from 'react';
import { FiDownload, FiBarChart2, FiUsers, FiTrendingUp } from 'react-icons/fi';

// Interfaces para los datos de los reportes (ejemplos)
interface VentaReporte {
  periodo: string;
  total: number;
  cantidad: number;
}

interface UsuarioReporte {
  mes: string;
  nuevos: number;
  activos: number;
}

const Reportes: React.FC = () => {
  const [ventas, setVentas] = useState<VentaReporte[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioReporte[]>([]);
  const [loadingVentas, setLoadingVentas] = useState<boolean>(true);
  const [loadingUsuarios, setLoadingUsuarios] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVentasReport();
    fetchUsuariosReport();
  }, []);

  const fetchVentasReport = async () => {
    try {
      setLoadingVentas(true);
      // Asume un endpoint que devuelve reportes de ventas consolidados
      const response = await fetch('/php/cargar_reporte_ventas.php'); // Ajusta la ruta
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      // Mapea los datos si es necesario
      setVentas(data.ventasPorPeriodo || []); // Ajusta según la estructura de tu API
      setError(null);
    } catch (err) {
      setError('Error al cargar reporte de ventas: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error fetching ventas report:', err);
      setVentas([]);
    } finally {
      setLoadingVentas(false);
    }
  };

  const fetchUsuariosReport = async () => {
    try {
      setLoadingUsuarios(true);
      // Asume un endpoint que devuelve reportes de usuarios
      const response = await fetch('/php/cargar_reporte_usuarios.php'); // Ajusta la ruta
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      // Mapea los datos si es necesario
      setUsuarios(data.usuariosPorMes || []); // Ajusta según la estructura de tu API
      setError(null);
    } catch (err) {
      // Podrías tener un estado de error separado para usuarios si prefieres
      setError('Error al cargar reporte de usuarios: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error fetching usuarios report:', err);
      setUsuarios([]);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const handleExport = (reportType: string) => {
    // Lógica para exportar datos (ej. a CSV)
    alert(`Funcionalidad de exportar (${reportType}) no implementada aún.`);
    // Aquí llamarías a un script PHP que genere el archivo CSV/Excel
  };

  return (
    <div className="p-6 bg-custom-grey min-h-screen">
      <h1 className="text-3xl font-bold text-custom-dark mb-6">Reportes</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-custom-red text-custom-red px-4 py-3 rounded mb-6 shadow" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Sección Reportes de Ventas */}
      <div className="bg-custom-light p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-custom-dark flex items-center">
            <FiTrendingUp className="mr-2 text-green-600" /> Reportes de Ventas {/* Mantener color específico si se desea */}
          </h2>
          <button
            onClick={() => handleExport('ventas')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow text-sm flex items-center transition duration-150 ease-in-out" /* Mantener color específico si se desea */
          >
            <FiDownload className="mr-2" /> Exportar Ventas
          </button>
        </div>

        {loadingVentas ? (
          <p className="text-custom-dark-grey">Cargando reporte de ventas...</p>
        ) : ventas.length > 0 ? (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-custom-dark-grey">
              <thead className="bg-custom-grey">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Período</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Cantidad Pedidos</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Total Ventas</th>
                </tr>
              </thead>
              <tbody className="bg-custom-light divide-y divide-custom-dark-grey">
                {ventas.map((venta, index) => (
                  <tr key={index} className="hover:bg-custom-grey">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-custom-dark">{venta.periodo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-dark-grey">{venta.cantidad}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-dark-grey">${venta.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-custom-dark-grey">No hay datos de ventas disponibles.</p>
        )}

        {/* Placeholder para Gráficos de Ventas */}
        <div className="text-center text-custom-dark-grey py-6 border-t border-custom-dark-grey mt-4">
          <FiBarChart2 className="h-8 w-8 mx-auto mb-2" />
          <p>(Aquí irían gráficos de ventas - ej. Ventas por categoría, Productos más vendidos)</p>
        </div>
      </div>

      {/* Sección Reportes de Usuarios */}
      <div className="bg-custom-light p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-custom-dark flex items-center">
            <FiUsers className="mr-2 text-custom-blue" /> Reportes de Usuarios
          </h2>
          <button
            onClick={() => handleExport('usuarios')}
            className="bg-custom-blue hover:bg-custom-light-blue text-custom-light font-bold py-2 px-4 rounded-lg shadow text-sm flex items-center transition duration-150 ease-in-out"
          >
            <FiDownload className="mr-2" /> Exportar Usuarios
          </button>
        </div>

        {loadingUsuarios ? (
          <p className="text-custom-dark-grey">Cargando reporte de usuarios...</p>
        ) : usuarios.length > 0 ? (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-custom-dark-grey">
              <thead className="bg-custom-grey">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Mes</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Nuevos Registros</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-dark-grey uppercase tracking-wider">Usuarios Activos</th>
                </tr>
              </thead>
              <tbody className="bg-custom-light divide-y divide-custom-dark-grey">
                {usuarios.map((user, index) => (
                  <tr key={index} className="hover:bg-custom-grey">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-custom-dark">{user.mes}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-dark-grey">{user.nuevos}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-dark-grey">{user.activos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-custom-dark-grey">No hay datos de usuarios disponibles.</p>
        )}

        {/* Placeholder para Gráficos de Usuarios */}
        <div className="text-center text-custom-dark-grey py-6 border-t border-custom-dark-grey mt-4">
          <FiBarChart2 className="h-8 w-8 mx-auto mb-2" />
          <p>(Aquí irían gráficos de usuarios - ej. Registros mensuales, Usuarios más activos)</p>
        </div>
      </div>

    </div>
  );
};

export default Reportes;
