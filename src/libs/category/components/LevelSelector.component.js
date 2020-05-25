// @flow
import React from 'react';
import chroma from 'chroma-js';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Select from 'react-select';
import LEVELS from '@bsport/common/lib/master-data/levels';
import { getLevelColorById } from '@bsport/common/lib/colors';

const levelOptions = (levels, t: TFunction) =>
  levels.map((l) => ({
    value: l.id,
    color: getLevelColorById(l.id),
    label: t(`level.${l.text}`),
  }));

const levelStyles = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    /* eslint-disable */
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor:
          !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
      },
    };
    /* eslint-enable */
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
};

export default withTranslation()(
  ({
    t,
    isNotMulti,
    closeMenuOnSelect,
    isClearable,
    selectOption,
    selectedLevels,
  }) => (
    <Select
      closeMenuOnSelect={!!closeMenuOnSelect}
      isMulti={!isNotMulti}
      placeholder={t('common.level')}
      options={levelOptions(LEVELS, t)}
      isClearable={isClearable}
      value={
        selectedLevels
          ? levelOptions(LEVELS.filter((l) => selectedLevels.includes(l.id)), t)
          : undefined
      }
      onChange={selectOption}
      styles={levelStyles}
    />
  ),
);
