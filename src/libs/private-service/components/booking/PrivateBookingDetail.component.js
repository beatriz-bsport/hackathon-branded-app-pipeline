// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Button from '@material-ui/core/Button';

import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';

import PrivateSlotListItem from '../slot/PrivateSlotListItem.component';
import PrivateConsumerPassBookerListItem from '../booking-module/PrivateConsumerPassBookerListItem.component';
import { formatAsDatetime } from '../../../../datetime';
import { BookingSource } from '../../../booking/utils';

import type {
  PrivateBooking,
  PrivateConsumerPass,
  PrivateSlot,
} from '../../types.ts';

type Props = {
  t: TFunction,
  classes: Object,
  private_booking: PrivateBooking,
  private_slot: ?PrivateSlot,
  private_service: ?PrivateService,
  onOpenAttachCoach: () => void,
  private_consumer_pass: ?PrivateConsumerPass,
  onPrivateSlotClick: () => void,
  goToPrivateConsumerPass: (privateConsumerPassId: number) => void,
};
export const PrivateBookingDetail = (props: Props) => {
  const { t, classes, private_service, private_booking } = props;
  return (
    <div>
      <div className={classes.section}>
        <Typography className={classes.sectionTitle} variant="h5">
          {t('privateBooking.detail.title')}
        </Typography>
        <Paper className={classes.paperContainer}>
          <div className={classes.parameterRow}>
            <Typography inline>
              {t('privateBooking.detail.registeredOn')}:
            </Typography>
            <Typography inline>
              {formatAsDatetime(private_booking.date_created)}
            </Typography>
          </div>
          {private_booking.date_canceled && (
            <div className={classes.parameterRow}>
              <Typography inline>
                {t('privateBooking.detail.cancelledOn')}:
              </Typography>
              <Typography inline>
                {formatAsDatetime(private_booking.date_canceled)}
              </Typography>
            </div>
          )}
          <div className={classes.parameterRow}>
            <Typography inline>
              {`${t('privateBooking.detail.source')}: `}
            </Typography>
            <BookingSource t={t} source={private_booking.source} />
          </div>
          <div className={classes.parameterRow}>
            <Typography inline>
              {t('privateBooking.detail.address')}:
            </Typography>
            <Typography inline>{private_booking.address}</Typography>
          </div>
          {!!private_service && private_service.coaches.length && (
            <div className={classes.parameterRow}>
              <Typography inline>
                {t('privateBooking.detail.coach')}:
              </Typography>
              {!!private_booking.coach && (
                <Typography inline>{private_booking.coach.name}</Typography>
              )}
              {private_booking.associated_coach === null && (
                <Button
                  color="primary"
                  onClick={props.onOpenAttachCoach}
                  variant="outlined"
                >
                  {t('privateBooking.detail.attachCoach')}
                </Button>
              )}
            </div>
          )}
          {private_booking.booking_status_code !== BOOKING_STATUS_OK.id ? (
            <div className={classes.parameterRow}>
              <Typography inline>
                {`${t('privateBooking.detail.wasRefunded')}: `}
              </Typography>
              <Typography inline>
                {t(
                  private_booking.was_refunded
                    ? 'privateBooking.detail.wasRefundedYes'
                    : 'privateBooking.detail.wasRefundedNo',
                )}
              </Typography>
            </div>
          ) : null}
        </Paper>
      </div>
      <div className={classes.section}>
        <Typography className={classes.sectionTitle} variant="h6">
          {t('privateBooking.detail.slotTitle')}
        </Typography>
        {props.private_slot ? (
          <Paper>
            <PrivateSlotListItem
              slot={props.private_slot}
              onClick={props.onPrivateSlotClick}
            />
          </Paper>
        ) : (
          <CircularProgress />
        )}
      </div>
      <div className={classes.section}>
        <Typography className={classes.sectionTitle} variant="h6">
          {t('privateBooking.detail.passTitle')}
        </Typography>
        {props.private_consumer_pass ? (
          <Paper>
            <PrivateConsumerPassBookerListItem
              private_consumer_pass={props.private_consumer_pass}
              onClick={() =>
                props.goToPrivateConsumerPass(props.private_consumer_pass.id)
              }
            />
          </Paper>
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  );
};

const styles = (theme) => ({
  container: {},
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  section: {
    marginBottom: theme.spacing(2),
  },
  paperContainer: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    '&>*': {
      paddingBottom: theme.spacing(0.5),
      paddingTop: theme.spacing(0.5),
    },
  },
  parameterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(PrivateBookingDetail);
