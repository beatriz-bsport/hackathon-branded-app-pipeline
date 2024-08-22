import React from 'react';
import classNames from 'classnames';
import { withHandlers, compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Dispatch } from 'redux';

import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import {
  Theme,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  Fab,
  Switch,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import RedFab from '#src/components/button/RedFab.component';
// @ts-expect-error JS
import BookingList from '#src/libs/check-in/components/BookingList.component';
import CheckInOfferSummaryPanel from '#src/libs/check-in/components/CheckInOfferSummaryPanel.component';
// @ts-expect-error JS
import BarcodeLiveReader from '#src/components/BarcodeLiveReader.component';

import type { Member } from '#src/libs/member/types';
import type { OfferREST } from '#src/libs/offer/types';
import type { OptionCallback } from '#src/state/types';
import type { BookingWithConsumerPaymentPack } from '#src/libs/booking/types';
import type { WithHandlerType } from '#src/utils/types';

const MEMBER_LIST_REFRESH_DURATION = 1000 * 60 * 2;

type Props = OwnProps &
  WithTranslation &
  WithStyles<typeof styles> &
  WithHandlerType<typeof mapWithHandlers>;

type OwnProps = {
  offer: OfferREST;
  members: Member[];
  bookingLoading: boolean;
  registrationDialogOpen: boolean;
  barcodeDetectorEnabled: boolean;
  goBack: () => void;
  confirmBookingAttendance: (booking: BookingWithConsumerPaymentPack) => void;
  onAddMember: () => void;
  refreshData: () => void;
  toogleBarcodeDetector: () => void;
  closeBarcode: () => void;
  // eslint-disable-next-line
  fetchMemberByBarcode: (
    barcode: string,
    options?: OptionCallback<Member>,
  ) => (dispatch: Dispatch) => void;
  // eslint-disable-next-line
  onMemberSearched: (member: Member, callback?: OptionCallback<Member>) => void;
};

export class CheckInOfferDetail extends React.Component<Props> {
  interval: ReturnType<typeof setInterval> = null;

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

    const BookerFab: React.FC = this.props.offer.full ? RedFab : Fab;

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
            // @ts-expect-error IDK
            color="primary"
            onClick={this.props.offer.full ? () => {} : this.props.onAddMember}
            variant="extended"
          >
            <PersonAddIcon className={classes.leftIcon} />
            {this.props.offer.full
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
              <div>
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

const styles = (theme: Theme) =>
  createStyles({
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

const mapWithHandlers = {
  onBarcodeDetected:
    ({ fetchMemberByBarcode, onMemberSearched }: OwnProps) =>
    // @ts-expect-error TODO - typing
    (data) => {
      fetchMemberByBarcode(data.codeResult.code, {
        onSuccess: (member) => {
          onMemberSearched(member);
        },
      });
    },
};

export default compose<Props, OwnProps>(
  withTranslation(['selfCheckIn']),
  withStyles(styles),
  withHandlers(mapWithHandlers),
)(CheckInOfferDetail);
