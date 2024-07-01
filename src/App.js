import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Auth/Login';
import RegisterEmployee from './Auth/RegisterEmployee';
import RegisterVendor from './Auth/RegisterVendor';
import Home from './Pages/Home';
import SuperAdminDashboard from './Pages/SuperAdminPortal/SuperAdminDashboard';
import SuperAdminUsers from './Pages/SuperAdminPortal/SuperAdminUsers';
import SuperAdminEmployees from './Pages/SuperAdminPortal/SuperAdminEmployees';
import SuperAdminVendors from './Pages/SuperAdminPortal/SuperAdminVendors';
import SuperAdminAsset from './Pages/SuperAdminPortal/SuperAdminAsset';
import SuperAdminOrder from './Pages/SuperAdminPortal/SuperAdminOrder';
import SuperAdminRequest from './Pages/SuperAdminPortal/SuperAdminRequest';
import SuperAdminSettings from './Pages/SuperAdminPortal/SuperAdminSettings';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
        <Route path='/' element={<Home />}/>
          <Route path='/auth/login' element={<Login />}/>
          <Route path='/auth/registerEmployee' element={<RegisterEmployee />}/>
          <Route path='/auth/registerVendor' element={<RegisterVendor />}/>
          <Route path='/portal/superAdmin/dashboard' element={<SuperAdminDashboard />}/>
          <Route path='/portal/superAdmin/users' element={<SuperAdminUsers />}/>
          <Route path='/portal/superAdmin/employees' element={<SuperAdminEmployees />}/>
          <Route path='/portal/superAdmin/vendors' element={<SuperAdminVendors />}/>
          <Route path='/portal/superAdmin/assets' element={<SuperAdminAsset />}/>
          <Route path='/portal/superAdmin/orders' element={<SuperAdminOrder />}/>
          <Route path='/portal/superAdmin/requests' element={<SuperAdminRequest />}/>
          <Route path='/portal/superAdmin/settings' element={<SuperAdminSettings />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
