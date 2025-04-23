import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiBox, FiTag, FiUsers, FiBarChart2, FiSettings, FiLogOut, FiMenu, FiMusic } from 'react-icons/fi';
// Asegúrate de que Layout.css no sobreescriba los colores de Tailwind si ambos se usan
// import './Layout.css'; // Comentado si Tailwind maneja todos los estilos

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Efecto para manejar la clase del sidebar cuando se colapsa
  useEffect(() => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      if (sidebarCollapsed) {
        sidebar.classList.add('hide'); // Asume que 'hide' está definido en CSS o Tailwind
      } else {
        sidebar.classList.remove('hide');
      }
    }
  }, [sidebarCollapsed]);

  const isActive = (path: string) => {
    // Ajusta la lógica de active si es necesario, Tailwind podría usar clases diferentes
    return location.pathname === path ? 'active' : ''; // 'active' puede necesitar ser una clase Tailwind
  };

  const handleLogout = () => {
    // Implementar lógica de cierre de sesión con API
    console.log('Cerrando sesión...');
    // Aquí se podría hacer una llamada a un endpoint de logout
    // Por ahora solo simulamos redirección
    // navigate('/login');
  };

  return (
    <div className="flex h-screen bg-custom-grey text-custom-dark">
      {/* Sidebar */}
      <section id="sidebar" className={`fixed top-0 left-0 h-full bg-custom-light z-50 transition-width duration-300 ease-in-out ${sidebarCollapsed ? 'w-16' : 'w-56'}`}>
        <div className="brand flex items-center h-14 px-4 sticky top-0 bg-custom-light z-10">
          {!sidebarCollapsed && <FiMusic className="h-6 w-6 text-custom-blue mr-2" />}
          {!sidebarCollapsed && <span className="text-lg font-semibold text-custom-blue">Administrador</span>}
        </div>
        <ul className="side-menu top mt-12 space-y-1 px-2">
          <li className={`${isActive('/')} rounded-md`}>
            <Link to="/" className={`flex items-center py-2.5 px-4 rounded-md transition duration-200 ${isActive('/') ? 'bg-custom-grey text-custom-blue' : 'text-custom-dark hover:bg-custom-grey'}`}>
              <FiHome className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!sidebarCollapsed && <span className="text">Dashboard</span>}
            </Link>
          </li>
          <li className={`${isActive('/productos')} rounded-md`}>
            <Link to="/productos" className={`flex items-center py-2.5 px-4 rounded-md transition duration-200 ${isActive('/productos') ? 'bg-custom-grey text-custom-blue' : 'text-custom-dark hover:bg-custom-grey'}`}>
              <FiBox className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!sidebarCollapsed && <span className="text">Productos</span>}
            </Link>
          </li>
          <li className={`${isActive('/categorias')} rounded-md`}>
            <Link to="/categorias" className={`flex items-center py-2.5 px-4 rounded-md transition duration-200 ${isActive('/categorias') ? 'bg-custom-grey text-custom-blue' : 'text-custom-dark hover:bg-custom-grey'}`}>
              <FiTag className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!sidebarCollapsed && <span className="text">Categorías</span>}
            </Link>
          </li>
          <li className={`${isActive('/usuarios')} rounded-md`}>
            <Link to="/usuarios" className={`flex items-center py-2.5 px-4 rounded-md transition duration-200 ${isActive('/usuarios') ? 'bg-custom-grey text-custom-blue' : 'text-custom-dark hover:bg-custom-grey'}`}>
              <FiUsers className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!sidebarCollapsed && <span className="text">Usuarios</span>}
            </Link>
          </li>
          <li className={`${isActive('/reportes')} rounded-md`}>
            <Link to="/reportes" className={`flex items-center py-2.5 px-4 rounded-md transition duration-200 ${isActive('/reportes') ? 'bg-custom-grey text-custom-blue' : 'text-custom-dark hover:bg-custom-grey'}`}>
              <FiBarChart2 className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!sidebarCollapsed && <span className="text">Reportes</span>}
            </Link>
          </li>
          <li className={`${isActive('/configuracion')} rounded-md`}>
            <Link to="/configuracion" className={`flex items-center py-2.5 px-4 rounded-md transition duration-200 ${isActive('/configuracion') ? 'bg-custom-grey text-custom-blue' : 'text-custom-dark hover:bg-custom-grey'}`}>
              <FiSettings className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!sidebarCollapsed && <span className="text">Configuración</span>}
            </Link>
          </li>
        </ul>
        <ul className="side-menu bottom absolute bottom-0 w-full px-2 mb-4">
          <li>
            <a href="http://localhost/InstrumentosLLaneros/index.php" className={`logout flex items-center text-custom-red hover:bg-custom-grey transition-colors duration-200 rounded-md px-4 py-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <FiLogOut className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!sidebarCollapsed && <span className="text">Cerrar Sesión</span>}
            </a>
          </li>
        </ul>
      </section>

      {/* Content */}
      <section id="content" className={`relative flex-1 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'ml-16' : 'ml-56'}`}>
        {/* Navbar */}
        <nav className="h-14 bg-custom-light px-6 flex items-center justify-between sticky top-0 z-40 shadow">
          <div className="nav-left">
            <FiMenu className='h-6 w-6 cursor-pointer text-custom-dark hover:text-custom-blue' onClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
          </div>
          <div className="nav-center">
            <h1 className="text-xl font-semibold text-custom-dark">
              {location.pathname === '/' && 'Dashboard'}
              {location.pathname === '/productos' && 'Gestión de Productos'}
              {location.pathname === '/categorias' && 'Gestión de Categorías'}
              {location.pathname === '/usuarios' && 'Gestión de Usuarios'}
              {location.pathname === '/reportes' && 'Reportes y Estadísticas'}
              {location.pathname === '/configuracion' && 'Configuración'}
            </h1>
          </div>
          <div className="nav-right">
            <a href="#" className="profile">
              {/* Usar una imagen real o un icono de usuario */}
              <img src="https://placehold.co/40x40/png" alt="Admin Profile" className="h-9 w-9 rounded-full object-cover" />
            </a>
          </div>
        </nav>

        {/* Main */}
        <main className="p-6 overflow-y-auto h-[calc(100vh-56px)]">
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default Layout;
