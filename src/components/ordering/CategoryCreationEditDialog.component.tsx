import { useTranslation } from 'react-i18next';
import React, { useCallback } from 'react';
import Alert from '@material-ui/lab/Alert/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core';
import { Category } from '#components/ordering/types';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  categorySelected: Category | null;
  categoryCreationHelper?: string;
};

export const CategoryCreationEditDialog = (props: Props) => {
  const { categorySelected } = props;
  const { t } = useTranslation(['ordering']);
  const classes = useStyles();
  const [categoryName, setCategoryName] = React.useState(
    categorySelected?.name || '',
  );

  React.useEffect(() => {
    categorySelected && setCategoryName(categorySelected.name);
  }, [categorySelected, props]);

  const handleSubmit = useCallback(() => {
    props.onSubmit({
      ...(categorySelected && categorySelected),
      name: categoryName,
    });
    props.onClose();
  }, [props, categorySelected, categoryName]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      fullScreen={fullScreen}
      maxWidth="sm"
      onClose={props.onClose}
      open={props.open}
    >
      <DialogTitle id="form-dialog-title">
        {categorySelected
          ? t('category.creationDialog.titleEdit')
          : t('category.creationDialog.titleNew')}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          required
          onChange={(ev) => setCategoryName(ev.target.value)}
          placeholder={t('category.creationDialog.name')}
          value={categoryName}
          variant="outlined"
        />
        {!categorySelected && props.categoryCreationHelper && (
          <div className={classes.textAndIcon}>
            <Alert className={classes.alertInfo} severity="info">
              {props.categoryCreationHelper}
            </Alert>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          onClick={() => {
            props.onClose();
          }}
        >
          {t('category.creationDialog.cancel')}
        </Button>
        <Button
          color="secondary"
          disabled={!categoryName}
          onClick={() => {
            handleSubmit();
          }}
        >
          {categorySelected
            ? t('category.creationDialog.edit')
            : t('category.creationDialog.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  paddingBottom: {
    paddingBottom: theme.spacing(1),
  },
  textAndIcon: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  optionButton: {
    paddingTop: theme.spacing(2),
  },
  choicesWithTag: {
    display: 'flex',
    flexDirection: 'row',
  },
  paddingTop: {
    paddingTop: theme.spacing(2),
  },
  buttonRow: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(2),
  },
}));

export default CategoryCreationEditDialog;
