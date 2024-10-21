import React from 'react'

export default function SecretaryAppointments() {
  const appointments = [
    {
      service: 'Masajes: Anti-stress',
      client: 'Juan Pérez',
      time: '09:30',
      paid: false,
      paymentMethod: null, // No pagado, no hay método de pago
      employee: 'Profesional 1'
    },
    {
      service: 'Belleza: Lifting de pestaña',
      client: 'María Gómez',
      time: '11:00',
      paid: true,
      paymentMethod: 'Tarjeta', // Método de pago: Tarjeta
      employee: 'Profesional 1'
    },
    {
      service: 'Tratamientos Faciales: Limpieza profunda + Hidratación',
      client: 'Carlos López',
      time: '17:00',
      paid: false,
      paymentMethod: null, // No pagado, no hay método de pago
      employee: 'Profesional 4'
    },
    {
      service: 'Tratamientos Corporales: VelaSlim',
      client: 'Laura Fernández',
      time: '18:30',
      paid: true,
      paymentMethod: 'Efectivo', // Método de pago: Efectivo
      employee: 'Profesional 3'
    },
  ];

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
            <th>Profesional a cargo</th>
            <th>Horario</th>
            <th>Medio de Pago</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={index}>
              <td>{appointment.client}</td>
              <td>{appointment.service}</td>
              <td>{appointment.employee}</td>
              <td>{appointment.time}</td>
              <td>{appointment.paid ? appointment.paymentMethod : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
