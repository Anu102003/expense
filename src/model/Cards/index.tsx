import i18next from 'i18next';
import './cards.scss';
import { appTheme } from '../../libs/constants/appThemes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

interface DashboardProps {
  data: any;
}
const Cards: React.FC<DashboardProps> = ({ data }) => {
  const details = [
    {
      count: data?.income,
      lable: i18next.t('LABEL.INCOME'),
      color: appTheme.card.blue,
    },
    {
      count: data?.expense,
      lable: i18next.t('LABEL.EXPENSE'),
      color: appTheme.card.pink,
    },
    {
      count: data?.balance,
      lable: i18next.t('LABEL.BALANCE'),
      color: appTheme.card.lightGreen,
    },
    {
      count: data?.transaction,
      lable: i18next.t('LABEL.TRANSACTION'),
      color: appTheme.card.skyBlue,
    },
  ];
  return (
    <div className='card-container'>
      {details.map((card, index) => (
        <div
          className='card'
          key={index}
        >
          <p
            className='count'
            style={{ color: card.color }}
          >
            {card.lable !== i18next.t('LABEL.TRANSACTION') && (
              <FontAwesomeIcon
                icon={faDollarSign}
                style={{ marginRight: '5px' }}
                size='lg'
              />
            )}
            {card.count}
          </p>
          <p className='lable'>{card.lable}</p>
        </div>
      ))}
    </div>
  );
};

export default Cards;
