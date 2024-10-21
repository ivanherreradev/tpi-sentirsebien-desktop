import React, { useEffect, useState } from 'react';
import { API } from '../../../utils/constants';
import './AppointmentList.css';
import { formatDate } from '../../../utils/formatDate';

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Fetching data for appointments, professionals, and services
  useEffect(() => {
    fetch(`${API}/api/Reservation/Get`)
      .then((response) => response.json())
      .then((data) => {
        setAppointments(data.$values);
      })
      .catch((error) =>
        console.error('Error fetching appointment data:', error)
      );

    fetch(`${API}/api/Employee/GetProfessionals`)
      .then((response) => response.json())
      .then((data) => {
        setProfessionals(data.$values);
      })
      .catch((error) => console.error('Error fetching professionals:', error));

    fetch(`${API}/api/ServiceDetails/Get`)
      .then((response) => response.json())
      .then((data) => {
        setServices(data.$values);
      })
      .catch((error) => console.error('Error fetching services:', error));
  }, []);

  // Handle filtering
  const handleFilter = (event) => {
    const { name, value } = event.target;
    if (name === 'professional') {
      const selectedProf = professionals.find(
        (prof) => `${prof.name} ${prof.lastName}` === value
      );
      setSelectedProfessional(
        selectedProf ? `${selectedProf.name} ${selectedProf.lastName}` : ''
      );
    } else if (name === 'service') {
      const selectedServ = services.find((serv) => serv.name === value);
      setSelectedService(selectedServ ? selectedServ.name : '');
    } else if (name === 'time') {
      setSelectedTime(value);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesProfessional =
      !selectedProfessional ||
      `${appointment.employeeName}` === selectedProfessional;

    const matchesService =
      !selectedService ||
      (appointment.serviceDetail &&
        appointment.serviceDetail.name === selectedService);

    const appointmentHour = new Date(appointment.startDate).getHours();
    const matchesTime =
      !selectedTime || appointmentHour === parseInt(selectedTime);

    return matchesProfessional && matchesService && matchesTime;
  });

  return (
    <div className='container'>
      <h2>HISTORIAL DE TURNOS</h2>
      <div className='appointment-list'>
        <div className='input-group'>
          <label htmlFor='professional-select'>Profesional:</label>
          <select
            id='professional-select'
            name='professional'
            onChange={handleFilter}
          >
            <option value=''>Todos</option>
            {professionals.map((professional) => (
              <option
                key={professional.id}
                value={`${professional.name} ${professional.lastName}`}
              >
                {professional.name} {professional.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className='input-group'>
          <label htmlFor='service-select'>Servicio:</label>
          <select id='service-select' name='service' onChange={handleFilter}>
            <option value=''>Todos</option>
            {services.map((service) => (
              <option key={service.id} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div className='input-group'>
          <label htmlFor='time-select'>Horario:</label>
          <select id='time-select' name='time' onChange={handleFilter}>
            <option value=''>Todos</option>
            {[9, 10, 11, 12, 13, 16, 17, 18, 19, 20].map((hour) => (
              <option key={hour} value={hour}>
                {hour}:00
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className='table'>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Correo Electrónico</th>
            <th>Turno</th>
            <th>Empleado asignado</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.clientName}</td>
              <td>{appointment.clientEmail}</td>
              <td>
                {appointment.serviceDetail ? (
                  <div style={{ marginBottom: '10px' }}>
                    <p>
                      <strong>Servicio:</strong>{' '}
                      {appointment.serviceDetail.name || 'N/A'}
                    </p>
                    <p>
                      <strong>Fecha:</strong>{' '}
                      {formatDate(appointment.startDate)}
                    </p>
                    <p>
                      <strong>Pagado:</strong> {appointment.paid ? 'Sí' : 'No'}
                    </p>
                  </div>
                ) : (
                  'Sin turnos'
                )}
              </td>
              <td>
                {appointment.employeeName ? appointment.employeeName : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
