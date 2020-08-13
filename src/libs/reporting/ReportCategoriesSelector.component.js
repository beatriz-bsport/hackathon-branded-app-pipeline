// @flow

import React from 'react';

import { useTranslation } from 'react-i18next';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

import { getCategory } from './utils';
import type { ReportCategoryEnum } from './types';

type Props = {
  classes: { [string]: string },
  selected: ReportCategoryEnum,
  categories: ReportCategoryEnum[],
  globalCategories: array,
  onSelect: (ReportCategoryEnum) => void,
};

function getCategories(name, tab1, tab2) {
  const A = [];
  if (tab1 && tab2) {
    tab2.map((a, i) => {
      return tab1[i] === name && A.push(a);
    });
  }
  return A;
}

function isSelectedGlobalCategory(cats, selected) {
  let isSelected = false;
  cats.map((c) => {
    if (c.id === selected) {
      isSelected = true;
      return isSelected;
    }
    return isSelected;
  });
  return isSelected;
}

export const ReportCategoriesSelector = ({
  onSelect,
  selected,
  categories,
  globalCategories,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['reporting']);
  const globalCategoryChoices = ['Club', 'Bookings', 'Products', 'Payments'];
  const initial = !selected;
  return (
    <div>
      {globalCategoryChoices.map((name) => {
        const A = getCategories(name, globalCategories, categories);
        const cats = A.map((c) => getCategory(c));
        const isSelectedCategory = isSelectedGlobalCategory(cats, selected);
        return (
          <div>
            {(isSelectedCategory || initial) && (
              <div>{t(`globalCategories.${name}`)}</div>
            )}
            <div className={classes.categories}>
              {cats.map((category) => {
                const Icon = category.icon;
                const isSelected = category.id === selected;
                const color = isSelected ? 'primary' : 'default';
                const onDelete = isSelected ? () => onSelect('') : null;
                return (
                  <div>
                    {(isSelected || initial) && (
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
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  categories: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(1) / 2,
  },
}));

export default ReportCategoriesSelector;
