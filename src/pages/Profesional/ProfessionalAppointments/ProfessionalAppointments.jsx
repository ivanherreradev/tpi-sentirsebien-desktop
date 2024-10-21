import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import { API } from '../../../utils/constants';
import { formatDate } from '../../../utils/formatDate';
import toast from 'react-hot-toast';

export default function ProfessionalAppointments() {
  const { user } = useUser();
  const [role, setRole] = useState(user.role);
  const [profesionalAppointments, setUserProfesionalAppointments] = useState(
    []
  );
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `${API}/api/Reservation/Get/${user.user.email}-${
          role !== 'Cliente' ? true : false
        }`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data.reservations.$values);
      setUserProfesionalAppointments(data.reservations.$values);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    console.log('hola');
    try {
      const response = await fetch(`${API}/api/Reservation/Delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }
      toast.success('Turno cancelado con éxito.');
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Error al cancelar el turno.');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className='container'>
      <h2>
        Historial de citas de {user.user.name} {user.user.lastName}
      </h2>

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
          {profesionalAppointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.clientName}</td>
              <td>{appointment.serviceDetail.name}</td>
              <td>{formatDate(appointment.startDate)}</td>
              <td>
                {appointment.isDeleted
                  ? 'Cancelado'
                  : appointment.paid
                  ? 'Pagado'
                  : 'Pendiente'}
              </td>
              <td>
                {!appointment.paid && !appointment.isDeleted && (
                  <button
                    className='btn-danger'
                    style={{ margin: '5px' }}
                    onClick={() => cancelAppointment(appointment.id)}
                  >
                    Cancelar turno
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
