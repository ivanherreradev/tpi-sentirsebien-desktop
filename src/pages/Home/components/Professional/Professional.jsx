import React, { useEffect, useState } from 'react';
import { getFormattedDate } from '../../../../utils/getFormattedDate';
import { API } from '../../../../utils/constants';
import { useUser } from '../../../../context/UserContext';
import { formatDate } from '../../../../utils/formatDate';
import { formatDateHours } from '../../../../utils/formatDateHours';

export default function Professional() {
  const { user } = useUser();
  const [role, setRole] = useState(user.role);
  const [profesionalAppointments, setUserProfesionalAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `${API}/api/Reservation/GetForToday/${user.user.email}-${
            role !== 'Cliente' ? true : false
          }`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data.reservations.$values)
        setUserProfesionalAppointments(data.reservations.$values);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div >
      <h4 style={{ margin: '10px 0', textAlign: 'center' }}>
        Citas programadas para hoy {getFormattedDate()}:
      </h4>

      <table className='table'>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Servicio</th>
            <th>Horario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesionalAppointments.map((appointment, index) => (
            <tr key={index}>
              <td>{appointment.clientName}</td>
              <td>{appointment.serviceDetail.name}</td>
              <td>{formatDateHours(appointment.startDate)}</td>
              <td>{appointment.paid ? 'Pagado' : 'N/A'}</td>
              <td>
                {!appointment.paid && (
                  <button className='btn-danger' style={{margin: '5px'}}>Cancelar turno</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
