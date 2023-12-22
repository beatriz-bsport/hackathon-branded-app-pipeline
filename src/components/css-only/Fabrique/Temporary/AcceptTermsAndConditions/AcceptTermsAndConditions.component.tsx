import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { TermsAndConditionType } from '#libs/payment/types';
import Checkbox from '#Fabrique/Checkbox';
import Typography from '#Fabrique/Typography';
import ButtonBase from '#Fabrique/ButtonBaseV2';
import TermsAndConditionsModal from './TermsAndConditionsModal';

import './styles.css';

export type AcceptTermsAndConditionsProps = {
  onCheck?: (accepted: boolean) => void;
  required?: boolean;
  termsAndConditions: string;
  type: TermsAndConditionType;
  disabled?: boolean;
  label?: string | React.ReactNode;
  name: string;
  id: string;
};

type LabelProps = {
  label?: string | React.ReactNode;
  type: TermsAndConditionType;
  handleShowTermsAndConditions: () => void;
};

const AcceptTermsAndConditionsLabel: React.FC<LabelProps> = ({
  label,
  handleShowTermsAndConditions,
  type,
}) => {
  const { t } = useTranslation('payment');
  return (
    <>
      <Typography
        align="left"
        className="bs-accept-terms-and-conditions-label"
        variant="body-sm"
      >
        {!label && <span>{t('generalTermsAndConditions.iAccept')}</span>}
        <ButtonBase
          className="bs-accept-terms-and-conditions-label__button"
          onClick={handleShowTermsAndConditions}
        >
          <Typography
            align="left"
            className="bs-accept-terms-and-conditions-label__text"
            color="primary"
            variant="body-sm"
          >
            {label || t(`generalTermsAndConditions.${type}`)}
          </Typography>
        </ButtonBase>
      </Typography>
    </>
  );
};

const AcceptTermsAndConditions: React.FC<AcceptTermsAndConditionsProps> = ({
  onCheck,
  required,
  termsAndConditions,
  type,
  disabled,
  label,
  name,
  id,
}) => {
  const { t } = useTranslation('marketing');

  const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);

  const [{ value }, { touched, error }, { setValue }] = useField<boolean>(name);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      onCheck?.(checked);
      setValue(checked);
    },
    [onCheck, setValue],
  );

  const handleShowTermsAndConditions = React.useCallback(() => {
    setShowTermsAndConditions(true);
  }, []);

  const handleCloseTermsAndConditions = React.useCallback(() => {
    setShowTermsAndConditions(false);
  }, []);

  return (
    <div className="bs-fabrique-accept-terms-conditions__wrapper">
      <Checkbox
        errorMessage={error && t(error)}
        id={id}
        isChecked={value}
        isDisabled={disabled}
        isError={!!(touched && error)}
        isRequired={required}
        label={
          <AcceptTermsAndConditionsLabel
            handleShowTermsAndConditions={handleShowTermsAndConditions}
            label={label}
            type={type}
          />
        }
        onChange={handleChange}
      />
      <TermsAndConditionsModal
        onClose={handleCloseTermsAndConditions}
        open={showTermsAndConditions}
        termsAndConditions={termsAndConditions}
        type={type}
      />
    </div>
  );
};

export default React.memo(AcceptTermsAndConditions);
