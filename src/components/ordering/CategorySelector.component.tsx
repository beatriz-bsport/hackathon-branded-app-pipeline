import React from 'react';
import { useTranslation } from 'react-i18next';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import { Category } from '#components/ordering/types';

type Props = {
  categories: Array<Category>;
  selected: number | null;
  onChange: (category: { value: string; label: string }) => void;
};

export const CategorySelector = (props: Props) => {
  const { t } = useTranslation(['ordering']);
  const classes = useStyles();
  const options = [
    ...props.categories.map((category) => ({
      label: category.name,
      value: category.id.toString(10),
    })),
  ];
  return (
    <div className={classes.root}>
      <MaterialUISelector
        onChange={props.onChange}
        isMulti={false}
        value={options.find(
          (opt) => props.selected?.toString(10) === opt.value,
        )}
        placeholder={t('category.selector')}
        options={options}
        isClearable
      />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
    },
  }),
);

export default CategorySelector;
