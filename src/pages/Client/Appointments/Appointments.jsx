import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import { API } from '../../../utils/constants';
import { formatDate } from '../../../utils/formatDate';

export default function Appointments() {
  const { user } = useUser();
  const [role, setRole] = useState(user.role);
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    // Perform the GET request on component mount
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${API}/api/Reservation/Get/${user.user.email}-${role !== 'Cliente' ? true : false}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json(); // Assuming the response is JSON

        setAppointments(data.reservations.$values)
      } catch (error) {
        console.error('There was an error fetching the appointments:', error);
      }
    };

    fetchAppointments();
  }, [role]); // Dependency on 'role'

  return (
    <div className='container'>
      <h2>Historial de turnos de {user.user.name} {user.user.lastName}</h2>

      {appointments.length === 0 ? (
        <p>No tienes turnos en el spa.</p>
      ) : (
        <table className='table'>
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Fecha y Hora</th>
              <th>Estatus</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.$id}>
                {console.log(appointment)}
                <td>{appointment.serviceDetail.name}</td>
                <td>{formatDate(appointment.startDate)}</td>
                <td>{appointment.isDeleted ? 'Cancelado' : appointment.paid ? 'Pagado' : 'Pendiente'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
