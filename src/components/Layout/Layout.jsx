import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useUser();
  const [role] = useState(user.role);
  const [isOpen, setIsOpen] = useState(true); // Iniciado en true para que el menú esté abierto por defecto

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='layout'>
      <button className='toggle-menu btn-success' onClick={toggleMenu}>
        {isOpen ? 'Cerrar menú' : 'Menu'}
      </button>

      <aside className={isOpen ? '' : 'closed'}>
        {isOpen && (
          <>
            <ul className='sidemenu'>
              <li>
                <Link to='/'>Inicio</Link>
              </li>
              <li>
                <Link to='/profile'>Ver información</Link>
              </li>
              {role === 'Cliente' && (
                <>
                  <li>
                    <Link to='/client/appointments'>Historial de turnos</Link>
                  </li>
                </>
              )}
              {role === 'Profesional' && (
                <>
                  <li>
                    <Link to='/professional/appointments'>Historial de citas</Link>
                  </li>
                </>
              )}
              {role === 'Secretaria' && (
                <>
                  <li>
                    <Link to='/secretary/payments'>Historial de Pagos</Link>
                  </li>
                </>
              )}
              {role === 'Dra.Sonrisa' && (
                <>
                  <li>
                    <Link to='/admin/client-list'>Listado de Clientes</Link>
                  </li>
                  <li>
                    <Link to='/admin/appointments-list'>Hisotrial de turnos</Link>
                  </li>
                  <li>
                    <Link to='/admin/income'>Informe de Ingresos</Link>
                  </li>
                  <li>
                    <Link to='/admin/services'>Informe de Servicios Realizados</Link>
                  </li>
                  <li>
                    <Link to='/admin/manage-employees'>Gestión de Empleados</Link>
                  </li>
                </>
              )}
            </ul>

            <button className='logOff btn-danger' onClick={logout}>
              Cerrar sesión
            </button>
          </>
        )}
      </aside>

      <main className={isOpen ? '' : 'full-width'}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
