import React from 'react';
import { toast } from 'react-hot-toast'; // Importa toast
import './PaymentModal.css'; // Asegúrate de que la ruta sea correcta
import { API } from '../../utils/constants';

const PaymentModal = ({
  isOpen,
  onClose,
  appointment,
  paymentMethod,
  setPaymentMethod,
  cardNumber,
  setCardNumber,
  fetchAppointments, // Prop para volver a hacer el fetch de turnos
}) => {
  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      if (paymentMethod === 'Tarjeta' && !cardNumber) {
        toast.error('Por favor, ingrese el número de tarjeta.');
        return;
      }
  
      const requestBody = {
        paymentMethod: paymentMethod,
        cardNumber: cardNumber,
        reservationId: appointment.id,
      };
  
      const response = await fetch(`${API}/api/Invoices/Post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const text = await response.text(); // Obtén el texto primero
      console.log('Cuerpo de la respuesta:', text); // Verifica qué se devuelve
      
      toast.success(text)

      onClose(); // Cierra el modal

      // Recargar los pagos en la vista principal
      fetchAppointments();
    } catch (error) {
      console.error('Error al analizar JSON:', error);
      toast.error('El servidor devolvió un error no válido.');
      return; // Termina si no puedes analizar el JSON
    }
  };

  return (
    <div className='overlay'>
      <div className='modal'>
        <h2>Registrar Pago</h2>
        {appointment && (
          <>
            <p>
              Cliente: <strong>{appointment.client}</strong>
            </p>
            <p>
              Servicio: <strong>{appointment.service}</strong>
            </p>
            <label>
              <input
                type='radio'
                name='paymentMethod'
                value='Efectivo'
                checked={paymentMethod === 'Efectivo'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />{' '}
              Efectivo
            </label>
            <label>
              <input
                type='radio'
                name='paymentMethod'
                value='Tarjeta'
                checked={paymentMethod === 'Tarjeta'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />{' '}
              Tarjeta
            </label>

            {paymentMethod === 'Tarjeta' && (
              <>
                <label>
                  Número de tarjeta:
                  <input
                    type='text'
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </label>
              </>
            )}

            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <button className='btn-success' onClick={handleSubmit}>
                Confirmar Pago
              </button>
              <button
                className='btn-danger'
                style={{ marginLeft: '10px' }}
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
