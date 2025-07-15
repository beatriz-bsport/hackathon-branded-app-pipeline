import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import RedButton from '#src/components/button/RedButton.component';
import type { PrivatePass } from '../../types';
import { VALIDATION_DELAY } from '#src/libs/constants';

type Props = {
  open: boolean;
  usedInCombo: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  pass: PrivatePass;
};

export const PrivatePassDeleteDialog = (props: Props) => {
  const { t } = useTranslation('privateService');
  const classes = useStyles();
  return (
    <Dialog open={props.open}>
      <DialogTitle>{t('privatePass.delete.title')}</DialogTitle>
      <DialogContent>
        {props.pass?.linked_payment_pack && (
          <DialogContentText className={classes.warningDelete}>
            <WarningIcon
              className={classes.warningIcon}
              color="error"
              fontSize="large"
            />
            {t('universalPass.delete.dialog.warningText')}
          </DialogContentText>
        )}
        {props.usedInCombo && (
          <DialogContentText className={classes.warningDelete}>
            <WarningIcon
              className={classes.warningIcon}
              color="error"
              fontSize="large"
            />
            <Typography>{t('privatePass.delete.warning')}</Typography>
          </DialogContentText>
        )}
        {t('privatePass.delete.explain')}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onCancel()}>
          {t('privatePass.delete.cancel')}
        </Button>
        <RedButton
          delayBeforeActivation={VALIDATION_DELAY}
          onClick={() => props.onConfirm()}
        >
          {t('privatePass.delete.submit')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};
const useStyles = makeStyles((theme: Theme) => ({
  warningDelete: {
    display: 'flex',
  },
  warningIcon: {
    marginRight: theme.spacing(2),
  },
}));
export default PrivatePassDeleteDialog;
