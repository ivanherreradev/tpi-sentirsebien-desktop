import React, { useEffect, useState } from 'react';
import './ClientList.css';
import { formatDate } from '../../../utils/formatDate';
import { API } from '../../../utils/constants';
import { useNavigate } from 'react-router-dom';

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  // Obtener los datos de la API
  useEffect(() => {
    fetch(`${API}/api/Clients/GetWithReservations`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setClients(data.$values);
      })
      .catch((error) => console.error('Error fetching client data:', error));
  }, []);

  const handleDetails = (client) => {
    navigate(`/admin/client-details/${client.emailAddress}`);
  };

  return (
    <div className='container'>
      <h2>Clientes del SPA</h2>

      <table className='table'>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Correo Electrónico</th>
            <th>Último Turno</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr key={index}>
              <td>
                {client.name} {client.lastName}
              </td>
              <td>{client.emailAddress}</td>
              <td>
                {client.reservations ? (
                  <div style={{ marginBottom: '10px' }}>
                    <p>
                      <strong>Servicio:</strong>{' '}
                      {client.reservations.serviceDetail.name || 'N/A'}
                    </p>
                    <p>
                      <strong>Fecha:</strong>{' '}
                      {formatDate(client.reservations.startDate)}
                    </p>
                    <p>
                      <strong>Pagado:</strong>{' '}
                      {client.reservations.paid ? 'Sí' : 'No'}
                    </p>
                  </div>
                ) : (
                  'Sin turnos'
                )}
              </td>
              <td>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    className='btn-info'
                    onClick={() => handleDetails(client)}
                  >
                    Ver detalles
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
