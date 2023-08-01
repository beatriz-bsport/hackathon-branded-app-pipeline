import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';
import { getCategory } from '../utils';

type Props = {
  selected: ReportCategoryEnum;
  categories: ReportCategoryEnum[];
  onSelect: (id: string) => void;
};

const ReportCategorySelector: React.FC<Props> = ({
  onSelect,
  selected,
  categories,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['reporting']);

  const handleDelete = (isSelected: boolean) => () => {
    if (!isSelected) return;
    onSelect(null);
  };

  const handleSelect = (id: string) => () => {
    onSelect(id);
  };
  const cats = categories.map((c) => getCategory(c));

  return (
    <div className={classes.container}>
      {cats.map((category) => {
        const Icon = category.icon;
        const isSelected = category.id === selected;
        const color = isSelected ? 'primary' : 'default';

        return (
          <div key={category.id}>
            <Chip
              clickable
              avatar={
                Icon ? (
                  <Avatar>
                    <Icon />
                  </Avatar>
                ) : null
              }
              className={classes.chip}
              color={color}
              label={t(`categories.${category.id}`)}
              onClick={handleSelect(category.id)}
              onDelete={handleDelete(isSelected)}
            />
          </div>
        );
      })}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(1) / 2,
  },
  categories: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}));

export default ReportCategorySelector;
