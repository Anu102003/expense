import { useEffect, useMemo, useState } from 'react';
import './transaction.scss';
import { AppDispatch, RootState } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllExpenseApi,
  searchExpenseApi,
} from '../../../service/transaction';
import Loading from '../../Loading';
import i18next from 'i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleXmark,
  faFilter,
  faMagnifyingGlass,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import ExpenseTable from '../../../components/ExpenseTable';
import AddExpense from '../../../components/AddExpense';

const Transaction = () => {
  // const { loading } = useSelector((state: RootState) => state?.transaction);
  const [expenseData, setExpenseData] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState('');
  const [clearQuery, setClearQuery] = useState(true);
  const [filter, setFilter] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [add, setAdd] = useState(false);
  const [msg, setMsg] = useState(false);
  const [dropDown, setDropDown] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);
    try {
      const resultAction = await dispatch(searchExpenseApi({ search: value }));
      if (searchExpenseApi.fulfilled.match(resultAction)) {
        setExpenseData(resultAction.payload);
      } else if (searchExpenseApi.rejected.match(resultAction)) {
        console.error(
          'Failed to fetch search expense data:',
          resultAction.payload
        );
      }
    } catch (error) {
      console.error('Unexpected dashboard error', error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setFilter(false);
      } else {
        setFilter(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.className === 'popup' && !dropDown && !msg) {
        setAdd(false);
        document.body.style.overflow = 'unset';
      }
      if (target.className === 'popup' && !dropDown && msg) {
        setMsg(false);
      }
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [dropDown, msg]);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const resultAction =
          query.length > 0
            ? await dispatch(searchExpenseApi({ search: query, page: pageNo }))
            : await dispatch(getAllExpenseApi({ page: pageNo }));
        if (
          query.length > 0
            ? searchExpenseApi.fulfilled.match(resultAction)
            : getAllExpenseApi.fulfilled.match(resultAction)
        ) {
          setExpenseData(resultAction.payload);
        } else if (getAllExpenseApi.rejected.match(resultAction)) {
          console.error(
            'Failed to fetch transaction data:',
            resultAction.payload
          );
        }
      } catch (error) {
        console.error('Unexpected Transaction error', error);
      }
    };
    fetchTransaction();
  }, [dispatch, pageNo, clearQuery, query.length, query]);

  const memoDashboardData = useMemo(() => expenseData, [expenseData]);

  // if (loading) {
  //   return <Loading />;
  // }
  return (
    <div className='transaction-container'>
      <div className='d-1'>
        <div className='d-11'>
          <div className='search-wrapper'>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className='search-icon'
            />
            <input
              type='text'
              onChange={(e) => handleSearch(e.target.value)}
              value={query}
              placeholder={i18next.t('PLACEHOLDER.SEARCH')}
              className={query.length > 0 ? 'search active' : 'search'}
            />
            {query.length > 0 && (
              <FontAwesomeIcon
                icon={faCircleXmark}
                className='cross-icon'
                onClick={() => {
                  setQuery('');
                  setClearQuery(!clearQuery);
                }}
              />
            )}
          </div>
          <div className='btn-wrapper'>
            <button
              onClick={() => {
                setAdd(true);
              }}
              className='btn'
            >
              <FontAwesomeIcon
                icon={faPlus}
                style={{ paddingRight: '10px' }}
              />{' '}
              {i18next.t('LABEL.ADD')}
            </button>
            <button
              onClick={() => setFilter(true)}
              className='btn filter'
            >
              <FontAwesomeIcon
                icon={faFilter}
                style={{ paddingRight: '10px' }}
              />{' '}
              {i18next.t('LABEL.FILTER')}
            </button>
          </div>
          {add && (
            <div className='popup'>
              <AddExpense
                setAdd={setAdd}
                msg={msg}
                setMsg={setMsg}
                dropDown={dropDown}
                setDropDown={setDropDown}
              />
            </div>
          )}
        </div>

        <div className='d-12'>
          <ExpenseTable
            expenseData={memoDashboardData}
            setPageNo={setPageNo}
          />
        </div>
      </div>
      {filter && (
        <div className='popup'>
          <div className='d-2'>Filter</div>
        </div>
      )}
    </div>
  );
};

export default Transaction;
