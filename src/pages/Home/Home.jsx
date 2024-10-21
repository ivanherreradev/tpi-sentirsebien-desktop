import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import Client from './components/Client/Client';
import Professional from './components/Professional/Professional';
import Secretary from './components/Secretary/Secretary';

export default function Home() {
  const { user } = useUser();
  const [role, setRole] = useState(user.role);

  return (
    <div className='container'>
      <h2>BIENVENIDO A SENTIRSE BIEN</h2>
      <h4 style={{ marginBottom: '10px' }}>Buenos días {user.user.name} 👋!</h4>

      {role === 'Cliente' && <Client />}
      {role === 'Profesional' && <Professional />}
      {role === 'Secretaria' && <Secretary />}
      {/* {role === 'Dra.Sonrisa' && (
        <>
          <h1>Administrador</h1>
        </>
      )} */}
    </div>
  );
}
