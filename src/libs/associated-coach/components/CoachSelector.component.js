// @flow
import React from 'react';
import chroma from 'chroma-js';
import { withNamespaces } from 'react-i18next';

import { colors } from '@bsport/common/lib/colors';

import Select from 'react-select';
import type { Coach } from '../types';

const getCoachOptions = (coaches: Array<Coach>) =>
  coaches.map((c) => ({
    value: c.id,
    label: c.user.name,
  }));

const coachStyles = {
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

export default withNamespaces(['coach'])(({ t, coaches, selectOption }) => (
  <Select
    closeMenuOnSelect={false}
    isMulti
    placeholder={t('coach')}
    options={getCoachOptions(coaches.asMutable())}
    onChange={selectOption}
    styles={coachStyles}
  />
));
