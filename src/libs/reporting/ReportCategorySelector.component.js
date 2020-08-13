// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import { getCategory } from './utils';
import type { ReportCategoryEnum } from './types';

type Props = {
  classes: { [string]: string },
  selected: ReportCategoryEnum,
  categories: ReportCategoryEnum[],
  onSelect: (ReportCategoryEnum) => void,
};

export function ReportCategorySelector({
  onSelect,
  selected,
  categories,
}: Props) {
  const cats = categories.map((c) => getCategory(c));
  const classes = useStyles();
  const { t } = useTranslation(['reporting']);
  return (
    <div>
      {cats.map((category) => {
        const Icon = category.icon;
        const isSelected = category.id === selected;
        const color = isSelected ? 'primary' : 'default';
        const onDelete = isSelected ? () => onSelect(null) : null;
        return (
          <Chip
            key={category.id}
            avatar={
              Icon ? (
                <Avatar>
                  <Icon />
                </Avatar>
              ) : null
            }
            color={color}
            label={t(`categories.${category.id}`)}
            className={classes.chip}
            clickable
            onDelete={onDelete}
            onClick={() => onSelect(category.id)}
          />
        );
      })}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(1) / 2,
  },
}));

export default ReportCategorySelector;
