import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { MaterialStyleType } from '../../../utils/types';
import WidgetUtils from '../../widget/WidgetUtils';

type OwnProps = {
  open: boolean;
  success: boolean;
  onNext: () => void;
  goToSubscriptionList: () => void;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
export const SubscriptionPaymentDialog = (props: Props) => {
  const { t, classes, open, success, onNext, goToSubscriptionList } = props;
  return (
    <Dialog
      open={open}
      fullScreen={window.innerWidth < 700 || WidgetUtils.isWidget()}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <div className={classes.dialogTitle}>
          {t('subscriptionPaymentDialog.title')}
          <IconButton
            size="small"
            color="inherit"
            onClick={() => goToSubscriptionList()}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {success
            ? t('subscriptionPaymentDialog.success.text_content')
            : t('subscriptionPaymentDialog.error.text_content')}
        </DialogContentText>
        <div className={classes.centeredContent}>
          {success ? (
            <CheckIcon className={classes.icon} color="primary" />
          ) : (
            <ErrorIcon className={classes.icon} color="error" />
          )}
          <Typography className={classes.message}>
            {success
              ? t('subscriptionPaymentDialog.success.text_status')
              : t('subscriptionPaymentDialog.error.text_status')}
          </Typography>
        </div>
        <div className={classes.actions}>
          <Button onClick={() => onNext()} variant="contained" color="primary">
            {success
              ? t('subscriptionPaymentDialog.success.button_text')
              : t('subscriptionPaymentDialog.error.button_text')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
const styles = (theme: Theme) => ({
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  actions: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContent: {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  icon: {
    height: '100px',
    width: '100px',
  },
});
export default compose<any, OwnProps>(
  withTranslation('payment'),
  withStyles(styles),
)(SubscriptionPaymentDialog);
