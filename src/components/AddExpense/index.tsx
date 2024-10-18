import { useCallback, useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { MessageContext } from '../../context';
import MsgCard from '../MsgCard';
import { AddCard } from '../AddCard';
import './addExpense.scss';
import i18next from 'i18next';

interface AddExpenseProps {
  setAdd: React.Dispatch<React.SetStateAction<boolean>>;
  msg: boolean;
  setMsg: React.Dispatch<React.SetStateAction<boolean>>;
  dropDown: boolean;
  setDropDown: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddExpense: React.FC<AddExpenseProps> = ({
  setAdd,
  msg,
  setMsg,
  dropDown,
  setDropDown,
}) => {
  const initialValue = {
    type: 'income',
    date: '',
    time: '',
    category: '',
    amount: 0,
    description: '',
    payment_mode: 1,
  };
  const [formData, setFormData] = useState([initialValue]);
  const messageContext = useContext(MessageContext);

  if (!messageContext) {
    throw new Error('MessageContext must be used within a MessageProvider');
  }

  const { showMessage, setShowMessage, msgCardData, setMsgCardData } =
    messageContext;

  // const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]:
  //       name === 'payment_mode' || name === 'amount' || name === 'category'
  //         ? Number(value)
  //         : value,
  //   }));
  // }, []);
  const handleChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevFormData) =>
        prevFormData.map((data, i) =>
          i === index
            ? {
                ...data,
                [name]:
                  name === 'payment_mode' ||
                  name === 'amount' ||
                  name === 'category'
                    ? Number(value)
                    : value,
              }
            : data
        )
      );
    },
    []
  );

  const handleAddExpense = () => {
    setFormData((prevFormData) => [...prevFormData, initialValue]);
  };

  const handleAdd = () => {
    const isValid = formData.every(
      (data) =>
        data.date !== '' &&
        data.time !== '' &&
        data.category !== '' &&
        data.amount !== 0 &&
        data.description !== ''
    );
    if (isValid) {
      setMsg(true);
      setMsgCardData((prev) => ({ ...prev, status: true, message: 'Added' }));
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1000);
    } else {
      setMsg(true);
      setMsgCardData((prev) => ({
        ...prev,
        status: false,
        message: 'Please Fill all the details !',
      }));
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1000);
    }
  };
  console.log(formData);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.className !== 'input-box-category') {
        setDropDown(false);
      }
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [setDropDown]);

  if (msg && showMessage) {
    return (
      <MsgCard
        status={msgCardData.status}
        message={msgCardData.message}
      />
    );
  }
  return (
    <div className='add-expense-container'>
      <div onClick={handleAddExpense}>Add Expense + {formData.length}</div>

      <FontAwesomeIcon
        icon={faXmark}
        className='xmark-icon'
        size='lg'
        onClick={() => setAdd(false)}
      />

      {formData.map((data, index) => (
        <AddCard
          key={index}
          handleChange={(e) => handleChange(index, e)}
          formData={data}
          dropDown={dropDown}
          setDropDown={setDropDown}
        />
      ))}

      {/* button */}
      <div className='dd-6'>
        <button
          className='add'
          onClick={() => handleAdd()}
        >
          {i18next.t('LABEL.SUBMIT')}
        </button>
        <button
          className='cancel'
          onClick={() => setAdd(false)}
        >
          {i18next.t('LABEL.CANCEL')}
        </button>
      </div>
    </div>
  );
};

export default AddExpense;
