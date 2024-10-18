import { useEffect, useMemo, useState } from 'react';
import Loading from '../../Loading';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { dashboardApi } from '../../../service/dashboard';
import Cards from '../../../model/Cards';
import './dashboard.scss';
import { DateRangePicker, Stack } from 'rsuite';
import { formatDateToAPI } from '../../../libs/helpers/validation';

type DateRange = [Date, Date];

const Dashboard = () => {
  const { loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [showLoading, setShowLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(
    null
  );
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchDashboard = async () => {
    setShowLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const resultAction = await dispatch(dashboardApi({ startDate, endDate }));
      if (dashboardApi.fulfilled.match(resultAction)) {
        setDashboardData(resultAction.payload);
      } else if (dashboardApi.rejected.match(resultAction)) {
        console.error('Failed to fetch dashboard data:', resultAction.payload);
      }
    } catch (error) {
      console.error('Unexpected dashboard error', error);
    } finally {
      setShowLoading(false);
    }
  };

  const handleDateRangeChange = (value: DateRange | null) => {
    setSelectedDateRange(value);
    if (value && value.length === 2) {
      const [s, e] = value;
      setStartDate(formatDateToAPI(s));
      setEndDate(formatDateToAPI(e));
      fetchDashboard();
    }
  };
  const handleClearDate = () => {
    fetchDashboard();
    setStartDate('');
    setEndDate('');
  };

  useEffect(() => {
    fetchDashboard();
  }, [dispatch, startDate, endDate]);

  const memoDashboardData = useMemo(() => dashboardData, [dashboardData]);

  if (loading || showLoading) {
    return <Loading />;
  }
  return (
    <div className='dashboard-container'>
      <Stack
        spacing={10}
        direction='column'
        alignItems='flex-start'
        className='date-input'
      >
        <DateRangePicker
          format='MMM dd, yyyy'
          onChange={handleDateRangeChange}
          value={selectedDateRange}
          onClean={handleClearDate}
        />
      </Stack>
      <Cards data={memoDashboardData} />
    </div>
  );
};

export default Dashboard;
