import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const ProtectedRoute = ({ element }) => {
  const { user } = useUser();

  return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
