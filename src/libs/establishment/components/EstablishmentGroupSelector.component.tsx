// @flow
import React from 'react';
import chroma from 'chroma-js';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { colors } from '@bsport/common/lib/colors';
import Select from 'react-select';
import type { EstablishmentGroup, Establishment } from '../types';

const getEstablishmentGroupOptions = (
  establishmentGroup: Array<EstablishmentGroup>,
) => {
  return establishmentGroup.map((group) => {
    return {
      label: group.name,
      value: group.id,
      establishments: group.establishment
        .filter((est) => !!est)
        .map((est) => est.id),
    };
  });
};

const establishmentGroupStyles = {
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
            groupHeading: (base) => ({ ...base, margin: 0 }),
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
  establishmentGroups: EstablishmentGroup[];
  selectOption: (Suggestion: {
    label: string;
    value: number | string;
    establishmentList?: Array<Establishment>;
  }) => void;
  selectMultipleOptions: (itemsValueList: Array<number>) => void;
  selectedEstablishmentGroups: Array<EstablishmentGroup> | null;
  disabled?: boolean;
  noMulti: boolean;
  closeMenuOnSelect: boolean;
  isClearable: boolean;
  nullCurrentValue: boolean;
  isLoading?: boolean;
  onChange: () => void;
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
    onChange,
  } = props;
  const roomsSelected = nullCurrentValue
    ? null
    : getEstablishmentGroupOptions([...selectedEstablishmentGroups]);
  return (
    <Select
      closeMenuOnSelect={!!closeMenuOnSelect}
      isMulti={!noMulti}
      placeholder={t('localisation')}
      options={getEstablishmentGroupOptions([...establishmentGroups])}
      styles={establishmentGroupStyles}
      onChange={selectOption || onChange}
      isDisabled={disabled}
      isClearable={isClearable}
      menuPortalTarget={document.querySelector('body')}
      value={roomsSelected}
      selectMultipleOptions={selectMultipleOptions}
      isLoading={isLoading}
    />
  );
}

export default compose<any, OwnProps>(withTranslation(['establishment']))(
  EstablishmentGroupSelector,
);
