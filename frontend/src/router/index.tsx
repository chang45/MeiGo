import { Route, Routes } from 'react-router-dom';
import StoreLayout from '../layouts/StoreLayout';
import ConsoleLayout from '../layouts/ConsoleLayout';
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Forbidden from '../pages/Forbidden';
import NotFound from '../pages/NotFound';
import ConsumerHome from '../pages/role/ConsumerHome';
import MerchantHome from '../pages/role/MerchantHome';
import RiderHome from '../pages/role/RiderHome';
import AdminHome from '../pages/role/AdminHome';
import { GuestOnly, RequireAuth } from './RequireAuth';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      <Route element={<GuestOnly />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<RequireAuth roles={['consumer']} />}>
        <Route element={<ConsoleLayout />}>
          <Route path="consumer" element={<ConsumerHome />} />
        </Route>
      </Route>
      <Route element={<RequireAuth roles={['merchant']} />}>
        <Route element={<ConsoleLayout />}>
          <Route path="merchant" element={<MerchantHome />} />
        </Route>
      </Route>
      <Route element={<RequireAuth roles={['rider']} />}>
        <Route element={<ConsoleLayout />}>
          <Route path="rider" element={<RiderHome />} />
        </Route>
      </Route>
      <Route element={<RequireAuth roles={['admin']} />}>
        <Route element={<ConsoleLayout />}>
          <Route path="admin" element={<AdminHome />} />
        </Route>
      </Route>

      <Route path="/403" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
