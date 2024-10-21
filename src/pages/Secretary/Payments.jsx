import React, { useEffect, useState } from 'react';
import { API } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

export default function Payments() {
  const [secretaryAppointments, setSecretaryAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API}/api/Invoices/Get`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data.$values);
      setSecretaryAppointments(data.$values);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className='container'>
      <h2>HISTORIAL DE PAGOS DE LOS CLIENTES</h2>

      <table className='table'>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Monto</th>
            <th>Medio de Pago</th>
            <th>Fecha de Pago</th>
          </tr>
        </thead>
        <tbody>
          {secretaryAppointments.map((appointment) => (
            <tr key={appointment.id}>
              {console.log(appointment)}
              <td>{appointment.client.name}</td>
              <td>${appointment.totalAmount}</td>
              <td>{appointment.paymentMethod}</td>
              <td>{formatDate(appointment.creationDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
