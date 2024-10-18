import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Authentication from '../pages/Authentication';
import Transaction from '../pages/User/Transaction';
import Dashboard from '../pages/User/Dashboard';
import {
  DASHBOARD,
  ERROR,
  LOGIN,
  REGISTER,
  TRANSACTION,
} from '../libs/constants/route';
import ErrorPage from '../pages/Error';
import { UserLayout } from '../layouts/userLayout';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<Authentication />}
        />
        <Route
          path={LOGIN}
          element={<Authentication />}
        />
        <Route
          path={REGISTER}
          element={<Authentication />}
        />
        <Route
          path='/'
          element={<UserLayout />}
        >
          <Route
            path={DASHBOARD}
            element={<Dashboard />}
          />
          <Route
            path={TRANSACTION}
            element={<Transaction />}
          />
        </Route>
        <Route
          path={ERROR}
          element={<ErrorPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};
