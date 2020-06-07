// @flow
import React from 'react';
import chroma from 'chroma-js';
import { withTranslation } from 'react-i18next';

import Select from 'react-select';
import { colors } from '@bsport/common/lib/colors';

const getSCTOptions = (scts: Array<Coach>) => {
  scts.sort((c, c_) => {
    if (c.name.toUpperCase() < c_.name.toUpperCase()) {
      return -1;
    }
    return 1;
  });
  return scts.map((c) => ({
    value: c.id,
    label: c.name,
    data: c,
  }));
};

const sctStyles = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
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

export default withTranslation(['translation'])(
  ({
    t,
    scts,
    isNotMulti,
    closeMenuOnSelect,
    isClearable,
    selectOption,
    selectedValues,
  }) => (
    <Select
      closeMenuOnSelect={!!closeMenuOnSelect}
      isMulti={!isNotMulti}
      placeholder={t('common.sports')}
      options={getSCTOptions([...scts])}
      isClearable={isClearable}
      value={
        selectedValues
          ? getSCTOptions(
              [...scts].filter((sct) => selectedValues.includes(sct.id)),
            )
          : undefined
      }
      onChange={selectOption}
      styles={sctStyles}
    />
  ),
);
