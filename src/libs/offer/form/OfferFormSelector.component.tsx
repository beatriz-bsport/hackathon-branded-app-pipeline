import React, { useCallback } from 'react';

import Select from 'react-select';
import { Field, FieldInputProps, FieldProps, useFormikContext } from 'formik';

import { OfferFormValues } from '#libs/offer/types';

type SelectOption = {
  label: string;
  value: string | number;
};

type Props = {
  id?: string;
  name: string;
  options: SelectOption[];
  className?: string;
  placeholder: string;
  isError?: boolean;
  isClearable?: boolean;
  onSelectedOption?: (value: string | number) => void;
};

const OfferFormSelector = (props: Props) => {
  const {
    id,
    name,
    className,
    options,
    placeholder,
    isError,
    isClearable,
    onSelectedOption,
  } = props;
  const { setFieldValue } = useFormikContext<OfferFormValues>();

  const handleChange = useCallback(
    (option: SelectOption) => {
      setFieldValue(name, option?.value ?? null);
      onSelectedOption && onSelectedOption(option?.value);
    },
    [name, onSelectedOption, setFieldValue],
  );

  const getSelectedValue = useCallback(
    (field: FieldInputProps<any>) => {
      return options.find((option) => option.value === field.value);
    },
    [options],
  );

  return (
    <Field
      component={({ field }: FieldProps) => (
        <Select
          className={className}
          id={id}
          isClearable={isClearable}
          name={field.name}
          onChange={handleChange}
          options={options}
          placeholder={placeholder}
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              borderColor: isError ? 'red' : 'grey',
            }),
          }}
          value={getSelectedValue(field)}
        />
      )}
      name={name}
    />
  );
};
export default OfferFormSelector;
