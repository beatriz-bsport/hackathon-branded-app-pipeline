import { TFunction } from 'i18next';
import memoize from 'memoize-one';

import { Theme } from '@material-ui/core';
import { Level } from './types';

export const MAX_RESERVE_ID = 5;

export const getLevelColor = (id: number, color: string, theme: Theme) => {
  switch (id) {
    case 1:
      return theme.palette.secondary.main;
    case 2:
      return theme.palette.primary.light;
    case 3:
      return theme.palette.primary.main;
    case 4:
      return theme.palette.primary.dark;
    case 5:
      return theme.palette.grey[200];
    default:
      return color;
  }
};

export const LEVELS = [
  'level.all',
  'level.beginner',
  'level.intermediate',
  'level.advanced',
  'level.noDisplay',
];

export const getLevelTranslation = (id: number, name: string, t: TFunction) => {
  if (id && id <= MAX_RESERVE_ID && id >= 0) {
    return t(`translation:${LEVELS[id - 1]}`);
  }
  return name;
};

export const getGroupOptionsForSelect = memoize(
  (levels: Level[] = [], t: TFunction) => {
    const groupedOption = [...(levels ?? [])].reduce<
      [
        {
          label: string;
          options: { value: number; label: string }[];
        },
        {
          label: string;
          options: { value: number; label: string }[];
        },
      ]
    >(
      (acc, level) => {
        if (level.id <= MAX_RESERVE_ID) {
          acc[0].options.push({ value: level.id, label: level.name });
        } else {
          acc[1].options.push({ value: level.id, label: level.name });
        }
        return acc;
      },
      [
        {
          label: '',
          options: [],
        },
        {
          label: t('levels.customs'),
          options: [],
        },
      ],
    );

    // order by default order
    groupedOption[0].options.sort((a, b) => a.value - b.value);
    // order by name if customs
    groupedOption[1].options.sort((a, b) => a.label.localeCompare(b.label));

    return groupedOption;
  },
);
