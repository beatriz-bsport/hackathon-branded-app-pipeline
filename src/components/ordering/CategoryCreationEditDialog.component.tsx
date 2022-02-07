import { useTranslation } from 'react-i18next';
import React, { useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
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
      fullWidth
      maxWidth="sm"
      open={props.open}
      onClose={props.onClose}
      disableBackdropClick
      disableEscapeKeyDown
      fullScreen={fullScreen}
    >
      <DialogTitle id="form-dialog-title">
        {categorySelected
          ? t('category.creationDialog.titleEdit')
          : t('category.creationDialog.titleNew')}
      </DialogTitle>
      <DialogContent>
        <TextField
          value={categoryName}
          placeholder={t('category.creationDialog.name')}
          onChange={(ev) => setCategoryName(ev.target.value)}
          fullWidth
          required
          variant="outlined"
        />
        {!categorySelected && props.categoryCreationHelper && (
          <div className={classes.textAndIcon}>
            <InfoIcon className={classes.leftIcon} fontSize="small" />
            <div className={classes.helperTextContainer}>
              <Typography variant="caption">
                {props.categoryCreationHelper}
              </Typography>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="secondary">
          {t('category.creationDialog.cancel')}
        </Button>
        <Button
          onClick={() => {
            handleSubmit();
          }}
          disabled={!categoryName}
          color="secondary"
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
  paddingBottom: {
    paddingBottom: theme.spacing(1),
  },
  textAndIcon: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  helperTextContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
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
