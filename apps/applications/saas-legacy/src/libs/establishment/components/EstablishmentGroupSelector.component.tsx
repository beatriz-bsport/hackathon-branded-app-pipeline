import React from 'react';
import chroma from 'chroma-js';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { colors } from '@bsport/common/lib/colors.js';
import Select from 'react-select';
import { styleFn, StylesConfig } from 'react-select/lib/styles';
import type {
  EstablishmentGroup,
  EstablishmentGroupSelectOption,
} from '../types';

const getEstablishmentGroupOptions = (
  establishmentGroup: Array<EstablishmentGroup>,
) => {
  return establishmentGroup.map((group) => {
    return {
      label: group.name,
      value: group.id,
      establishments: group.establishment
        ? group.establishment.filter((est) => !!est).map((est) => est.id)
        : [],
    };
  });
};

const establishmentGroupStyles: StylesConfig = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    const color = chroma(colors.secondary);

    let backgroundColor;
    if (isDisabled) {
      backgroundColor = null;
    } else if (isSelected) {
      backgroundColor = colors.secondary;
    } else if (isFocused) {
      backgroundColor = color.alpha(0.1).css();
    } else {
      backgroundColor = null;
    }

    let colorValue;
    if (isDisabled) {
      colorValue = '#ccc';
    } else if (isSelected) {
      if (chroma.contrast(color, 'white') > 2) {
        colorValue = 'white';
      } else {
        colorValue = 'black';
      }
    } else {
      colorValue = colors.secondary;
    }

    return {
      ...styles,
      backgroundColor,
      color: colorValue,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        // @ts-expect-error
        ...styles[':active'],
        backgroundColor:
          !isDisabled &&
          (isSelected ? colors.secondary : color.alpha(0.3).css()),
      },
      groupHeading: ((base) => ({ ...base, margin: 0 })) as styleFn,
    };
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
  establishmentGroups: Array<EstablishmentGroup>;
  selectOption: (
    suggestion:
      | Omit<EstablishmentGroupSelectOption, 'establishmentGroupList'>[]
      | Omit<EstablishmentGroupSelectOption, 'establishmentGroupList'>,
  ) => void;
  selectMultipleOptions?: (itemsValueList: Array<number>) => void;
  selectedEstablishmentGroups: Array<number> | null;
  disabled?: boolean;
  noMulti?: boolean;
  closeMenuOnSelect: boolean;
  isClearable?: boolean;
  nullCurrentValue?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  onChange?: () => void;
};

type Props = OwnProps & WithTranslation;
export function EstablishmentGroupSelector(props: Props) {
  const {
    t,
    establishmentGroups,
    selectOption,
    selectMultipleOptions,
    selectedEstablishmentGroups,
    closeMenuOnSelect,
    nullCurrentValue,
    disabled,
    noMulti,
    isClearable,
    isLoading,
    placeholder,
    onChange,
  } = props;
  const roomsSelected =
    !nullCurrentValue && selectedEstablishmentGroups
      ? getEstablishmentGroupOptions([
          ...establishmentGroups.filter((eg) =>
            selectedEstablishmentGroups.includes(eg.id),
          ),
        ])
      : null;

  return (
    <Select
      closeMenuOnSelect={!!closeMenuOnSelect}
      isClearable={isClearable}
      isDisabled={disabled}
      isLoading={isLoading}
      isMulti={!noMulti}
      menuPortalTarget={document.querySelector('body')}
      onChange={selectOption || onChange}
      options={getEstablishmentGroupOptions([...establishmentGroups])}
      placeholder={placeholder || t('localisation')}
      selectMultipleOptions={selectMultipleOptions}
      styles={establishmentGroupStyles}
      value={roomsSelected}
    />
  );
}

export default compose<any, OwnProps>(withTranslation(['establishment']))(
  EstablishmentGroupSelector,
);
