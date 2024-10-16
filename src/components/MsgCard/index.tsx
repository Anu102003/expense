import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './msgCard.scss';
import {
  faCircleCheck,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { appTheme } from '../../libs/constants/appThemes';

interface AddExpenseProps {
  status: boolean;
  message: string;
}
const MsgCard: React.FC<AddExpenseProps> = ({ status, message }) => {
  const [progress, setProgress] = useState(0);
  const displayDuration = 1500;
  const interval = 10;

  useEffect(() => {
    setProgress(100);
    const decrementValue = (interval / displayDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - decrementValue;
        if (newProgress <= 0) {
          clearInterval(timer);
          return 0;
        }
        return newProgress;
      });
    }, interval);
  }, []);

  return (
    <div className='msg-card'>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '5px',
          width: `${progress}%`,
          backgroundColor: `${status ? appTheme.green : appTheme.red}`,
          transition: `width ${interval}ms linear`,
        }}
      />

      {status ? (
        <h6 className={'h-1 success'}>
          <FontAwesomeIcon icon={faCircleCheck} />
          {i18next.t('LABEL.SUCCESS')}
        </h6>
      ) : (
        <h6 className={'h-1 error'}>
          <FontAwesomeIcon icon={faCircleExclamation} />
          {i18next.t('LABEL.FAILED')}
        </h6>
      )}

      <p className='p-1'>{message}</p>
    </div>
  );
};

export default MsgCard;
