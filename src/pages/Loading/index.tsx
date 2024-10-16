import { imageConst } from '../../libs/constants/image';
import i18next from 'i18next';
import './loading.scss';
import { useLocation } from 'react-router-dom';
import { DASHBOARD, TRANSACTION } from '../../libs/constants/route';
import { appTheme } from '../../libs/constants/appThemes';

const Loading = () => {
  const location = useLocation();
  const loadingColor =
    location.pathname === DASHBOARD || location.pathname === TRANSACTION;
  return (
    <div
      className='loading'
      style={{
        backgroundColor: loadingColor
          ? appTheme.cream
          : appTheme.american_Pink_2,
        minHeight: loadingColor ? '80vh' : '100vh',
      }}
    >
      <img
        src={loadingColor ? imageConst.dotLoading : imageConst.loading}
        alt={i18next.t('ALT.LOADING')}
      />
      <p
        className='txt'
        style={{
          color: loadingColor ? appTheme.black : appTheme.brown,
        }}
      >
        {i18next.t('LOADING.TEXT')}
      </p>
    </div>
  );
};

export default Loading;
