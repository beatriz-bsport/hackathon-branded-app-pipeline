import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import type { PaymentPackCategory } from '../../types';
import { MaterialStyleType } from '../../../../utils/types';

type OwnProps = {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: any) => void;
  paymentPackCategorySelected: PaymentPackCategory | null;
};
type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;
export const PaymentPackCategoryCreationDialog = (props: Props) => {
  const { t, classes, paymentPackCategorySelected } = props;
  const name = paymentPackCategorySelected
    ? paymentPackCategorySelected.name
    : '';
  const [paymentPackCategoryName, setPaymentPackCategoryName] = React.useState(
    name,
  );
  React.useEffect(() => {
    paymentPackCategorySelected &&
      setPaymentPackCategoryName(paymentPackCategorySelected.name);
  }, [paymentPackCategorySelected]);
  const handleSubmit = () => {
    props.onSubmit({
      ...(paymentPackCategorySelected && paymentPackCategorySelected),
      name: paymentPackCategoryName,
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
        {paymentPackCategorySelected
          ? t('category.form.dialog.titleEdit')
          : t('category.form.dialog.titleNew')}
      </DialogTitle>
      <DialogContent>
        <TextField
          value={paymentPackCategoryName}
          placeholder={t('category.form.dialog.name')}
          onChange={(ev) => setPaymentPackCategoryName(ev.target.value)}
          fullWidth
          required
          variant="outlined"
        />
        {!paymentPackCategorySelected && (
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
          disabled={!paymentPackCategoryName}
          color="secondary"
        >
          {paymentPackCategorySelected ? t('update') : t('create')}
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
)(PaymentPackCategoryCreationDialog);
