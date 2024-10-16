import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import {
  expensePaymentModeFields,
  expenseTypeFields,
} from '../../libs/constants/formFields';
import { AppDispatch } from '../../store/store';
import { getCategory, getPaymentMode } from '../../service/transaction';
import i18next from 'i18next';
import './addCard.scss';

interface AddCardProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: any;
  dropDown: boolean;
  setDropDown: React.Dispatch<React.SetStateAction<boolean>>;
}
interface Category {
  id: number;
  name: string;
}
interface Payment {
  id: number;
  mode: string;
}
export const AddCard: React.FC<AddCardProps> = ({
  handleChange,
  formData,
  dropDown,
  setDropDown,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [category, setCategory] = useState<Category[]>([]);
  const [paymentMode, setPaymentMode] = useState<Payment[]>([]);
  const [categoryValue, setCategoryValue] = useState('');
  const typeFields = [
    {
      id: i18next.t('LABEL.INCOME').toLowerCase(),
      mode: i18next.t('LABEL.INCOME'),
    },
    {
      id: i18next.t('LABEL.EXPENSE').toLowerCase(),
      mode: i18next.t('LABEL.EXPENSE'),
    },
  ];
  const renderTypeFields = (state: boolean) => {
    const fields = state
      ? typeFields?.flatMap((typeField) =>
          expenseTypeFields?.map((input) => ({
            ...input,
            ...typeField,
          }))
        )
      : paymentMode?.flatMap((typeField) =>
          expensePaymentModeFields?.map((input) => ({
            ...input,
            ...typeField,
          }))
        );
    return fields.map((input) => (
      <div className='dd-11'>
        <input
          type={input.type}
          value={input.id}
          name={input.name}
          onChange={(e) => handleChange(e)}
          checked={
            state
              ? formData.type === input.id
              : formData.payment_mode === input.id
          }
        />
        <label
          htmlFor={input.mode}
          onClick={(e) =>
            handleChange({
              target: {
                name: input.name,
                value: input.id,
              },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        >
          {input.mode}
        </label>
      </div>
    ));
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResult, paymentModeResult] = await Promise.all([
          dispatch(getCategory()),
          dispatch(getPaymentMode()),
        ]);
        if (getCategory.fulfilled.match(categoryResult)) {
          setCategory(categoryResult.payload);
        } else {
          console.error(
            'Failed to fetch category data:',
            categoryResult.payload
          );
        }

        if (getPaymentMode.fulfilled.match(paymentModeResult)) {
          setPaymentMode(paymentModeResult.payload);
        } else {
          console.error(
            'Failed to fetch payment mode data:',
            paymentModeResult.payload
          );
        }
      } catch (error) {
        console.error('Unexpected Category error', error);
      }
    };
    fetchData();
  }, [dispatch]);
  return (
    <>
      <p className='h1'>
        {i18next.t('LABEL.ADD') + ' ' + i18next.t('LABEL.EXPENSE')}
      </p>
      <br></br>

      <div className='dd-1'>{renderTypeFields(true)}</div>

      {/* date & time */}
      <div className='dd-2'>
        <div className='dd-21'>
          <label>{i18next.t('PLACEHOLDER.DATE')}</label>
          <input
            type='date'
            name='date'
            onChange={(e) => handleChange(e)}
            className='input-box-style'
            value={formData.date}
          />
        </div>
        <div className='dd-21'>
          <label>{i18next.t('PLACEHOLDER.TIME')}</label>
          <input
            type='time'
            step='2'
            name='time'
            onChange={(e) => handleChange(e)}
            className='input-box-style'
            value={formData.time}
          />
        </div>
      </div>

      {/* category & amount */}
      <div className='dd-3'>
        <div className='dd-31'>
          <label>{i18next.t('PLACEHOLDER.CATEGORY')}</label>
          <div
            className='input-box-category'
            onClick={() => setDropDown(!dropDown)}
          >
            {categoryValue}
            <FontAwesomeIcon
              icon={faSortDown}
              className='down-icon'
            />
          </div>
          <div className='options-wrapper'>
            {dropDown &&
              category?.map((input) => (
                <div
                  className='options'
                  style={{ zIndex: dropDown ? 5 : 0 }}
                  onClick={(e) => {
                    handleChange({
                      target: {
                        name: 'category',
                        value: input.id,
                      },
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                    setCategoryValue(input.name);
                    setDropDown(false);
                  }}
                >
                  {input.name}
                </div>
              ))}
          </div>
        </div>
        <div className='dd-31'>
          <label>{i18next.t('PLACEHOLDER.AMOUNT')}</label>
          <input
            type='number'
            name='amount'
            onChange={(e) => handleChange(e)}
            className='input-box-style'
            value={formData.amount}
          />
        </div>
      </div>

      {/* description */}
      <div className='dd-4'>
        <div className='dd-41'>
          <label>{i18next.t('PLACEHOLDER.DESCRIPTION')}</label>
          <input
            type='text'
            name='description'
            onChange={(e) => handleChange(e)}
            className='input-box-style'
            value={formData.description}
          />
        </div>
      </div>

      {/* payment mode */}
      <div className='dd-5'>
        <label className='label'>{i18next.t('PLACEHOLDER.PAYMENT_MODE')}</label>
        <div className='options'>{renderTypeFields(false)}</div>
      </div>
    </>
  );
};
