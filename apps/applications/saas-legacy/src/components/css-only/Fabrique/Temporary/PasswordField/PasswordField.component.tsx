import React from 'react';
import { useTranslation } from 'react-i18next';

import Textfield from '#Fabrique/Temporary/Textfield';
import IconButton from '#Fabrique/IconButton';
import { Eye, EyeOff } from '#src/components/untitledui';

import './styles.css';

type ButtonProps = {
  isPasswordVisible: boolean;
  onClick: () => void;
  onMouseDown: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
};

export type Props = {
  name: string;
  id: string;
  isDisabled?: boolean;
  label?: string;
};

const PasswordVisibilityButton: React.FC<ButtonProps> = ({
  isPasswordVisible,
  onClick,
  onMouseDown,
}) => {
  return (
    <IconButton
      onClick={onClick}
      onMouseDown={onMouseDown}
      size="sm"
      variant="text"
    >
      {isPasswordVisible ? <Eye /> : <EyeOff />}
    </IconButton>
  );
};

const PasswordField: React.FC<Props> = ({ isDisabled, label, name, id }) => {
  const { t } = useTranslation(['marketing', 'booking']);

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVibility] =
    React.useState(false);

  const handlePreventDefault = React.useCallback(
    (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (event) {
        event.preventDefault();
      }
    },
    [],
  );

  const togglePasswordVisibility = React.useCallback(
    () => setIsPasswordVisible((prevState) => !prevState),
    [setIsPasswordVisible],
  );

  const toggleConfirmPasswordVisibility = React.useCallback(
    () => setConfirmPasswordVibility((prevState) => !prevState),
    [setConfirmPasswordVibility],
  );

  return (
    <div className="bs-fabrique-password-field__wrapper">
      <Textfield
        isRequired
        inputId={id}
        isDisabled={isDisabled}
        label={label}
        name={name}
        placeholder={t('customForm.field.password')}
        rightIcon={
          <PasswordVisibilityButton
            isPasswordVisible={isPasswordVisible}
            onClick={togglePasswordVisibility}
            onMouseDown={handlePreventDefault}
          />
        }
        size="sm"
        type={isPasswordVisible ? 'text' : 'password'}
      />
      <Textfield
        isRequired
        inputId={`${id}-confirm-password`}
        isDisabled={isDisabled}
        label={t('customForm.field.repeatPassword')}
        name="passwordConfirm"
        placeholder={t('customForm.field.repeatPassword')}
        rightIcon={
          <PasswordVisibilityButton
            isPasswordVisible={confirmPasswordVisibility}
            onClick={toggleConfirmPasswordVisibility}
            onMouseDown={handlePreventDefault}
          />
        }
        size="sm"
        type={confirmPasswordVisibility ? 'text' : 'password'}
      />
    </div>
  );
};

export default React.memo(PasswordField);
