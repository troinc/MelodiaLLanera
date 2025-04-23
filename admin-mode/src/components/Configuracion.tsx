import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSave, FiSettings, FiCreditCard, FiTruck, FiUsers, FiDollarSign, FiPercent, FiLink, FiUserPlus, FiPalette } from 'react-icons/fi'; // Añadir nuevos iconos

// Interfaz para los datos de configuración
interface ConfiguracionData {
  nombre_tienda: string;
  descripcion_tienda: string;
  contacto_email: string;
  contacto_telefono: string;
  contacto_direccion: string;
  redes_sociales: string; // Podría ser un objeto o array si es más complejo
  moneda: string; // Ej. USD, EUR, COP
  impuestos_activos: boolean;
  porcentaje_impuesto?: number; // Opcional si impuestos_activos es true
  metodos_pago: string[]; // Array de métodos activos (ej. ['paypal', 'stripe'])
  // Añadir campos específicos de pasarelas si es necesario (ej. paypal_client_id)
  // Ejemplo: paypal_client_id?: string;
  // Ejemplo: stripe_publishable_key?: string;
  opciones_envio: { nombre: string; costo: number; activo: boolean }[]; // Mantener como array de objetos
  costo_envio_estandar?: number; // Costo base si no hay opciones complejas
  envio_gratis_desde?: number; // Umbral para envío gratuito
  // Campos para gestión de roles (podría ser más complejo)
}

