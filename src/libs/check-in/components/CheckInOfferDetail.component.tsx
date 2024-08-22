// @flow
import React from 'react';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Typography from '@material-ui/core/Typography';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Fab from '@material-ui/core/Fab';

import Switch from '@material-ui/core/Switch';
import { withHandlers, compose } from 'recompose';
import { withStyles } from '@material-ui/styles';
import { withTranslation, TFunction } from 'react-i18next';
import RedFab from '../../../components/button/RedFab.component';
import type { Member } from '../../member/types';
import BookingList from './BookingList.component';

import CheckInOfferSummaryPanel from './CheckInOfferSummaryPanel.component';
import BarcodeLiveReader from '../../../components/BarcodeLiveReader.component';

const MEMBER_LIST_REFRESH_DURATION = 1000 * 60 * 2;

type Props = {
  offer: Object,
  classes: Object,
  t: TFunction,

  goBack: () => void,
  members: Array<Member>,
  confirmBookingAttendance: (bookingId: number) => void,
  onAddMember: () => void,
  bookingLoading: boolean,
  refreshData: () => void,

  barcodeDetectorEnabled: boolean,
  toogleBarcodeDetector: () => void,

  onBarcodeDetected: (string) => void,
  registrationDialogOpen: boolean,
  barcodeDetectorEnabled: boolean,
  closeBarcode: () => void,
};

export class CheckInOfferDetail extends React.Component<Props> {
  componentDidMount() {
    this.interval = setInterval(
      this.props.refreshData,
      MEMBER_LIST_REFRESH_DURATION,
    );
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    if (!this.props.offer) {
      return <CircularProgress />;
    }
    const { classes, t } = this.props;

    const BookerFab = this.props.offer.is_full ? RedFab : Fab;

    return (
      <div className={classes.root}>
        <div
          className={classNames([classes.panelContainer, classes.offerSummary])}
        >
          <CheckInOfferSummaryPanel
            goBack={this.props.goBack}
            offer={this.props.offer}
          />
        </div>
        <div
          className={classNames([classes.panelContainer, classes.memberList])}
        >
          <div className={classes.row}>
            <Switch
              checked={!!this.props.barcodeDetectorEnabled}
              onChange={this.props.toogleBarcodeDetector}
            />

            <Typography>{t('offerDetail.activateBarcode')}</Typography>
          </div>

          <BookingList
            bookingLoading={this.props.bookingLoading}
            confirmBookingAttendance={this.props.confirmBookingAttendance}
            members={this.props.members}
            offer={this.props.offer}
            onAddMember={this.props.onAddMember}
          />
        </div>

        <div className={classes.backButton}>
          <BookerFab
            color="primary"
            onClick={
              this.props.offer.is_full ? () => {} : this.props.onAddMember
            }
            variant="extended"
          >
            <PersonAddIcon className={classes.leftIcon} />
            {this.props.offer.is_full
              ? t('offerDetail.isFull')
              : t('offerDetail.register')}
          </BookerFab>
          <Fab color="secondary" onClick={this.props.goBack} variant="extended">
            <ChevronLeftIcon className={classes.leftIcon} />
            {t('offerDetail.backToOfferList')}
          </Fab>
        </div>
        {!this.props.registrationDialogOpen &&
          this.props.barcodeDetectorEnabled && (
            <Dialog open>
              <div className={classes.modal}>
                {this.props.barcodeDetectorEnabled && (
                  <BarcodeLiveReader
                    onDetected={this.props.onBarcodeDetected}
                  />
                )}

                <DialogActions>
                  <Button onClick={this.props.closeBarcode}>
                    {t('offerDetail.actions.close')}
                  </Button>
                </DialogActions>
              </div>
            </Dialog>
          )}
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing(12),
  },
  panelContainer: {
    padding: theme.spacing(2),
    height: '100%',
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  registerButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  backButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    '&>*': {
      marginTop: theme.spacing(2),
    },
  },
  memberList: {
    width: '60%',
  },
  offerSummary: {
    width: '40%',
    borderRight: `1px solid ${theme.palette.grey[200]}`,
  },
  registerListItem: {
    marginBottom: theme.spacing(1) / 3,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default compose(
  withTranslation(['selfCheckIn']),
  withStyles(styles),
  withHandlers({
    onBarcodeDetected:
      ({ fetchMemberByBarcode, onMemberSearched }) =>
      (data) => {
        fetchMemberByBarcode(data.codeResult.code, {
          onSuccess: (member) => {
            onMemberSearched(member);
          },
        });
      },
  }),
)(CheckInOfferDetail);
