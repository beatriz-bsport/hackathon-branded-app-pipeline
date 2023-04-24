// @ts-nocheck
import React from 'react';
import chroma from 'chroma-js';
import { useTranslation } from 'react-i18next';
import Select, { GroupTypeBase, OptionsType, Styles } from 'react-select';
import { colors } from '@bsport/common/lib/colors';

import type { Coach } from '../../types';

import { MIN_HEIGHT_VIDEO_SEARCH_BAR_FIELDS } from '#libs/video/constant';

type Props = {
  coaches: Array<Coach>;
  selectedCoaches: Array<number>;
  placeholder?: string;
  noMulti?: boolean;
  isDisabled?: boolean;
  closeMenuOnSelect?: boolean;
  selectOption: (
    value: OptionsType<{
      value: number;
      label: any;
    }>,
  ) => void;
  isClearable?: boolean;
  associatedCoachOutput?: boolean;
  isLoading?: boolean;
  shouldSetMinHeight?: boolean;
};

export const CoachSelector: React.FC<Props> = ({
  coaches,
  selectedCoaches,
  placeholder,
  noMulti,
  isDisabled,
  closeMenuOnSelect,
  selectOption,
  isClearable,
  associatedCoachOutput,
  isLoading,
  shouldSetMinHeight,
}) => {
  const { t } = useTranslation('coach');

  const getCoachOptions = (
    coachOptions: Array<Coach>,
    associatedCoachOutputOptions: boolean,
    sortDisabled?: boolean,
  ) => {
    coachOptions.sort((c, c_) => {
      if (c.user && c_.user) {
        if (c.user.name.toUpperCase() < c_.user.name.toUpperCase()) {
          return -1;
        }
        return 1;
      }
      return 1;
    });
    const enabledCoaches = coachOptions.filter((c) => !c.disabled);
    const disabledCoaches = coachOptions.filter((c) => c.disabled);
    if (!sortDisabled || disabledCoaches.length === 0) {
      return coachOptions.map((c) => ({
        value: associatedCoachOutputOptions ? c.associated_coach_id : c.id,
        label: c.user ? c.user.name : c.name,
      }));
    }
    return [
      {
        label: t('selector.enabled'),
        options: enabledCoaches.map((c) => ({
          value: associatedCoachOutputOptions ? c.associated_coach_id : c.id,
          label: c.user ? c.user.name : c.name,
        })),
      },
      {
        label: t('selector.disabled'),
        options: disabledCoaches.map((c) => ({
          value: associatedCoachOutputOptions ? c.associated_coach_id : c.id,
          label: c.user ? c.user.name : c.name,
        })),
      },
    ];
  };

  return (
    <Select
      shouldSetMinHeight={shouldSetMinHeight}
      closeMenuOnSelect={closeMenuOnSelect}
      isMulti={!noMulti}
      placeholder={placeholder || t('coach')}
      options={getCoachOptions([...coaches], associatedCoachOutput, true)}
      onChange={selectOption}
      isDisabled={isDisabled}
      styles={coachStyles}
      isClearable={isClearable}
      menuPortalTarget={document.querySelector('body')}
      value={
        selectedCoaches
          ? getCoachOptions(
              [...coaches.filter((c) => selectedCoaches.includes(c.id))],
              associatedCoachOutput,
            )
          : undefined
      }
      isLoading={isLoading}
    />
  );
};

const coachStyles: Partial<
  Styles<
    {
      value: number;
      label: any;
    },
    boolean,
    GroupTypeBase<{
      value: number;
      label: any;
    }>
  >
> = {
  control: (styles, { selectProps }) => {
    if (selectProps && selectProps.shouldSetMinHeight) {
      return {
        ...styles,
        backgroundColor: 'white',
        minHeight: MIN_HEIGHT_VIDEO_SEARCH_BAR_FIELDS,
      };
    }
    return { ...styles, backgroundColor: 'white' };
  },
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

export default CoachSelector;
