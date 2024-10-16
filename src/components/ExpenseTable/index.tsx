import i18next from 'i18next';
import './expenseTable.scss';
import { appTheme } from '../../libs/constants/appThemes';
import { Pagination } from 'rsuite';
import { useState } from 'react';
interface ExpenseItem {
  id: number;
  type: string;
  date: string;
  time: string;
  category__name: string;
  description?: string;
  amount: number;
  payment_mode__mode?: string;
}
interface ExpenseDataProps {
  expenseData: {
    expenses: ExpenseItem[];
    num_pages: number;
    current_page: number;
    has_previous: boolean;
    has_next: boolean;
  };
  setPageNo: React.Dispatch<React.SetStateAction<number>>;
}

const ExpenseTable: React.FC<ExpenseDataProps> = ({
  expenseData,
  setPageNo,
}) => {
  const tableLabel = i18next.t('TABLE_LABEL', {
    returnObjects: true,
  }) as string[];
  const [activePage, setActivePage] = useState(expenseData?.current_page || 1);
  const handlePageChange = (page: number) => {
    setActivePage(page);
    setPageNo(page);
  };
  return (
    <div className='table-container'>
      <div className='table-wrapper'>
        <table>
          <thead>
            <tr>
              {tableLabel?.map((data) => (
                <td className={data === i18next.t('LABEL.TIME') ? 'time' : ''}>
                  {data}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenseData?.expenses?.map((data) => (
              <tr key={data.id}>
                <td>{data.category__name}</td>
                <td>{data.date}</td>
                <td className='time'>{data.time}</td>
                <td>{data.payment_mode__mode}</td>
                <td>{data.description}</td>
                <td
                  style={{
                    color:
                      data.type === i18next.t('LABEL.INCOME').toLowerCase()
                        ? appTheme.green
                        : appTheme.red,
                  }}
                  className='amount'
                >
                  $ {data.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='pagination'>
          <Pagination
            prev={expenseData?.has_previous}
            last
            next={expenseData?.has_next}
            first
            size='sm'
            total={expenseData?.num_pages * 5}
            limit={5}
            activePage={activePage}
            onChangePage={handlePageChange}
            maxButtons={5}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseTable;
