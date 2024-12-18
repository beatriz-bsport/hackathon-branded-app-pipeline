import React from 'react';

import Selectfield from '#Fabrique/Temporary/Selectfield';
import { Country } from './types';
import { useField } from 'formik';

import './styles.css';

export type Props = {
  countries: Country[];
  id: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  label: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const CountrySignUpField: React.FC<Props> = ({
  countries,
  id,
  isDisabled,
  isRequired,
  label,
  name,
  onChange,
  placeholder,
}) => {
  const [{ value }] = useField<string>(name);

  const countrySelection = React.useMemo(
    () =>
      [
        ...[...(countries ?? [])]
          .sort((a, b) => a.label.localeCompare(b.label))
          .slice(),
      ].map((country: Country) => ({
        label: country.label,
        value: country.label,
      })),
    [countries],
  );

  return (
    <div className="bs-fabrique-country-field__wrapper">
      <Selectfield
        classes={{ menuContent: 'bs-fabrique-country-field__menu-content' }}
        className="bs-fabrique-country-field"
        id={id}
        isDisabled={isDisabled}
        isRequired={isRequired}
        label={label}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        selectedItem={value && { label: value, value }}
        suggestions={countrySelection}
      />
    </div>
  );
};

export default React.memo(CountrySignUpField);
