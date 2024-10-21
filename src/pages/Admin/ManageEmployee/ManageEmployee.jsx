import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../../../components/Input/Input';
import { API, provinciasConCiudades } from '../../../utils/constants';

export default function ManageEmployee() {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    dni: '',
    address: '',
    phoneNumber: '',
    city: '',
    province: '',
    employeeType: '', // Added employee type
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setFormData({
      ...formData,
      province: selectedProvince,
      city: '',
    });
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setFormData({
      ...formData,
      city: selectedCity,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verify if all fields are filled
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        toast.error(`El campo ${key} es obligatorio.`);
        return;
      }
    }

    // Verify if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    // Validate DNI
    const dniRegex = /^\d{8}$/;
    if (!dniRegex.test(formData.dni)) {
      toast.error('El DNI debe ser un número de 8 dígitos.');
      return;
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error('El número de teléfono debe ser un número de 10 dígitos.');
      return;
    }

    try {
      // Perform the POST request
      const response = await fetch(
        `${API}/api/Authentication/RegisterEmployee?role=${formData.employeeType}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      // Check the response
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al registrar el empleado.');
        return;
      }

      toast.success('Empleado registrado correctamente.');
    } catch (error) {
      toast.error('Error en la conexión. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className='container register'>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <Input
          name='name'
          type='text'
          label='NOMBRE'
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          name='lastName'
          type='text'
          label='APELLIDO'
          value={formData.lastName}
          onChange={handleChange}
        />

        <Input
          name='emailAddress'
          type='email'
          label='CORREO ELECTRÓNICO'
          value={formData.emailAddress}
          onChange={handleChange}
        />

        <Input
          name='dni'
          type='text'
          label='DNI'
          value={formData.dni}
          onChange={handleChange}
        />

        <div className='input-group'>
          <label>PROVINCIA</label>
          <select
            name='province'
            value={formData.province}
            onChange={handleProvinceChange}
          >
            <option value=''>Seleccione una provincia</option>
            {Object.keys(provinciasConCiudades).map((provincia) => (
              <option key={provincia} value={provincia}>
                {provincia}
              </option>
            ))}
          </select>
        </div>

        <div className='input-group'>
          <label>CIUDAD</label>
          <select
            name='city'
            value={formData.city}
            onChange={handleCityChange}
            disabled={!formData.province}
          >
            <option value=''>Seleccione una ciudad</option>
            {formData.province &&
              provinciasConCiudades[formData.province].map((ciudad) => (
                <option key={ciudad} value={ciudad}>
                  {ciudad}
                </option>
              ))}
          </select>
        </div>

        <div className='input-group'>
          <label>TIPO DE EMPLEADO</label>
          <select
            name='employeeType'
            value={formData.employeeType}
            onChange={handleChange}
          >
            <option value=''>Seleccione un tipo de empleado</option>
            <option value='Profesional'>Profesional</option>
            <option value='Secretaria'>Secretaria</option>
          </select>
        </div>

        <Input
          name='address'
          type='text'
          label='DIRECCIÓN'
          value={formData.address}
          onChange={handleChange}
        />

        <Input
          name='phoneNumber'
          type='text'
          label='NÚMERO DE TELEFONO'
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <Input
          name='password'
          type='password'
          label='CONTRASEÑA'
          value={formData.password}
          onChange={handleChange}
        />

        <Input
          name='confirmPassword'
          type='password'
          label='CONFIRMAR CONTRASEÑA'
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <div>
          <button type='submit' className='btn-success'>
            Registrarse
          </button>
          <a href='/' className='btn-link' style={{ marginLeft: '10px' }}>
            Volver al inicio
          </a>
        </div>
      </form>
    </div>
  );
}
