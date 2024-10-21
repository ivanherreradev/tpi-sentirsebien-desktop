import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Register from './pages/Register/Register';
import Appointments from './pages/Client/Appointments/Appointments';
import Payments from './pages/Secretary/Payments';
import ClientList from './pages/Admin/ClientsList/ClientList';
import Income from './pages/Admin/Income/Income';
import ClientDetails from './pages/Admin/ClientDetails/ClientDetails';
import AppointmentList from './pages/Admin/AppointmentList/AppointmentList';
import ManageEmployee from './pages/Admin/ManageEmployee/ManageEmployee';
import ProfessionalAppointments from './pages/Profesional/ProfessionalAppointments/ProfessionalAppointments';
import ProfessionalServices from './pages/Admin/Services/Services';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' exact element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/client/appointments' element={<Appointments />} />
          <Route
            path='/professional/appointments'
            element={<ProfessionalAppointments />}
          />
          <Route path='/secretary/payments' element={<Payments />} />
          <Route path='/admin/client-list' element={<ClientList />} />
          <Route
            path='/admin/appointments-list'
            element={<AppointmentList />}
          />
          <Route path='/admin/income' element={<Income />} />
          <Route path='/admin/services' element={<ProfessionalServices />} />
          <Route
            path='/admin/client-details/:email'
            element={<ClientDetails />}
          />
          <Route path='/admin/manage-employees' element={<ManageEmployee />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
