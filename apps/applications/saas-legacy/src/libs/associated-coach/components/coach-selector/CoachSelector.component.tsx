import React, { FocusEventHandler, useCallback } from 'react';
import chroma from 'chroma-js';
import { useTranslation } from 'react-i18next';
import Select, {
  // @ts-expect-error
  ActionMeta,
  // @ts-expect-error
  GroupTypeBase,
  // @ts-expect-error
  OptionsType,
  // @ts-expect-error
  Styles,
} from 'react-select';
import { colors } from '@bsport/common/lib/colors.js';
import { Typography } from '@material-ui/core';
import Immutable from 'seamless-immutable';

import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization.js';
import { getCoachDisplayName } from '@bsport/common/lib/master-data/coach.js';
import { MIN_HEIGHT_VIDEO_SEARCH_BAR_FIELDS } from '#src/libs/video/constant';
import type { Coach } from '../../types';

type Props = {
  id?: string;
  coaches: Array<Coach> | Immutable.Immutable<Array<Coach>>;
  selectedCoaches: Array<number>;
  placeholder?: string;
  noMulti?: boolean;
  isDisabled?: boolean;
  closeMenuOnSelect?: boolean;
  selectOption: ((
    value:
      | { value: number; label: string }
      | OptionsType<{ value: number; label: string }>,
    actionMeta: ActionMeta<{ value: number; label: string }>,
  ) => void) &
    ((
      value: { value: number; label: string } | OptionsType<any>,
      action: ActionMeta<any>,
    ) => void);
  isClearable?: boolean;
  associatedCoachOutput?: boolean;
  isLoading?: boolean;
  shouldSetMinHeight?: boolean;
  selectorClass?: string;
  error?: string;
  isError?: boolean;
  onBlur?: FocusEventHandler<HTMLSelectElement>;
  coachDisplay?: MarketPlaceCoachDisplay;
};

export const CoachSelector: React.FC<Props> = ({
  id,
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
  selectorClass,
  error,
  isError,
  onBlur,
  coachDisplay,
}) => {
  const { t } = useTranslation('coach');

  const getOptionLabel: (coach: Coach) => string = useCallback(
    (coach: Coach) => {
      const coachName = getCoachDisplayName(
        coachDisplay,
        coach?.name,
        coach?.firstname,
      );
      // @ts-expect-error
      return coach.user ? coach.user.name : coachName;
    },
    [coachDisplay],
  );

  const getCoachOptions = (
    coachOptions: Array<Coach>,
    associatedCoachOutputOptions: boolean,
    sortDisabled?: boolean,
  ) => {
    coachOptions.sort((c, c_) => {
      // @ts-expect-error
      if (c.user && c_.user) {
        // @ts-expect-error
        if (c.user.name.toUpperCase() < c_.user.name.toUpperCase()) {
          return -1;
        }
        return 1;
      }
      return 1;
    });
    const enabledCoaches = coachOptions?.filter((c) => !c.disabled) ?? [];
    const disabledCoaches = coachOptions?.filter((c) => c.disabled) ?? [];
    if (!sortDisabled || disabledCoaches.length === 0) {
      return coachOptions.map((coach) => ({
        value: associatedCoachOutputOptions
          ? coach.associated_coach_id
          : coach.id,
        label: getOptionLabel(coach),
      }));
    }
    return [
      {
        label: t('selector.enabled'),
        options: enabledCoaches.map((coach) => ({
          value: associatedCoachOutputOptions
            ? coach.associated_coach_id
            : coach.id,
          label: getOptionLabel(coach),
        })),
      },
      {
        label: t('selector.disabled'),
        options: disabledCoaches.map((coach) => ({
          value: associatedCoachOutputOptions
            ? coach.associated_coach_id
            : coach.id,
          label: getOptionLabel(coach),
        })),
      },
    ];
  };

  return (
    <>
      <Select
        className={selectorClass}
        closeMenuOnSelect={closeMenuOnSelect}
        id={id}
        isClearable={isClearable}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isMulti={!noMulti}
        menuPortalTarget={document.querySelector('body')}
        onBlur={onBlur}
        onChange={selectOption}
        options={getCoachOptions([...coaches], associatedCoachOutput, true)}
        placeholder={placeholder || t('coach')}
        shouldSetMinHeight={shouldSetMinHeight}
        styles={{ ...coachStyles, ...controlStyle(isError) }}
        value={
          selectedCoaches &&
          getCoachOptions(
            [...coaches.filter((c) => selectedCoaches.includes(c.id))],
            associatedCoachOutput,
          )
        }
      />

      {error && (
        <Typography color="error" variant="caption">
          {error}
        </Typography>
      )}
    </>
  );
};

const controlStyle = (isError: boolean) => {
  return {
    control: (styles: any, { selectProps }: any) => {
      if (selectProps && selectProps.shouldSetMinHeight) {
        return {
          ...styles,
          borderColor: isError ? 'red' : 'grey',
          backgroundColor: 'white',
          minHeight: MIN_HEIGHT_VIDEO_SEARCH_BAR_FIELDS,
        };
      }
      return {
        ...styles,
        backgroundColor: 'white',
        borderColor: isError ? 'red' : 'grey',
      };
    },
  };
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
  // @ts-expect-error
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  // @ts-expect-error
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    const color = chroma(colors.secondary);

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
  },
  // @ts-expect-error
  multiValue: (styles) => {
    const color = chroma(colors.secondary);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  // @ts-expect-error
  multiValueLabel: (styles) => ({
    ...styles,
    color: colors.secondary,
  }),
  // @ts-expect-error
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
