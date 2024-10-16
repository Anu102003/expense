import {
  CONFIRM_PASSWORD,
  EMAIL,
  FIRST_NAME,
  LAST_NAME,
  PASSWORD,
} from '../text';

export const initialFormData = {
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  confirm_password: '',
};

export const initialErrorValue = {
  email: '',
  password: '',
  confirm_password: '',
  first_name: '',
  last_name: '',
  valid: '',
};
export const loginFormFields = [
  {
    placeholder: 'PLACEHOLDER.EMAIL',
    name: EMAIL,
    type: 'email',
  },
  {
    placeholder: 'PLACEHOLDER.PASSWORD',
    name: PASSWORD,
    type: 'text',
  },
];
export const registerFormFields = [
  {
    placeholder: 'PLACEHOLDER.CONFIRM_PASSWORD',
    name: CONFIRM_PASSWORD,
    type: 'text',
  },
  {
    placeholder: 'PLACEHOLDER.FIRST_NAME',
    name: FIRST_NAME,
    type: 'text',
  },
  {
    placeholder: 'PLACEHOLDER.LAST_NAME',
    name: LAST_NAME,
    type: 'text',
  },
];

export const expenseTypeFields = [
  {
    name: 'type',
    type: 'radio',
  },
];

export const expensePaymentModeFields = [
  {
    name: 'payment_mode',
    type: 'radio',
  },
];
