import { makeStyles, Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import React, { useCallback } from 'react';

type Props = {
  setShowCategoryDialog: (show: boolean) => void;
};

export const AddCategoryButton = (props: Props) => {
  const { t } = useTranslation(['ordering']);
  const classes = useStyles();

  const onClick = useCallback(() => props.setShowCategoryDialog(true), [props]);

  return (
    <div className={classes.buttonRow}>
      <Button
        variant="outlined"
        onClick={onClick}
        color="primary"
        startIcon={<AddIcon color="primary" />}
      >
        {t('category.add')}
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  buttonRow: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(2),
  },
}));

export default AddCategoryButton;
