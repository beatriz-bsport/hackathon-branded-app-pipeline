import React from 'react';

import { compose } from 'recompose';

import { withTranslation, WithTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { colors } from '@bsport/common/lib/colors.js';
import Select, { components } from 'react-select';
import chroma from 'chroma-js';
import type { MaterialStyleType } from '../../../../utils/types';

import FieldIcon from '../FieldIcon.component';

const getFieldOptions = (
  fieldOptions: Array<{ value: number; label: string }>,
) =>
  fieldOptions.map((option) => ({ value: option.value, label: option.label }));

// @ts-expect-error
const SingleValue = ({ children, ...props }) => (
  // @ts-expect-error
  <components.SingleValue {...props}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <FieldIcon
        field_id={props.selectProps.value[0].value}
        fontSize="small"
        // @ts-expect-error
        style={{ marginRight: '10px' }}
      />
      {props.selectProps.t(`customForm.field.${children}`)}
    </div>
  </components.SingleValue>
);

// @ts-expect-error
const Option = ({ children, ...props }) => (
  // @ts-expect-error
  <components.Option {...props}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <FieldIcon
        field_id={props.value}
        fontSize="small"
        // @ts-expect-error
        style={{ marginRight: '10px' }}
      />
      {props.selectProps.t(`customForm.field.${children}`)}
    </div>
  </components.Option>
);

const fieldStyles = {
  // @ts-expect-error
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  // @ts-expect-error
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  // @ts-expect-error
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    const color = chroma(colors.secondary);

    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? colors.secondary
        : isFocused
        ? color.alpha(0.1).css()
        : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : colors.secondary,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor:
          !isDisabled &&
          (isSelected ? colors.secondary : color.alpha(0.3).css()),
      },
    };
  },
  // @ts-expect-error
  multiValue: (styles) => {
    const color = chroma(colors.secondary);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  // @ts-expect-error
  multiValueLabel: (styles) => ({
    ...styles,
    color: colors.secondary,
  }),
  // @ts-expect-error
  multiValueRemove: (styles) => ({
    ...styles,
    color: colors.secondary,
    ':hover': {
      backgroundColor: colors.secondary,
      color: 'white',
    },
  }),
};

type OwnProps = {
  onChange: (option: { value: number; label: string }) => void;
  selectedOptions: Array<number>;
  disabled?: boolean;
  placeholder: string;
  noMulti: boolean;
  closeMenuOnSelect: boolean;
  isClearable: boolean;
  formFieldOptionList: Array<{ value: number; label: string }>;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;
export function CustomFormBuilderField(props: Props) {
  const {
    t,
    formFieldOptionList,
    selectedOptions,
    closeMenuOnSelect,
    noMulti,
    placeholder,
    onChange,
    isClearable,
    disabled,
  } = props;
  return (
    <Select
      closeMenuOnSelect={closeMenuOnSelect}
      components={{ SingleValue, Option }}
      isClearable={isClearable}
      isDisabled={disabled}
      isMulti={!noMulti}
      menuPortalTarget={document.querySelector('body')}
      onChange={onChange}
      options={getFieldOptions([...formFieldOptionList])}
      placeholder={placeholder || t('option')}
      styles={fieldStyles}
      t={t}
      value={
        selectedOptions
          ? getFieldOptions([
              ...formFieldOptionList.filter(
                (option: { value: number; label: string }) =>
                  selectedOptions.includes(option.value),
              ),
            ])
          : undefined
      }
    />
  );
}

const styles = () => ({
  root: {
    minWidth: 200,
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation('marketing'),
)(CustomFormBuilderField);
