import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { loginApi, registerApi } from '../../service/auth';
import {
  validateConfirmPassword,
  validateField,
  validatePassword,
} from '../../libs/helpers/validation';
import {
  initialErrorValue,
  initialFormData,
  loginFormFields,
  registerFormFields,
} from '../../libs/constants/formFields';
import { CONFIRM_PASSWORD, PASSWORD } from '../../libs/constants/text';
import { DASHBOARD, LOGIN, REGISTER } from '../../libs/constants/route';
import { LoginResponse } from '../../libs/types';
import { imageConst } from '../../libs/constants/image';
import FormInput from '../../components/Input';
import Loading from '../Loading';
import i18next from '../../i18next';
import './authentication.scss';

const Authentication = () => {
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [login, setLogin] = useState(location.pathname !== REGISTER);
  const [formSubmit, setFormSubmit] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState(initialFormData);
  const [errorValue, setErrorValue] = useState(initialErrorValue);
  const [showLoading, setShowLoading] = useState(false);

  const loginValid =
    formData.email &&
    formData.password &&
    !errorValue.email &&
    !errorValue.password;

  const registerValid =
    formData.confirm_password &&
    formData.first_name &&
    formData.last_name &&
    !errorValue.confirm_password &&
    !errorValue.first_name &&
    !errorValue.last_name;

  //checking all form feilds
  const validation = useCallback(() => {
    let result;
    if (login && !loginValid) {
      setErrorValue((prev) => ({ ...prev, valid: i18next.t('ERROR.VALID') }));
      result = false;
    } else if (!login) {
      if (!registerValid) {
        setErrorValue((prev) => ({ ...prev, valid: i18next.t('ERROR.VALID') }));
        result = false;
      } else {
        setErrorValue((prev) => ({ ...prev, valid: '' }));
        result = true;
      }
    } else {
      setErrorValue((prev) => ({ ...prev, valid: '' }));
      result = true;
    }
    return result;
  }, [login, loginValid, registerValid]);

  //entering formData for all feilds
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData, [name]: value };
      let validationError = '';
      if (name === PASSWORD) {
        if (newFormData.confirm_password.length > 0) {
          validationError = validateConfirmPassword(
            value,
            newFormData.confirm_password
          );
          setErrorValue((prevError) => ({
            ...prevError,
            confirm_password: validationError,
          }));
        } else {
          validationError = validatePassword(value);
          setErrorValue((prevError) => ({
            ...prevError,
            [name]: validationError,
          }));
        }
      } else if (name === CONFIRM_PASSWORD) {
        validationError = validateConfirmPassword(newFormData.password, value);
        setErrorValue((prevError) => ({
          ...prevError,
          [name]: validationError,
        }));
      } else {
        validationError = validateField(name, value, newFormData);
        setErrorValue((prevError) => ({
          ...prevError,
          [name]: validationError,
        }));
      }

      return newFormData;
    });
  }, []);

  //submitting formData
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormSubmit(true);
    // const validCheck = validation();
    // if (!validCheck) return;
    const { email, password, first_name, last_name } = formData;
    setShowLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const resultAction = login
        ? await dispatch(loginApi({ email, password }))
        : await dispatch(
            registerApi({ email, password, first_name, last_name })
          );

      if (
        loginApi.fulfilled.match(resultAction) ||
        registerApi.fulfilled.match(resultAction)
      ) {
        const payload = resultAction.payload as LoginResponse;
        if (payload.status === (login ? 200 : 201)) {
          navigate(DASHBOARD);
        }
      } else {
        console.error('Failed to fetch auth data:', resultAction.payload);
      }
    } catch (err) {
      console.error('Unexpected auth error:', err);
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    setLogin(location.pathname !== REGISTER);
    setFormData(initialFormData);
    setErrorValue(initialErrorValue);
    setFormSubmit(false);
  }, [location.pathname, login]);

  useEffect(() => {
    if (formSubmit) {
      validation();
    }
  }, [formSubmit, formData, validation]);

  //Form Feilds
  const renderFields = useMemo(() => {
    const fields = login
      ? loginFormFields
      : [...loginFormFields, ...registerFormFields];
    return fields.map((input) => (
      <FormInput
        key={input.name}
        placeholderKey={input.placeholder}
        name={input.name}
        type={input.type}
        value={formData[input.name as keyof typeof formData]}
        onChange={handleChange}
        error={errorValue[input.name as keyof typeof errorValue]}
        styleEnable={{
          valueEntered:
            formData[input.name as keyof typeof formData].length > 0,
          valueValid:
            formData[input.name as keyof typeof formData].length > 0 &&
            errorValue[input.name as keyof typeof errorValue].length === 0,
        }}
      />
    ));
  }, [login, formData, errorValue, handleChange]);

  useEffect(() => {
    if (error) {
      setErrorValue((prev) => {
        if (login) {
          return { ...prev, valid: error };
        } else {
          const err = JSON.parse(error);
          return { ...prev, ...err };
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  if (loading || showLoading) {
    return <Loading />;
  }
  return (
    <div className='authenticate'>
      <div className='authenticate__left'>
        <img
          src={imageConst.logo}
          alt={i18next.t('ALT.LOGO')}
        />
        <p className='p1'>
          {login
            ? i18next.t('AUTHENTICATION.NO_ACCOUNT')
            : i18next.t('AUTHENTICATION.HAVE_ACCOUNT')}
        </p>
        <div className='btn-wrapper'>
          <button
            onClick={() => (login ? navigate(REGISTER) : navigate(LOGIN))}
            className='btn'
          >
            {login
              ? i18next.t('AUTHENTICATION.SIGN_UP')
              : i18next.t('AUTHENTICATION.SIGN_IN')}
          </button>
        </div>
      </div>
      <div className='authenticate__right'>
        <form>
          <p className='h1'>
            {login
              ? i18next.t('AUTHENTICATION.LOGIN')
              : i18next.t('AUTHENTICATION.REGISTER')}
          </p>
          {renderFields}
          <div className='btn-wrapper'>
            <button
              type='submit'
              onClick={handleSubmit}
              className='btn'
            >
              {login
                ? i18next.t('AUTHENTICATION.SIGN_IN')
                : i18next.t('AUTHENTICATION.SIGN_UP')}
            </button>
          </div>
          {errorValue.valid && <p className='error'>{errorValue.valid}</p>}
        </form>
      </div>
    </div>
  );
};

export default Authentication;
