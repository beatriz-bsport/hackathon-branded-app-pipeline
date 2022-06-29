// @flow
import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import type { PrivateBooking } from '#libs/private-service/types';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type Props = {
  onSubmit: (force_refund: boolean, send_email: boolean) => void;
  open: boolean;
  private_booking: PrivateBooking;
  onClose: () => void;
};

export const PrivateBookingDisableDialog: React.FC<Props> = ({
  onSubmit,
  open,
  private_booking,
  onClose,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('privateService');
  const [forceRefund, setForceRefund] = React.useState(true);
  const [sendEmail, setSendEmail] = React.useState(true);
  const handleSubmit = (ev: any) => {
    ev.preventDefault();
    onSubmit(forceRefund, sendEmail);
  };
  const isDisabled =
    private_booking &&
    private_booking.booking_status_code &&
    private_booking.booking_status_code !== BOOKING_STATUS_OK.id;
  const isRecurrent = !!private_booking?.recurrence_rule_private_booking;
  return (
    <GenericResponsiveDialog maxWidth="sm" open={open}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isDisabled
            ? t('privateBooking.delete.hardDeleteTitle')
            : t('privateBooking.delete.title')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {isDisabled
              ? t('privateBooking.delete.explainHardDelete')
              : t('privateBooking.delete.explainWithRestore')}
          </Typography>

          <div className={classes.checkboxContainer}>
            <Checkbox
              checked={forceRefund}
              disabled={isDisabled}
              onChange={(ev) => setForceRefund(ev.target.checked)}
            />
            <Typography>
              {t('privateBooking.delete.explainForceRefund')}
            </Typography>
          </div>
          <div className={classes.checkboxContainer}>
            <Checkbox
              checked={sendEmail}
              disabled={isDisabled}
              onChange={(ev) => setSendEmail(ev.target.checked)}
            />
            <Typography>
              {t('privateBooking.delete.sendCancellationMail', {
                name: private_booking.member.name,
              })}
            </Typography>
          </div>
        </DialogContent>
        {isDisabled && isRecurrent ? (
          <>
            <DialogContent>
              <Alert severity="warning">
                <AlertTitle>
                  {t(
                    'privateBooking.delete.explainMoreHardDeleteReccurentBookingTitle',
                  )}
                </AlertTitle>
                {t(
                  'privateBooking.delete.explainMoreHardDeleteReccurentBooking',
                )}
              </Alert>
            </DialogContent>
          </>
        ) : null}
        <DialogActions>
          <Button onClick={onClose}>{t('privateBooking.delete.cancel')}</Button>
          <Button color="primary" type="submit">
            {t('privateBooking.delete.confirm')}
          </Button>
        </DialogActions>
      </form>
    </GenericResponsiveDialog>
  );
};
const useStyles = makeStyles((theme) => ({
  checkboxContainer: {
    display: 'flex',
    marginTop: theme.spacing(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default PrivateBookingDisableDialog;
