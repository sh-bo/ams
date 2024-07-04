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
import GlobalAdminDashboard from './Pages/GlobalAdminPortal/GlobalAdminDashboard';
import GlobalAdminVendor from './Pages/GlobalAdminPortal/GlobalAdminVendor';
import GlobalAdminOrder from './Pages/GlobalAdminPortal/GlobalAdminOrder';
import GlobalAdminEmployees from './Pages/GlobalAdminPortal/GlobalAdminEmployees';
import GlobalAdminAddEmployees from './Pages/GlobalAdminPortal/GlobalAdminAddEmployees';
import GlobalAdminRequest from './Pages/GlobalAdminPortal/GlobalAdminRequest';

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
          <Route path='/portal/globalAdmin/dashboard' element={<GlobalAdminDashboard />}/>
          <Route path='/portal/globalAdmin/vendors' element={<GlobalAdminVendor />}/>
          <Route path='/portal/globalAdmin/orders' element={<GlobalAdminOrder />}/>
          <Route path='/portal/globalAdmin/employees' element={<GlobalAdminEmployees />}/>
          <Route path='/portal/globalAdmin/addEmployee' element={<GlobalAdminAddEmployees />}/>
          <Route path='/portal/globalAdmin/requests' element={<GlobalAdminRequest />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
