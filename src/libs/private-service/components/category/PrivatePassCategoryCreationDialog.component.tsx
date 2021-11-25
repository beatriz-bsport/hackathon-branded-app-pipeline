import { withTranslation, WithTranslation } from 'react-i18next';
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { MaterialStyleType } from '../../../../utils/types';
import { PrivatePassCategory } from '../../types';

type OwnProps = {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: any) => void;
  privatePassCategorySelected: PrivatePassCategory | null;
};
type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;
export const PrivatePassCategoryCreationDialogComponent = (props: Props) => {
  const { t, classes, privatePassCategorySelected } = props;
  const name = privatePassCategorySelected
    ? privatePassCategorySelected.name
    : '';
  const [privatePassCategoryName, setPrivatePassCategoryName] =
    React.useState(name);
  React.useEffect(() => {
    privatePassCategorySelected &&
      setPrivatePassCategoryName(privatePassCategorySelected.name);
  }, [privatePassCategorySelected]);
  const handleSubmit = () => {
    props.onSubmit({
      ...(privatePassCategorySelected && privatePassCategorySelected),
      name: privatePassCategoryName,
    });
  };
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={props.open}
      onClose={props.handleClose}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle id="form-dialog-title">
        {privatePassCategorySelected
          ? t('category.form.dialog.titleEdit')
          : t('category.form.dialog.titleNew')}
      </DialogTitle>
      <DialogContent>
        <TextField
          value={privatePassCategoryName}
          placeholder={t('category.form.dialog.name')}
          onChange={(ev) => setPrivatePassCategoryName(ev.target.value)}
          fullWidth
          required
          variant="outlined"
        />
        {!privatePassCategorySelected && (
          <div className={classes.textAndIcon}>
            <InfoIcon className={classes.leftIcon} fontSize="small" />
            <div className={classes.helperTextContainer}>
              <Typography variant="caption">
                {t('category.form.dialog.helper')}
              </Typography>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="secondary">
          {t('cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!privatePassCategoryName}
          color="secondary"
        >
          {privatePassCategorySelected ? t('update') : t('create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const styles = (theme: Theme) => ({
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
});
export default compose<any, OwnProps>(
  withTranslation('paymentPack'),
  withStyles(styles),
)(PrivatePassCategoryCreationDialogComponent);
