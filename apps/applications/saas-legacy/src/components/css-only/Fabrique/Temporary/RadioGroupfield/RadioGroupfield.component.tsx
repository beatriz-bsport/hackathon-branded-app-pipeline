import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useField } from 'formik';
import Typography from '#Fabrique/Typography';
import RadioButton from '#Fabrique/RadioButtonV2';
import { REQUIRED_SYMBOL } from '#Fabrique/constants';
import './styles.css';

type RadioGroupfieldClasses = {
  label?: string;
  captionText?: string;
  errorMessage?: string;
};

export type RadioGroupfieldProps = {
  name: string;
  captionText?: string;
  choices: {
    optionLabel: string;
    value: string;
  }[];
  classes?: RadioGroupfieldClasses;
  disabled: boolean;
  label: string;
  id: string;
  isRequired?: boolean;
};

const RadioGroupfield: React.FC<RadioGroupfieldProps> = ({
  name,
  captionText,
  choices,
  classes,
  disabled,
  label,
  id,
  isRequired = false,
}) => {
  const { t } = useTranslation('marketing');

  const [field, meta, form] = useField<string>(name);

  const { setValue } = form;

  const handleSelect = React.useCallback(
    (value: string) => () => {
      if (field.value !== value) {
        setValue(value);
      }
    },
    [setValue, field.value],
  );

  return (
    <div className="bs-fabrique-radio-group-field" id={id}>
      <Typography
        className={classNames(
          'bs-fabrique-radio-group-field__label',
          {
            'bs-fabrique-radio-group-field__label--disabled': disabled,
          },
          classes?.label,
        )}
        variant="body-md"
      >
        {label}
        <span
          className={classNames(
            'bs-fabrique-radio-group-field__label--required',
            {
              'bs-fabrique-radio-group-field__label--disabled': disabled,
              'bs-fabrique-radio-group-field__label--empty': !isRequired,
            },
          )}
        >
          {REQUIRED_SYMBOL}
        </span>
      </Typography>
      {choices?.map(({ value, optionLabel }) => (
        <RadioButton
          key={value}
          id={value}
          isChecked={field.value === value}
          isDisabled={disabled}
          label={optionLabel}
          name={name}
          onClick={handleSelect(value)}
        />
      ))}
      <Typography
        className={classNames(
          'bs-fabrique-radio-group-field__capion-text',
          {
            'bs-fabrique-radio-group-field__capion-text--hidden': !captionText,
          },
          classes?.captionText,
        )}
        variant="body-sm"
      >
        {captionText}
      </Typography>
      <Typography
        className={classNames(
          'bs-fabrique-radio-group-field__error-message',
          {
            'bs-fabrique-radio-group-field__error-message--hidden': !meta.error,
          },
          classes?.errorMessage,
        )}
        color="error"
        variant="body-sm"
      >
        {meta.error && t(meta.error)}
      </Typography>
    </div>
  );
};

export default React.memo(RadioGroupfield);
