import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../../../utils/constants';
import { useUser } from '../../../context/UserContext';
import './ClientDetails.css'

export default function ClientDetails() {
  const { email } = useParams(); // Obtener el parámetro de la URL
  const [clientDetails, setClientDetails] = useState(null);

  useEffect(() => {
    // Llamada para obtener la información del cliente
    fetch(`${API}/api/Reservation/Get/${email}-false`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setClientDetails(data);
      })
      .catch((error) => console.error('Error fetching client details:', error));
  }, [email]);

  if (!clientDetails) {
    return <div>Cargando...</div>;
  }

  return (
    <div className='container'>
      <h2>Detalles del Cliente</h2>
      <div className='detail'>
        <p>
          <strong>Nombre:</strong> {clientDetails.client.name}{' '}
          {clientDetails.client.lastName}
        </p>
        <p>
          <strong>Email:</strong> {clientDetails.client.emailAddress}
        </p>
        <p>
          <strong>Teléfono:</strong> {clientDetails.client.phoneNumber}
        </p>
      </div>

      <h3 style={{ margin: '20px 0' }}>Historial de Turnos</h3>
      <table className='table'>
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Estado</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {clientDetails.reservations.$values.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.serviceDetail.name}</td>
              <td>
                {reservation.isDeleted
                  ? 'Cancelado'
                  : reservation.paid
                  ? 'Pagado'
                  : 'Pendiente'}
              </td>
              <td>
                ${reservation.paid ? reservation.serviceDetail.price : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
