// @flow
import React from 'react';
import { Field, FieldInputProps, FieldProps, FormikProps } from 'formik';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import SCTChip from '#libs/category/components/SCTChip.component';
import { SCT } from '#libs/category/types';

type FieldTypeBase = {
  [name: string]: number;
};

type SCTOptionType = { label: string; value: number; parentCategory: number };

type SCTSelectorFieldProps = {
  fullWidth: boolean;
  label: string;
  scts: Array<SCT>;
  name: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
};

function SCTSelectorForm<T extends FieldTypeBase>({
  field,
  form: { setFieldValue, touched, errors },
  fullWidth,
  label,
  scts,
  name,
  onBlur,
  required,
}: {
  field: FieldInputProps<number>;
  form: FormikProps<T>;
  fullWidth: boolean;
  label: string;
  scts: Array<SCT>;
  name: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  const handleChange = React.useCallback(
    (option: SCTOptionType) => {
      setFieldValue(field.name, option?.value);
    },
    [setFieldValue, field.name],
  );

  const chipsRenderer = React.useCallback(
    (chipProps: {
      data: {
        label: string;
        value: number;
        parentCategory: number;
      };
      onDelete: () => void;
    }) => (
      <SCTChip
        onDelete={chipProps.onDelete}
        parentCategory={chipProps.data.parentCategory}
        SCTName={chipProps.data.label}
      />
    ),
    [],
  );

  const options = React.useMemo(
    () => [
      ...scts?.map((category) => ({
        label: category.name,
        value: category.id,
        parentCategory: category.SCS.id,
      })),
    ],
    [scts],
  );

  const value = React.useMemo(
    () =>
      field.value && {
        label: scts.find((category) => category.id === field.value)?.name,
        value: field.value,
        parentCategory: scts.find((category) => category.id === field.value)
          ?.SCS.id,
      },
    [field.value, scts],
  );

  return (
    <FormControl
      error={!!(touched[name] && errors[name])}
      fullWidth={fullWidth}
      required={required}
    >
      {label && (
        <div style={{ marginBottom: 16 }}>
          <InputLabel shrink htmlFor="select-helper">
            {label}
          </InputLabel>
        </div>
      )}
      <MaterialUISelector<SCTOptionType>
        inScrollBar
        chipsRenderer={chipsRenderer}
        error={!!(touched[field.name] && errors[field.name])}
        isMulti={false}
        name={field.name}
        onBlur={onBlur}
        onChange={handleChange}
        options={options}
        placeholder={label}
        value={value}
      />
    </FormControl>
  );
}

function SCTSelectorField<T extends FieldTypeBase>(
  props: SCTSelectorFieldProps,
) {
  const { fullWidth, label, scts, onBlur, required, name } = props;

  return (
    <>
      <Field name={name}>
        {({ field, form }: FieldProps) => (
          <SCTSelectorForm<T>
            field={field}
            form={form}
            fullWidth={fullWidth}
            label={label}
            name={name}
            onBlur={onBlur}
            required={required}
            scts={scts}
          />
        )}
      </Field>
    </>
  );
}

export default SCTSelectorField;
