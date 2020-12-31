// @flow
import React from 'react';
import chroma from 'chroma-js';
import { withTranslation } from 'react-i18next';

import { colors } from '@bsport/common/lib/colors';

import Select from 'react-select';

const getCoachOptions = (coaches: Array<Coach>) => {
  coaches.sort((c, c_) => {
    if (c.user && c_.user) {
      if (c.user.name.toUpperCase() < c_.user.name.toUpperCase()) {
        return -1;
      }
      return 1;
    }
    if (c.name.toUpperCase() < c_.name.toUpperCase()) {
      return -1;
    }
    return 1;
  });
  return coaches.map((c) => ({
    value: c.id,
    label: c.user ? c.user.name : c.name,
  }));
};

const coachStyles = {
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

export default withTranslation([
  'coach',
])(
  ({
    t,
    coaches,
    selectedCoaches,
    placeholder,
    noMulti,
    isDisabled,
    closeMenuOnSelect,
    selectOption,
    isClearable,
  }) => (
    <Select
      closeMenuOnSelect={closeMenuOnSelect}
      isMulti={!noMulti}
      placeholder={placeholder || t('coach')}
      options={getCoachOptions([...coaches])}
      onChange={selectOption}
      isDisabled={isDisabled}
      styles={coachStyles}
      isClearable={isClearable}
      menuPortalTarget={document.querySelector('body')}
      value={
        selectedCoaches
          ? getCoachOptions([
              ...coaches.filter((c) => selectedCoaches.includes(c.id)),
            ])
          : undefined
      }
    />
  ),
);
