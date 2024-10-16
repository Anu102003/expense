import React from 'react';
import { appTheme } from '../../libs/constants/appThemes';
import i18next from '../../i18next';
import './input.scss';
import '../../styles/variables.scss';

interface InputFieldProps {
  placeholderKey: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  styleEnable: {
    valueEntered: boolean;
    valueValid: boolean;
  };
}

const FormInput: React.FC<InputFieldProps> = ({
  placeholderKey,
  name,
  type = 'text',
  value,
  onChange,
  error,
  styleEnable,
}) => {
  return (
    <div className='input-field'>
      <input
        type={type}
        placeholder={i18next.t(placeholderKey)}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          backgroundColor: styleEnable.valueValid
            ? appTheme.inputBlue
            : styleEnable.valueEntered
            ? appTheme.input
            : appTheme.inputGray,
        }}
        // autoComplete="off"
      />
      {error && <p className='error'>{error}</p>}
    </div>
  );
};

export default FormInput;
