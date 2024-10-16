import i18next from 'i18next';
import { EMAIL, FIRST_NAME, LAST_NAME } from '../constants/text';

export const validateField = (name: string, value: string, formData: any) => {
  switch (name) {
    case EMAIL:
      if (!value) return i18next.t('ALERT.EMAIL');
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value))
        return i18next.t('ERROR.EMAIL');
      break;
    case FIRST_NAME:
    case LAST_NAME:
      if (!value) return i18next.t('ERROR.REQUIRED');
      if (!/^[A-Z][a-z]*$/.test(value)) return i18next.t('ERROR.NAME');
      break;
    default:
      return '';
  }
  return '';
};

export const validatePassword = (password: string) => {
  if (!password) return i18next.t('ALERT.PASSWORD');
  if (password.length < 8) return i18next.t('ERROR.PASSWORD_LENGTH');
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,15}$/.test(
      password
    )
  )
    return i18next.t('ERROR.PASSWORD');
  return '';
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
) => {
  if (!confirmPassword) return i18next.t('ALERT.PASSWORD');
  if (password !== confirmPassword && confirmPassword !== '')
    return i18next.t('ERROR.CONFIRM_PASSWORD');
  return '';
};

export const formatDateToAPI = (date: Date | null): string => {
  if (!date) return ''; 
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};