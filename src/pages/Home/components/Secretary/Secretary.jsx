import React, { useEffect, useState } from 'react';
import { getFormattedDate } from '../../../../utils/getFormattedDate';
import PaymentModal from '../../../../components/PaymentModal/PaymentModal';
import { API } from '../../../../utils/constants';
import { formatDateHours } from '../../../../utils/formatDateHours';
import toast from 'react-hot-toast';

export default function Secretary() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [secretaryAppointments, setSecretaryAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `${API}/api/Reservation/GetTodayForEmployees`
      );
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

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
    setPaymentMethod(''); // Reiniciar el método de pago cuando se abra el modal
    setCardNumber(''); // Reiniciar el número de tarjeta
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handlePaymentSubmit = (method, card) => {
    // Aquí podrías implementar la lógica para registrar el pago
    alert(
      `Pago registrado para ${selectedAppointment.client} con ${method}${
        method === 'Tarjeta' ? `, tarjeta: ${card}` : ''
      }`
    );
    closeModal();
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div>
      <h4 style={{ margin: '10px 0', textAlign: 'center' }}>
        Citas programadas para hoy {getFormattedDate()}:
      </h4>

      <table className='table'>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Servicio</th>
            <th>Profesional a cargo</th>
            <th>Horario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {secretaryAppointments.map((appointment, index) => (
            <tr key={appointment.id}>
              <td>{appointment.clientName}</td>
              <td>{appointment.serviceDetail.name}</td>
              <td>{appointment.employeeName}</td>
              <td>{formatDateHours(appointment.startDate)}</td>
              <td>
                {!appointment.paid && (
                  <div style={{ display: 'flex' }}>
                    <button
                      className='btn-success'
                      style={{ margin: '3px' }}
                      onClick={() => openModal(appointment)}
                    >
                      Registrar pago
                    </button>
                    <button
                      className='btn-danger'
                      style={{ margin: '3px' }}
                      onClick={() => cancelAppointment(appointment.id)}
                    >
                      Cancelar turno
                    </button>
                  </div>
                )}
                <p>{appointment.paid && 'Pagado'}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para registrar pago */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handlePaymentSubmit}
        appointment={selectedAppointment}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        fetchAppointments={fetchAppointments} // Pasa la función aquí
      />
    </div>
  );
}
