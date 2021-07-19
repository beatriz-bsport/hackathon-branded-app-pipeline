// @flow

import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { colors } from '@bsport/common/lib/colors';
import Select from 'react-select';
import chroma from 'chroma-js';
import type { MaterialStyleType } from '../../../utils/types';
import { PrivateServiceWithSlots } from '../../private-service/types';

const getPrivateSlotOptions = (
  privateServiceList: Array<PrivateServiceWithSlots>,
) =>
  privateServiceList.map((service) => ({
    label: service.name,
    options: [
      ...(service.slots?.length
        ? service.slots.map((slot) => ({
            label: slot.name,
            value: slot.id,
          }))
        : []),
    ],
  }));

const ruleStyles = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    const color = chroma(colors.secondary);
    /* eslint-disable */
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
    /* eslint-enable */
  },
  multiValue: (styles) => {
    const color = chroma(colors.secondary);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles) => ({
    ...styles,
    color: colors.secondary,
  }),
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
  onChange: (Suggestion: { label: string; value: number }) => void;
  privateServiceList: Array<PrivateServiceWithSlots>;
  selectedServices: Array<number>;
  disabled?: boolean;
  placeholder: string;
  noMulti: boolean;
  closeMenuOnSelect: boolean;
  isClearable: boolean;
  isGroupSelect: boolean;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;
export function PrivateSlotSelectorStyled(props: Props) {
  const {
    t,
    privateServiceList,
    selectedServices,
    closeMenuOnSelect,
    noMulti,
    placeholder,
    onChange,
    isClearable,
    disabled,
    isGroupSelect,
  } = props;

  const privateServiceSelected = selectedServices
    ? getPrivateSlotOptions([...privateServiceList]).filter((suggestions) =>
        suggestions.options.find(
          (option) => option.value === selectedServices[0],
        ),
      )
    : undefined;
  const value =
    privateServiceSelected &&
    privateServiceSelected.length &&
    privateServiceSelected[0].options.length &&
    privateServiceSelected[0].options.find((option) =>
      selectedServices.includes(option.value),
    );
  return (
    <Select
      closeMenuOnSelect={closeMenuOnSelect}
      isMulti={!noMulti}
      placeholder={placeholder || t('coach')}
      options={getPrivateSlotOptions([...privateServiceList])}
      onChange={onChange}
      isDisabled={disabled}
      styles={ruleStyles}
      isClearable={isClearable}
      menuPortalTarget={document.querySelector('body')}
      value={value}
      isGroupSelect={isGroupSelect}
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
  withTranslation(['paymentRules']),
)(PrivateSlotSelectorStyled);
