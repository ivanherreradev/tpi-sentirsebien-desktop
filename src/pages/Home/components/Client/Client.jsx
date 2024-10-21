import React, { useEffect, useState } from 'react';
import { useUser } from '../../../../context/UserContext';
import { getFormattedDate } from '../../../../utils/getFormattedDate';
import { API } from '../../../../utils/constants';
import './Client.css';
import toast from 'react-hot-toast';
import { formatDate } from '../../../../utils/formatDate';

export default function Client() {
  const { user } = useUser();
  const [role, setRole] = useState(user.role);
  const [userAppointments, setUserAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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

      console.log(data.reservations.$values);

      setUserAppointments(data.reservations.$values || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
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
  }, [user.user.email, role]);

  return (
    <>
      {loading ? (
        <p>Cargando...</p>
      ) : userAppointments ? (
        <div className='appointment'>
          <h4 style={{ marginBottom: '10px' }}>
            Mis turnos para hoy {getFormattedDate()}:
          </h4>
          <ul className='appointment-list'>
            {userAppointments.map((appointment, index) => (
              <li key={index} className='appointment-item'>
                <p>
                  <strong>Servicio:</strong> {appointment.serviceDetail.name}
                </p>
                <p>{formatDate(appointment.startDate)}</p>
                {appointment.paid && (
                  <>
                    <p>
                      <strong>Estado:</strong> Abonado
                    </p>
                    <p>
                      <strong>Precio:</strong> $
                      {appointment.serviceDetail.price}
                    </p>
                    <p>
                      <strong>Abonaste con:</strong>{' '}
                      {appointment.payment?.method}
                    </p>
                  </>
                )}
                {!appointment.paid && (
                  <>
                    <p>
                      <strong>Estado:</strong> Pendiente
                    </p>
                    <button
                      className='btn-danger'
                      style={{ marginTop: '10px' }}
                      onClick={() => cancelAppointment(appointment.id)}
                    >
                      Cancelar turno
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className='appointment-item'>
          <p>No tienes turnos programados para hoy.</p>
        </div>
      )}
    </>
  );
}
