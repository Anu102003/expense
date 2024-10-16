import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { AppDispatch } from '../../store/store';
import { logoutApi } from '../../service/auth';
import { imageConst } from '../../libs/constants/image';
import { DASHBOARD, LOGIN, TRANSACTION } from '../../libs/constants/route';
import i18next from 'i18next';
import './navBar.scss';

interface NavBarProps {
  setNavPopup: React.Dispatch<React.SetStateAction<boolean>>;
  navPopup: boolean;
  setShowLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export const NavBar: React.FC<NavBarProps> = ({
  navPopup,
  setNavPopup,
  setShowLoading,
}) => {
  const [dashboard, setDashboard] = useState({ cursor: false, point: false });
  const [transaction, setTransaction] = useState({
    cursor: false,
    point: false,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    setShowLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const resultAction = await dispatch(logoutApi());
      if (logoutApi.fulfilled.match(resultAction)) {
        navigate(LOGIN);
      } else if (logoutApi.rejected.match(resultAction)) {
        console.error('Failed to fetch logout data:', resultAction.payload);
      }
    } catch (error) {
      console.error('Unexpected logout error', error);
    } finally {
      setShowLoading(false);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const linkField = [
    {
      state: dashboard,
      changeState: setDashboard,
      linkText: i18next.t('NAVBAR.DASHBOARD'),
      navigateLink: DASHBOARD,
    },
    {
      state: transaction,
      changeState: setTransaction,
      linkText: i18next.t('LABEL.TRANSACTION'),
      navigateLink: TRANSACTION,
    },
  ];

  useEffect(() => {
    if (pathname === DASHBOARD) {
      setDashboard((prev) => ({ ...prev, point: true }));
      setTransaction((prev) => ({ ...prev, point: false }));
    }
    if (pathname === TRANSACTION) {
      setTransaction((prev) => ({ ...prev, point: true }));
      setDashboard((prev) => ({ ...prev, point: false }));
    }
  }, [pathname]);

  const renderLinkFeilds = useMemo(() => {
    return linkField.map((input) => (
      <div
        className='link'
        onClick={() => {
          navigate(input.navigateLink);
        }}
      >
        {input.state.cursor && !input.state.point && (
          <img
            src={imageConst.cursorWhite}
            alt={i18next.t('ALT.CURSOR')}
          />
        )}
        <p
          onMouseEnter={() =>
            input.changeState((prev) => ({ ...prev, cursor: true }))
          }
          onMouseLeave={() =>
            input.changeState((prev) => ({ ...prev, cursor: false }))
          }
          style={{
            borderBottom: input.state.point ? '3px solid white' : '',
            paddingBottom: '5px',
          }}
        >
          {input.linkText}
        </p>
      </div>
    ));
  }, [linkField, navigate]);
  return (
    <div className='nav-bar'>
      <div className='logo'>
        <img
          src={imageConst.navLogo}
          alt={i18next.t('ALT.LOGO')}
        />
      </div>
      <div className='btn-wrapper'>
        <div className='links-wrapper'>{renderLinkFeilds}</div>
        <button
          className='btn'
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
          {i18next.t('NAVBAR.LOGOUT')}
        </button>
      </div>
      <div
        className='more-icon-wrapper'
        onClick={() => {
          setNavPopup(!navPopup);
        }}
      >
        <FontAwesomeIcon
          className='more-icon'
          size='2xl'
          icon={faBars}
        />
      </div>
    </div>
  );
};