const Configuracion: React.FC = () => {
  const [config, setConfig] = useState<ConfiguracionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // Estados adicionales para las nuevas funcionalidades
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [primaryColor, setPrimaryColor] = useState<string>('#007bff'); // Color por defecto
  const navigate = useNavigate(); // Hook para navegación

  useEffect(() => {
    fetchConfiguracion();
  }, []);

  const fetchConfiguracion = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      const response = await fetch('http://localhost/InstrumentosLLaneros/php/cargar_configuracion.php'); // Usar URL absoluta
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      // Asigna valores por defecto si la API no los devuelve todos
      setConfig({
        nombre_tienda: data.nombre_tienda || '',
        descripcion_tienda: data.descripcion_tienda || '',
        contacto_email: data.contacto_email || '',
        contacto_telefono: data.contacto_telefono || '',
        contacto_direccion: data.contacto_direccion || '',
        redes_sociales: data.redes_sociales || '',
        moneda: data.moneda || 'USD', // Valor por defecto
        impuestos_activos: data.impuestos_activos || false,
        porcentaje_impuesto: data.porcentaje_impuesto || 0,
        metodos_pago: data.metodos_pago || [],
        opciones_envio: data.opciones_envio || [],
        costo_envio_estandar: data.costo_envio_estandar || 0,
        envio_gratis_desde: data.envio_gratis_desde || undefined, // Puede ser undefined si no aplica
      });
    } catch (err) {
      // setError('Error al cargar la configuración: ' + (err instanceof Error ? err.message : String(err))); // Comentado para ocultar error
      console.error('Error fetching configuracion:', err); // Mantener el log de error
      // Establecer un estado inicial por defecto más completo en caso de error
      setConfig({
        nombre_tienda: '',
        descripcion_tienda: '',
        contacto_email: '',
        contacto_telefono: '',
        contacto_direccion: '',
        redes_sociales: '',
        moneda: 'USD',
        impuestos_activos: false,
        porcentaje_impuesto: 0,
        metodos_pago: [],
        opciones_envio: [],
        costo_envio_estandar: 0,
        envio_gratis_desde: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | boolean = value;

    // Convertir a número si es necesario
    if (type === 'number') {
      processedValue = value === '' ? '' : parseFloat(value); // Mantener vacío o convertir a float
      // Manejar caso de campo opcional que puede quedar vacío (ej. envio_gratis_desde)
      if (name === 'envio_gratis_desde' && value === '') {
        processedValue = undefined;
      }
    }

    setConfig(prevConfig => prevConfig ? { ...prevConfig, [name]: processedValue } : null);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, value } = e.target;

    // Manejar checkboxes individuales (como impuestos_activos)
    if (value === 'on' || value === 'off' || value === '') { // Checkbox simple
        setConfig(prevConfig => prevConfig ? { ...prevConfig, [name]: checked } : null);
        return;
    }

    // Manejar grupo de checkboxes (como metodos_pago)
    setConfig(prevConfig => {
      if (!prevConfig) return null;
      let currentValues = prevConfig[name as keyof ConfiguracionData] as string[];
      if (!Array.isArray(currentValues)) currentValues = []; // Asegurar que sea un array

      if (checked) {
        return { ...prevConfig, [name]: [...currentValues, value] };
      } else {
        return { ...prevConfig, [name]: currentValues.filter(item => item !== value) };
      }
    });
  };

  // TODO: Añadir manejo para opciones de envío (más complejo, quizás un array de objetos)
  // Se podría tener una función específica handleEnvioChange si la estructura es compleja

  const handleGrantAdmin = async () => {
    if (!adminEmail) {
      setError('Por favor, introduce el correo electrónico del usuario.');
      setTimeout(() => setError(null), 5000);
      return;
    }

    if (!window.confirm(`¿Está seguro de que desea otorgar privilegios de administrador a ${adminEmail}?`)) {
      return;
    }

    setSaving(true); // Indicar que se está procesando
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/php/otorgar_admin.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: adminEmail }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Error HTTP: ${response.status}`);
      }

      if (result.status === 'success') {
        setSuccessMessage(result.message);
        setAdminEmail(''); // Limpiar campo en éxito
      } else if (result.status === 'warning') {
        setError(result.message); // Mostrar advertencia como error o mensaje informativo
      } else {
        throw new Error(result.message || 'Error desconocido al otorgar admin.');
      }

    } catch (err) {
      setError('Error al otorgar admin: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error granting admin:', err);
    } finally {
      setSaving(false);
      // Ocultar mensajes después de unos segundos
      setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 7000); // Dar un poco más de tiempo para leer el mensaje
    }
  };

  // Placeholder para la función de cambiar color
  const handleChangeColor = async () => {
    console.log(`Intentando cambiar color primario a: ${primaryColor}`);
    // Aquí iría la lógica para llamar al backend (ej. /php/cambiar_color_tema.php)
    // try { ... fetch ... } catch { ... }
    // También se necesitaría lógica para aplicar el color en el frontend (CSS variables, etc.)
    setSuccessMessage(`Funcionalidad "Cambiar Color" pendiente de implementación en backend y frontend para ${primaryColor}.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // Función para navegar a la página de usuarios
  const handleNavigateToUsuarios = () => {
    navigate('/admin/usuarios'); // Ajusta la ruta si es diferente
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!config) return;

    // Validaciones básicas (ejemplo)
    if (config.impuestos_activos && (config.porcentaje_impuesto === undefined || config.porcentaje_impuesto <= 0)) {
        setError('Si los impuestos están activos, debe especificar un porcentaje mayor a 0.');
        setTimeout(() => setError(null), 5000);
        return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Preparar datos para enviar (ej. convertir undefined a null si la API lo requiere)
      const configToSend = { ...config };
      if (configToSend.envio_gratis_desde === undefined) {
        configToSend.envio_gratis_desde = null; // O el valor que espere tu backend
      }
      if (!configToSend.impuestos_activos) {
        configToSend.porcentaje_impuesto = null; // O 0, según backend
      }

      const response = await fetch('/php/guardar_configuracion.php', { // Ajusta la ruta
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configToSend), // Enviar datos preparados
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error HTTP: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        setSuccessMessage('Configuración guardada correctamente.');
        // Opcional: volver a cargar la configuración para asegurar consistencia
        // fetchConfiguracion();
      } else {
        throw new Error(result.message || 'Error al guardar la configuración desde el backend');
      }
    } catch (err) {
      setError('Error al guardar la configuración: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error saving configuracion:', err);
    } finally {
      setSaving(false);
      // Ocultar mensajes después de unos segundos
      setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 5000);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-custom-dark-grey">Cargando configuración...</div>;
  }

  // No mostrar error si hay datos cargados (puede ser un error al guardar)
  // if (error && !config) { ... }

  if (!config) {
    // Estado si fetch falló y no se pudo poner config por defecto
    return (
        <div className="p-6 bg-custom-grey min-h-screen">
            <h1 className="text-3xl font-bold text-custom-dark mb-6">Configuración</h1>
            <div className="bg-red-100 border-l-4 border-custom-red text-custom-red px-4 py-3 rounded mb-6 shadow" role="alert">
                <p className="font-bold">Error Crítico</p>
                <p>{error || 'No se pudo cargar la configuración inicial.'}</p>
            </div>
        </div>
    );
  }

  return (
    <div className="p-6 bg-custom-grey min-h-screen">
      <h1 className="text-3xl font-bold text-custom-dark mb-6">Configuración</h1>

      {/* Mensajes de estado */}
      {error && (
        <div className="bg-red-100 border-l-4 border-custom-red text-custom-red px-4 py-3 rounded mb-6 shadow" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-6 shadow" role="alert">
          <p className="font-bold">Éxito</p>
          <p>{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Sección Configuración General */}
        <div className="bg-custom-light p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold text-custom-dark mb-4 flex items-center">
            <FiSettings className="mr-2 text-custom-dark-grey" /> Configuración General
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre Tienda */}
            <div>
              <label className="block text-custom-dark text-sm font-bold mb-2" htmlFor="nombre_tienda">
                Nombre de la Tienda
              </label>
              <input
                type="text"
                id="nombre_tienda"
                name="nombre_tienda"
                value={config.nombre_tienda}
                onChange={handleInputChange}
                required // Campo requerido
                className="shadow-sm appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 text-custom-dark bg-custom-grey leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
              />
            </div>
            {/* Email Contacto */}
            <div>
              <label className="block text-custom-dark text-sm font-bold mb-2" htmlFor="contacto_email">
                Correo Electrónico de Contacto
              </label>
              <input
                type="email"
                id="contacto_email"
                name="contacto_email"
                value={config.contacto_email}
                onChange={handleInputChange}
                required
                className="shadow-sm appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 text-custom-dark bg-custom-grey leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
              />
            </div>
            {/* Descripción Tienda */}
            <div className="md:col-span-2">
              <label className="block text-custom-dark text-sm font-bold mb-2" htmlFor="descripcion_tienda">
                Descripción de la Tienda
              </label>
              <textarea
                id="descripcion_tienda"
                name="descripcion_tienda"
                value={config.descripcion_tienda}
                onChange={handleInputChange}
                rows={3}
                className="shadow-sm appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 text-custom-dark bg-custom-grey leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
              />
            </div>
            {/* Teléfono Contacto */}
            <div>
              <label className="block text-custom-dark text-sm font-bold mb-2" htmlFor="contacto_telefono">
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                id="contacto_telefono"
                name="contacto_telefono"
                value={config.contacto_telefono}
                onChange={handleInputChange}
                className="shadow-sm appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 text-custom-dark bg-custom-grey leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
              />
            </div>
            {/* Dirección */}
            <div>
              <label className="block text-custom-dark text-sm font-bold mb-2" htmlFor="contacto_direccion">
                Dirección
              </label>
              <input
                type="text"
                id="contacto_direccion"
                name="contacto_direccion"
                value={config.contacto_direccion}
                onChange={handleInputChange}
                className="shadow-sm appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 text-custom-dark bg-custom-grey leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
              />
            </div>
            {/* Moneda */}
            <div>
              <label className="block text-custom-dark text-sm font-bold mb-2" htmlFor="moneda">
                Moneda Principal
              </label>
              <select
                id="moneda"
                name="moneda"
                value={config.moneda}
                onChange={handleInputChange}
                required
                className="shadow-sm appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 text-custom-dark bg-custom-grey leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="COP">COP ($)</option>
                {/* Añadir más monedas según sea necesario */}
              </select>
            </div>
            {/* Impuestos */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="impuestos_activos"
                  name="impuestos_activos"
                  checked={config.impuestos_activos}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-custom-blue focus:ring-custom-blue border-custom-dark-grey rounded mr-2"
                />
                <label htmlFor="impuestos_activos" className="text-custom-dark text-sm font-bold">Activar Impuestos</label>
              </div>
              {config.impuestos_activos && (
                <div className="flex-1">
                  <label className="block text-custom-dark text-sm font-bold mb-2" htmlFor="porcentaje_impuesto">
                    Porcentaje Impuesto (%)
                  </label>
                  <input
                    type="number"
                    id="porcentaje_impuesto"
                    name="porcentaje_impuesto"
                    value={config.porcentaje_impuesto ?? ''} // Mostrar vacío si es 0 o undefined
                    onChange={handleInputChange}
                    min="0.01" // Mínimo si está activo
                    step="0.01"
                    required={config.impuestos_activos} // Requerido solo si los impuestos están activos
                    className="shadow-sm appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 text-custom-dark bg-custom-grey leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
                  />
                </div>
              )}
            </div>
            {/* Redes Sociales */}
            <div className="md:col-span-2">
              <label className="block text-custom-dark text-sm font-bold mb-2" htmlFor="redes_sociales">
                Redes Sociales (URLs, una por línea)
              </label>
              <textarea
                id="redes_sociales"
                name="redes_sociales"
                value={config.redes_sociales}
                onChange={handleInputChange}
                rows={3}
                placeholder="https://facebook.com/tu_pagina\nhttps://instagram.com/tu_perfil"
                className="shadow-sm appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 text-custom-dark bg-custom-grey leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Sección Configuración de Pago */}
        <div className="bg-custom-light p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold text-custom-dark mb-4 flex items-center">
            <FiCreditCard className="mr-2 text-custom-blue" /> Configuración de Pago
          </h2>
          <div className="space-y-2 mb-4">
            <p className="text-custom-dark text-sm font-bold mb-2">Métodos de Pago Disponibles:</p>
            {/* Checkboxes para métodos de pago */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pago_paypal"
                name="metodos_pago"
                value="paypal"
                checked={config.metodos_pago.includes('paypal')}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-custom-blue focus:ring-custom-blue border-custom-dark-grey rounded mr-2"
              />
              <label htmlFor="pago_paypal" className="text-custom-dark">PayPal</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pago_stripe"
                name="metodos_pago"
                value="stripe"
                checked={config.metodos_pago.includes('stripe')}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-custom-blue focus:ring-custom-blue border-custom-dark-grey rounded mr-2"
              />
              <label htmlFor="pago_stripe" className="text-custom-dark">Stripe (Tarjeta de Crédito)</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pago_transferencia"
                name="metodos_pago"
                value="transferencia"
                checked={config.metodos_pago.includes('transferencia')}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-custom-blue focus:ring-custom-blue border-custom-dark-grey rounded mr-2"
              />
              <label htmlFor="pago_transferencia" className="text-custom-dark">Transferencia Bancaria</label>
            </div>
            {/* Añade más métodos según sea necesario */}
          </div>
          {/* Aquí podrías añadir campos para claves API si es necesario, manejándolos con cuidado */}
          {/* Ejemplo: Campos para Stripe (solo si Stripe está activo) */}
          {config.metodos_pago.includes('stripe') && (
            <div className="mt-4 pt-4 border-t border-custom-dark-grey">
              <h3 className="text-lg font-medium text-custom-dark mb-2">Configuración Stripe</h3>
              <div>
                <label className="block text-custom-dark text-sm font-bold mb-2" htmlFor="stripe_publishable_key">
                  Clave Publicable Stripe
                </label>
                <input
                  type="text"
                  id="stripe_publishable_key"
                  name="stripe_publishable_key" // Asegúrate que este nombre exista en ConfiguracionData si lo usas
                  // value={config.stripe_publishable_key || ''} // Descomentar si añades el campo a la interfaz
                  // onChange={handleInputChange}
                  placeholder="pk_test_..."
                  className="shadow-sm appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 text-custom-dark bg-custom-grey leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
                />
              </div>
              <div className="mt-2">
                <label className="block text-custom-dark text-sm font-bold mb-2" htmlFor="stripe_secret_key">
                  Clave Secreta Stripe
                </label>
                <input
                  type="password" // Usar password para ocultar
                  id="stripe_secret_key"
                  name="stripe_secret_key" // Asegúrate que este nombre exista en ConfiguracionData si lo usas
                  // value={config.stripe_secret_key || ''} // Descomentar si añades el campo a la interfaz
                  // onChange={handleInputChange}
                  placeholder="sk_test_..."
                  className="shadow-sm appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 text-custom-dark bg-custom-grey leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
                />
                <p className="text-xs text-custom-dark-grey mt-1">La clave secreta no se mostrará después de guardarla por seguridad.</p>
              </div>
            </div>
          )}
          {/* Añadir configuraciones para otros métodos de pago si es necesario */}
        </div>

        {/* Sección Configuración de Envío */}
        <div className="bg-custom-light p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold text-custom-dark mb-4 flex items-center">
            <FiTruck className="mr-2 text-custom-orange" /> Configuración de Envío
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-custom-dark text-sm font-bold mb-2" htmlFor="costo_envio_estandar">
                Costo de Envío Estándar ({config.moneda})
              </label>
              <input
                type="number"
                id="costo_envio_estandar"
                name="costo_envio_estandar"
                value={config.costo_envio_estandar ?? ''}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="Ej: 5.00"
                className="shadow-sm appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 text-custom-dark bg-custom-grey leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-custom-dark text-sm font-bold mb-2" htmlFor="envio_gratis_desde">
                Envío Gratis Desde ({config.moneda}) (Opcional)
              </label>
              <input
                type="number"
                id="envio_gratis_desde"
                name="envio_gratis_desde"
                value={config.envio_gratis_desde ?? ''} // Mostrar vacío si es undefined
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="Ej: 50.00 (dejar vacío si no aplica)"
                className="shadow-sm appearance-none border border-custom-dark-grey rounded w-full py-2 px-3 text-custom-dark bg-custom-grey leading-tight focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-custom-dark-grey mb-2">(Gestión detallada de zonas y tarifas de envío pendiente de implementación)</p>
            {/* Aquí se podría añadir una tabla o lista para config.opciones_envio si se implementa */}
          </div>
        </div>

        {/* Sección Configuración de Usuarios (Placeholder/Enlace) */}
        <div className="bg-custom-light p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold text-custom-dark mb-4 flex items-center">
            <FiUsers className="mr-2 text-custom-blue" /> Configuración de Usuarios
          </h2>
          <p className="text-custom-dark-grey">
            La gestión de roles y permisos se realiza en la sección{' '}
            <Link to="/usuarios" className="text-custom-blue hover:underline">Usuarios</Link>.
          </p>
        </div>

        {/* Botón de Guardar */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving || loading} // Deshabilitar si está cargando o guardando
            className={`bg-custom-blue hover:bg-custom-light-blue text-custom-light font-bold py-2 px-6 rounded-lg shadow flex items-center transition duration-150 ease-in-out ${saving || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FiSave className="mr-2" /> {saving ? 'Guardando...' : 'Guardar Configuración General'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Configuracion;
