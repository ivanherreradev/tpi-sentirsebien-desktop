  import React, { useState } from 'react';
  import { useUser } from '../../context/UserContext';
  import Input from '../../components/Input/Input';
  import { Link, useNavigate } from 'react-router-dom';
  import './Profile.css';
  import toast from 'react-hot-toast';
  import { API } from '../../utils/constants';

  export default function Profile() {
    const { user } = useUser();
    const [role, setRole] = useState(user.role);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
      name: user.user.name,
      lastName: user.user.lastName,
      email: user.user.email,
      address: user.user.address,
      city: user.user.city,
      province: user.user.province,
      phoneNumber: user.user.phoneNumber,
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent default form submission
    
      const updatedFields = {
        name: user.user.name,
        lastName: user.user.lastName,
        email: user.user.email,
        address: user.user.address,
        city: user.user.city,
        province: user.user.province,
        phoneNumber: user.user.phoneNumber,
      };
    
      let hasChanges = false;
      for (const key in formData) {
        if (formData[key] !== user.user[key]) {
          updatedFields[key] = formData[key];
          hasChanges = true;
        }
      }
    
      if (!hasChanges) {
        toast.error('No hay cambios que guardar');
        return;
      }
    
      try {
        const response = await fetch(
          `${API}/api/Authentication/Update?isEmployee=${role !== 'Cliente' ? true : false}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFields),
          }
        );
    
        // Handle the response
        const contentType = response.headers.get('content-type');
        let responseData;
    
        // Check if response is JSON or plain text
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text(); // Fallback to plain text
        }
    
        if (!response.ok) {
          throw new Error(responseData.message || responseData); // Use plain text or JSON message
        }
    
        toast.success(responseData.message || 'Perfil actualizado correctamente!');

        toast('Debes iniciar sesión de nuevo para ver los cambios', {
          icon: '🔐',
          duration: 4000,
        });
  
        setTimeout(() => {
          navigate('/login'); // Redirect to login after showing the toast
        }, 2000); // Wait for 3 seconds to let the toast show up before redirecting
    
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error(`Error: ${error.message}`);
      }
    };
    

    return (
      <div className='container profile'>
        <h2>PANEL PERSONAL</h2>
        <form onSubmit={handleSubmit}>
          <Input
            name='name'
            type='text'
            label='Nombre'
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            name='lastName'
            type='text'
            label='Apellido'
            value={formData.lastName}
            onChange={handleChange}
          />
          <Input
            name='email'
            type='email'
            label='Correo electrónico'
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            name='address'
            type='text'
            label='Dirección'
            value={formData.address}
            onChange={handleChange}
          />
          <Input
            name='city'
            type='text'
            label='Ciudad'
            value={formData.city}
            onChange={handleChange}
          />
          <Input
            name='province'
            type='text'
            label='Provincia'
            value={formData.province}
            onChange={handleChange}
          />
          <Input
            name='phoneNumber'
            type='text'
            label='Número de teléfono'
            value={formData.phoneNumber || ''}
            onChange={handleChange}
          />
          <div>
            <button type='submit' className='btn-success'>
              Guardar cambios
            </button>
            <Link to='/' className='btn-link'>
              Volver
            </Link>
          </div>
        </form>
      </div>
    );
  }
