import React from 'react';
import { useTranslation } from 'react-i18next';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';
import { Category } from '#src/components/ordering/types';

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
        isClearable
        isMulti={false}
        onChange={props.onChange}
        options={options}
        placeholder={t('category.selector')}
        value={options.find(
          (opt) => props.selected?.toString(10) === opt.value,
        )}
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
