import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useField } from 'formik';
import Checkbox from '#Fabrique/Checkbox';
import Typography from '#Fabrique/Typography';
import { REQUIRED_SYMBOL } from '#Fabrique/constants';
import './styles.css';

type MultipleCheckboxFieldClasses = {
  label?: string;
  captionText?: string;
  errorMessage?: string;
};

export type MultipleCheckboxfieldProps = {
  name: string;
  captionText?: string;
  choices: {
    optionLabel: string;
    value: string;
  }[];
  classes?: MultipleCheckboxFieldClasses;
  disabled: boolean;
  label: string;
  id: string;
  isRequired?: boolean;
};

const MultipleCheckboxfield: React.FC<MultipleCheckboxfieldProps> = ({
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

  const [field, meta, form] = useField<string[]>(name);
  const { error } = meta;
  const { setValue } = form;

  const handleSelect = React.useCallback(
    (value: string) => () => {
      if (!field.value) {
        setValue([value]);
      } else {
        const newValue = field.value?.some(
          (fieldValue: string) => fieldValue === value,
        )
          ? field.value?.filter((fieldValue: string) => fieldValue !== value)
          : [...field.value, value];
        setValue(newValue);
      }
    },
    [field.value, setValue],
  );

  return (
    <div className="bs-fabrique-multiple-checkbox-field" id={id}>
      <Typography
        className={classNames(
          'bs-fabrique-multiple-checkbox-field__label',
          {
            'bs-fabrique-multiple-checkbox-field__label--disabled': disabled,
          },
          classes?.label,
        )}
        variant="body-md"
      >
        {label}
        <span
          className={classNames(
            'bs-fabrique-multiple-checkbox-field__label--required',
            {
              'bs-fabrique-multiple-checkbox-field__label--disabled': disabled,
              'bs-fabrique-multiple-checkbox-field__label--empty': !isRequired,
            },
          )}
        >
          {REQUIRED_SYMBOL}
        </span>
      </Typography>
      {choices?.map(({ value, optionLabel }) => (
        <Checkbox
          key={value}
          id={value}
          isChecked={
            field.value
              ? field.value.some(
                  (selectedOption: string) => selectedOption === value,
                )
              : false
          }
          isDisabled={disabled}
          label={optionLabel}
          name={name}
          onChange={handleSelect(value)}
        />
      ))}
      <Typography
        className={classNames(
          'bs-fabrique-multiple-checkbox-field__capion-text',
          {
            'bs-fabrique-multiple-checkbox-field__capion-text--hidden':
              !captionText,
          },
          classes?.captionText,
        )}
        variant="body-sm"
      >
        {captionText}
      </Typography>
      <Typography
        className={classNames(
          'bs-fabrique-multiple-checkbox-field__error-message',
          {
            'bs-fabrique-multiple-checkbox-field__error-message--hidden':
              !error,
          },
          classes?.errorMessage,
        )}
        color="error"
        variant="body-sm"
      >
        {error && t(error)}
      </Typography>
    </div>
  );
};

export default React.memo(MultipleCheckboxfield);
