// @ts-nocheck
import React from 'react';

import { useTranslation } from 'react-i18next';
import Chip from '@material-ui/core/Chip';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';
import { getCategory } from '../utils';

type Props = {
  selected: ReportCategoryEnum;
  categories: ReportCategoryEnum[];
  globalCategories: ReportCategoryEnum[];
  onSelect: (value: string) => void;
};

function getCategoriesInCategoryGroup(
  name: string,
  tab1: ReportCategoryEnum[],
  tab2: ReportCategoryEnum[],
) {
  const buffer: ReportCategoryEnum[] = [];
  if (tab1 && tab2) {
    tab2.map((a, i) => {
      return tab1[i] === name && buffer.push(a);
    });
  }
  return buffer;
}

const ReportCategoriesSelector: React.FC<Props> = ({
  onSelect,
  selected,
  categories: categoriesProps,
  globalCategories,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['reporting']);

  const globalCategoryChoices = ['Club', 'Bookings', 'Products', 'Payments'];
  const initial = !selected;

  return (
    <div>
      {globalCategoryChoices.map((name) => {
        const categories = getCategoriesInCategoryGroup(
          name,
          globalCategories,
          categoriesProps,
        );
        const categoriesDetail = categories.map((c) => getCategory(c));
        const isSelectedCategory = categoriesDetail.some(
          (c) => c.id === selected,
        );

        return (
          <div>
            {(isSelectedCategory || initial) && (
              <div>{t(`globalCategories.${name}`)}</div>
            )}
            <div className={classes.categories}>
              {categoriesDetail.map((category) => {
                const Icon = category.icon;
                const isSelected = category.id === selected;
                const color = isSelected ? 'primary' : 'default';
                const onDelete = isSelected ? () => onSelect('') : null;

                return (
                  <div>
                    {(isSelected || initial) && (
                      <Chip
                        key={category.id}
                        icon={Icon ? <Icon /> : null}
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

const useStyles = makeStyles((theme: Theme) => ({
  categories: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(1) / 2,
  },
}));

export default ReportCategoriesSelector;
