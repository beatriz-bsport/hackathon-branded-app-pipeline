import React from 'react';
import clsx from 'clsx';
import { withHandlers, compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';

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
import { analyticsClientB2B } from '#src/components/analytics/mixpanel';
import { trackBarcodeScanSuccessEvent } from '#src/events/booking/trackers';

import type { Member } from '#src/libs/member/types';
import type { OfferREST } from '#src/libs/offer/types';
import type { OptionCallback } from '#src/state/types';
import type { WithHandlerType } from '#src/utils/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { Level } from '#src/libs/level/types';
import type { Coach } from '#src/libs/associated-coach/types';
import type { Booking } from '#src/libs/booking/types';

const MEMBER_LIST_REFRESH_DURATION = 1000 * 60 * 2;

type Props = OwnProps &
  WithTranslation &
  WithStyles<typeof styles> &
  WithHandlerType<typeof mapWithHandlers>;

type OwnProps = {
  offer: OfferREST;
  establishment: Establishment;
  level: Level;
  coach: Coach;
  bookings: Booking[];
  isBookingLoading: boolean;
  isOfferLoading: boolean;
  isEstablishmentLoading: boolean;
  isCoachLoading: boolean;
  isLevelLoading: boolean;
  registrationDialogOpen?: boolean;
  barcodeDetectorEnabled: boolean;
  goBack: () => void;
  confirmBookingAttendance: (bookingId: number) => void;
  onAddMember: () => void;
  refreshData: () => void;
  toggleBarcodeDetector: () => void;
  closeBarcode: () => void;
  // eslint-disable-next-line
  fetchMemberByBarcode: (
    barcode: string,
    options?: OptionCallback<Member>,
  ) => void;
  // eslint-disable-next-line
  onMemberSearched: (member: Member, callback?: OptionCallback<Member>) => void;
  getMember: (id: number) => Member;
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
    if (
      this.props.isEstablishmentLoading ||
      this.props.isOfferLoading ||
      this.props.isCoachLoading ||
      this.props.isLevelLoading
    ) {
      return <CircularProgress />;
    }

    const isOfferFull = this.props.offer?.full;

    const BookerFab: React.FC = isOfferFull ? RedFab : Fab;

    return (
      <div className={this.props.classes.root}>
        <div
          className={clsx([
            this.props.classes.panelContainer,
            this.props.classes.offerSummary,
          ])}
        >
          <CheckInOfferSummaryPanel
            coach={this.props.coach}
            customLevel={this.props.level}
            establishment={this.props.establishment}
            offer={this.props.offer}
          />
        </div>
        <div
          className={clsx([
            this.props.classes.panelContainer,
            this.props.classes.memberList,
          ])}
        >
          <div className={this.props.classes.row}>
            <Switch
              checked={!!this.props.barcodeDetectorEnabled}
              onChange={this.props.toggleBarcodeDetector}
            />

            <Typography>
              {this.props.t('offerDetail.activateBarcode')}
            </Typography>
          </div>

          <BookingList
            bookingLoading={this.props.isBookingLoading}
            bookings={this.props.bookings}
            confirmBookingAttendance={this.props.confirmBookingAttendance}
            getMember={this.props.getMember}
            offer={this.props.offer}
            onAddMember={this.props.onAddMember}
          />
        </div>

        <div className={this.props.classes.backButton}>
          <BookerFab
            // @ts-expect-error IDK
            color="primary"
            onClick={isOfferFull ? () => {} : this.props.onAddMember}
            variant="extended"
          >
            <PersonAddIcon className={this.props.classes.leftIcon} />
            {isOfferFull
              ? this.props.t('offerDetail.isFull')
              : this.props.t('offerDetail.register')}
          </BookerFab>
          <Fab color="secondary" onClick={this.props.goBack} variant="extended">
            <ChevronLeftIcon className={this.props.classes.leftIcon} />
            {this.props.t('offerDetail.backToOfferList')}
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
                    {this.props.t('offerDetail.actions.close')}
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
      const barcode = data.codeResult.code;
      fetchMemberByBarcode(barcode, {
        onSuccess: (member) => {
          analyticsClientB2B.track(
            trackBarcodeScanSuccessEvent({
              member_id: member.id,
              barcode,
            }),
          );
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
