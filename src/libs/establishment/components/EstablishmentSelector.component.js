// @flow
import React from 'react';
import chroma from 'chroma-js';
import { withTranslation } from 'react-i18next';

import { colors } from '@bsport/common/lib/colors';

import Select from 'react-select';

const getEstablishmentOptions = (establishments: Array<Establishment>) => {
  establishments.sort((e, e_) => {
    if (e.title.toUpperCase() < e_.title.toUpperCase()) {
      return -1;
    }
    return 1;
  });
  return establishments.map((e) => ({
    value: e.id,
    label: e.title,
  }));
};

const establishmentStyles = {
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

export default withTranslation(['establishment'])(
  ({
    t,
    establishments,
    selectOption,
    selectedEstablishments,
    closeMenuOnSelect,
    nullCurrentValue,
    disabled,
    noMulti,
    isClearable,
  }) => (
    <Select
      closeMenuOnSelect={!!closeMenuOnSelect}
      nullCurrentValue={!!nullCurrentValue}
      isMulti={!noMulti}
      placeholder={t('establishment')}
      options={getEstablishmentOptions([...establishments])}
      styles={establishmentStyles}
      onChange={selectOption}
      isDisabled={disabled}
      isClearable={isClearable}
      menuPortalTarget={document.querySelector('body')}
      value={
        selectedEstablishments
          ? getEstablishmentOptions([
              ...establishments.filter((e) =>
                selectedEstablishments.includes(e.id),
              ),
            ])
          : undefined
      }
    />
  ),
);
