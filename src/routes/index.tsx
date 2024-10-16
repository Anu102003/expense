import { useContext, useEffect } from 'react';
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
import MsgCard from '../components/MsgCard';
import { MessageContext } from '../context';
export const Router = () => {
  const messageContext = useContext(MessageContext);
  if (!messageContext) {
    throw new Error('MessageContext must be used within a MessageProvider');
  }

  const { showMessage, setShowMessage, msgCardData } = messageContext || {
    showMessage: false,
    setShowMessage: () => {},
    msgCardData: { status: false, message: '' },
  };
  console.log(showMessage, msgCardData);
  useEffect(() => {
    if (setShowMessage) {
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1000);
    }
  }, [setShowMessage]);

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
      {showMessage && (
        <MsgCard
          status={msgCardData.status}
          message={msgCardData.message}
        />
      )}
    </BrowserRouter>
  );
};
