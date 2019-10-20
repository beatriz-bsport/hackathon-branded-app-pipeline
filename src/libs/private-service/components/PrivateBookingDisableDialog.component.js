// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  onSubmit: (fiorce_refund: boolean) => void,
  classes: Object,
  open: boolean,
  private_booking: PrivateBooking,
  onClose: () => void,
  t: TFunction,
};

type State = {
  force_refund: boolean,
};

export class PrivateBookingDisableDialog extends React.Component<Props, State> {
  state = {
    force_refund: true,
  };

  onSubmit = (ev: SyntheticEvent<any>) => {
    ev.preventDefault();
    this.props.onSubmit(this.state.force_refund);
  };

  render() {
    const { t, classes } = this.props;
    const isDisabled =
      this.props.private_booking &&
      this.props.private_booking.booking_status_code &&
      this.props.private_booking.booking_status_code !== BOOKING_STATUS_OK.id;
    return (
      <Dialog open={this.props.open}>
        <form onSubmit={this.onSubmit}>
          <DialogTitle>{t('privateBooking.delete.title')}</DialogTitle>
          <DialogContent>
            <Typography>
              {isDisabled
                ? t('privateBooking.delete.explainHardDelete')
                : t('privateBooking.delete.explain')}
            </Typography>
            <div className={classes.checkboxContainer}>
              <Checkbox
                checked={this.state.force_refund}
                disabled={isDisabled}
                onChange={(ev) =>
                  this.setState({ force_refund: ev.target.checked })
                }
              />
              <Typography>
                {t('privateBooking.delete.explainForceRefund')}
              </Typography>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose}>
              {t('privateBooking.delete.cancel')}
            </Button>
            <Button color="primary" type="submit">
              {t('privateBooking.delete.confirm')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  checkboxContainer: {
    display: 'flex',
    marginTop: theme.spacing.unit * 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
)(PrivateBookingDisableDialog);
