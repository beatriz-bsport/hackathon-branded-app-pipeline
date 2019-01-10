// @flow

import React from 'react';
import { compose } from 'recompose';

import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import { CATEGORIES } from './utils';
import type { ReportCategoryEnum } from './types';

type Props = {
  classes: { [string]: string },
  selected: ReportCategoryEnum,
  categories: ReportCategoryEnum[],
  onSelect: (ReportCategoryEnum) => void,
};

export function ReportCategorySelector({
  classes,
  onSelect,
  selected,
  categories,
}: Props) {
  const cats = categories.map((c) => CATEGORIES.find((b) => b.id === c));
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
            label={category.name}
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

const styles = (theme) => ({
  chip: {
    margin: theme.spacing.unit / 2,
  },
});

export default compose(withStyles(styles))(ReportCategorySelector);
