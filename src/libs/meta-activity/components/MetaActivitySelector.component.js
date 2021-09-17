// @flow
import React from 'react';
import chroma from 'chroma-js';
import { withTranslation } from 'react-i18next';

import { colors } from '@bsport/common/lib/colors';

import Select from 'react-select';

const getMetaActivityOptions = (metaActivities: Array<MetaActivity>) => {
  metaActivities.sort((ma, ma_) => {
    if (ma.name.toUpperCase() < ma_.name.toUpperCase()) {
      return -1;
    }
    return 1;
  });
  return metaActivities.map((ma) => ({
    value: ma.id,
    label: ma.name,
  }));
};

const metaActivityStyles = {
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

export default withTranslation(['metaActivity'])(
  ({
    t,
    metaActivities,
    noMulti,
    disabled,
    selectOption,
    closeMenuOnSelect,
    selectedMetaActivities,
    variant,
    isLoading,
    onChange,
  }) => {
    let placeholder = t('metaActivity');

    if (variant === 'activity') {
      placeholder = t('metaActivity');
    } else if (variant === 'workshop') {
      placeholder = t('workshop');
    }
    return (
      <div style={{ zIndex: 9999 }}>
        <Select
          closeMenuOnSelect={closeMenuOnSelect}
          isMulti={!noMulti}
          placeholder={placeholder}
          onChange={selectOption || onChange}
          isDisabled={disabled}
          options={getMetaActivityOptions([...metaActivities])}
          value={
            selectedMetaActivities
              ? getMetaActivityOptions([
                  ...metaActivities.filter((ma) =>
                    selectedMetaActivities.includes(ma.id),
                  ),
                ])
              : undefined
          }
          styles={metaActivityStyles}
          menuPortalTarget={document.querySelector('body')}
          isLoading={isLoading}
        />
      </div>
    );
  },
);
