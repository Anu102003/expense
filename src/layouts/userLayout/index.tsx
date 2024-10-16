import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleDollarToSlot,
  faHouse,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { AppDispatch, RootState } from '../../store/store';
import { logoutApi } from '../../service/auth';
import { NavBar } from '../navBar';
import Loading from '../../pages/Loading';
import { DASHBOARD, LOGIN, TRANSACTION } from '../../libs/constants/route';
import i18next from 'i18next';
import './userLayout.scss';

export const UserLayout = () => {
  const [navPopup, setNavPopup] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.className === '') {
        setNavPopup(false);
        document.body.style.overflow = 'unset';
      }
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const handleChange = async (link: string) => {
    if (link === i18next.t('NAVBAR.LOGOUT')) {
      setShowLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const resultAction = await dispatch(logoutApi());
        if (logoutApi.fulfilled.match(resultAction)) {
          navigate(LOGIN);
        } else if (logoutApi.rejected.match(resultAction)) {
          console.error('Logout failed:', resultAction.payload);
        }
      } catch (error) {
        console.error('An unexpected error occurred during logout', error);
      } finally {
        setShowLoading(false);
      }
    } else {
      navigate(link);
      setNavPopup(false);
    }
  };
  const linkField = [
    {
      linkText: i18next.t('NAVBAR.DASHBOARD'),
      handleChange: () => handleChange(DASHBOARD),
      icon: faHouse,
    },
    {
      linkText: i18next.t('LABEL.TRANSACTION'),
      handleChange: () => handleChange(TRANSACTION),
      icon: faCircleDollarToSlot,
    },
    {
      linkText: i18next.t('NAVBAR.LOGOUT'),
      handleChange: () => handleChange(i18next.t('NAVBAR.LOGOUT')),
      icon: faRightFromBracket,
    },
  ];
  const renderLinkFields = () => {
    return linkField.map((input) => (
      <p onClick={input.handleChange}>
        <FontAwesomeIcon
          icon={input.icon}
          style={{ paddingRight: '15px' }}
        />
        {input.linkText}
      </p>
    ));
  };
  if (loading || showLoading) {
    return <Loading />;
  }

  return (
    <div className='nav-bar-container'>
      <section>
        <div className='nav-bar-wrapper'>
          <NavBar
            navPopup={navPopup}
            setNavPopup={setNavPopup}
            setShowLoading={setShowLoading}
          />
        </div>
        {navPopup && <div className='hide-navbar'>{renderLinkFields()}</div>}
        <div className='outlet'>
          <Outlet />
        </div>
      </section>
    </div>
  );
};
