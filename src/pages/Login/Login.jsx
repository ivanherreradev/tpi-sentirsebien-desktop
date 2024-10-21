import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import toast from 'react-hot-toast';
import Input from '../../components/Input/Input';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('Fcolapinto12@gmail.com');
  const [password, setPassword] = useState('123456.Aq');
  const [error, setError] = useState(null);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    if (!result.success) {
      if (result.errors) {
        Object.keys(result.errors).forEach((key) => {
          const messages = result.errors[key];

          if (Array.isArray(messages)) {
            messages.forEach((message) => {
              toast.error(message);
            });
          } else {
            toast.error(messages);
          }
        });
      } else {
        toast.error('Inicio de sesión fallido. Intente nuevamente!');
      }
    } else {
      toast.success('Ha iniciado sesión correctamente');

      setTimeout(() => {
        navigate(`/`);
      }, 2000);
    }
  };

  return (
    <div className='container login'>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className='login-form'>
        <Input
          name='email'
          type='email'
          label='CORREO ELECTRÓNICO'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          name='password'
          type='password'
          label='CONTRASEÑA'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className='error-message'>{error}</p>}{' '}
        <button type='submit' className='btn-success'>
          Ingresar
        </button>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            margin: '15px auto',
          }}
        >
          <p>¿No tienes cuenta aún?</p>
          <Link to='/register'>Registrate aqui</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
