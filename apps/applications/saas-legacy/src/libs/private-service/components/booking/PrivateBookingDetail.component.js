// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { withTranslation, TFunction } from 'react-i18next';
import Button from '@material-ui/core/Button';

import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import {
  PRIVATE_BOOKING_CREATED_BY_STAFF,
  PRIVATE_BOOKING_CANCELLED_BY_STAFF,
  RECURRENT_PRIVATE_BOOKING_CANCELLED_BY_STAFF,
} from '#src/libs/private-service/components/constants';
import PrivateBookingStaffHistory from '../history/PrivateBookingStaffHistory.component';
import PrivateSlotListItem from '../slot/PrivateSlotListItem.component';
import PrivateConsumerPassBookerListItem from '../booking-module/PrivateConsumerPassBookerListItem.component';
import { formatAsDatetime } from '../../../../utils/datetime';
import { BookingSource, getStaffName } from '../../../booking/utils';
import type {
  PrivateBooking,
  PrivateConsumerPass,
  PrivateSlot,
} from '../../types';
import { getCreditsDividedDisplay } from '#src/libs/theme/utils';

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
  forceRegularizeUnpaid?: (options: OptionCallback) => void,
};
export const PrivateBookingDetail = (props: Props) => {
  const { t, classes, private_service, private_booking } = props;
  const [regularizeProcessing, setRegularizeProcessing] = React.useState(false);
  const created_by = private_booking?.staff_history?.find(
    (sh) => sh?.action_identifier === PRIVATE_BOOKING_CREATED_BY_STAFF,
  )?.staff;
  const last_cancel = [
    ...private_booking?.staff_history?.filter(
      (sh) =>
        sh?.action_identifier === PRIVATE_BOOKING_CANCELLED_BY_STAFF ||
        sh?.action_identifier === RECURRENT_PRIVATE_BOOKING_CANCELLED_BY_STAFF,
    ),
  ].sort((sh, sh_) => {
    if (sh.timestamp < sh_.timestamp) {
      return 1;
    }
    return -1;
  })[0];
  const cancelled_by = last_cancel?.staff;

  return (
    <div className={classes.preWrap}>
      <div className={classes.section}>
        <Typography className={classes.sectionTitle} variant="h5">
          {t('privateBooking.detail.title')}
        </Typography>
        <Paper className={classes.paperContainer}>
          <div className={classes.parameterRow}>
            <Typography inline>
              {t('privateBooking.detail.registeredOn')} :
            </Typography>
            <Typography inline>
              {formatAsDatetime(private_booking.date_created)}
            </Typography>
          </div>
          {!!created_by && (
            <div className={classes.parameterRow}>
              <Typography inline>{t('privateBooking.detail.by')} :</Typography>
              <Typography inline>{getStaffName(created_by)}</Typography>
            </div>
          )}
          <div className={classes.parameterRow}>
            <Typography inline>
              {t('privateBooking.detail.source')} :
            </Typography>
            <BookingSource source={private_booking.source} t={t} />
          </div>
          {!!private_booking.date_canceled && (
            <div className={classes.parameterRow}>
              <Typography inline>
                {last_cancel?.action_identifier ===
                PRIVATE_BOOKING_CANCELLED_BY_STAFF
                  ? `${t('privateBooking.detail.cancelledOn')} :`
                  : `${t('privateBooking.detail.cancelledByRecurrenceOn')} :`}
              </Typography>
              <Typography inline>
                {formatAsDatetime(private_booking.date_canceled)}
              </Typography>
            </div>
          )}
          {!!cancelled_by &&
            private_booking.booking_status_code !== BOOKING_STATUS_OK.id && (
              <div className={classes.parameterRow}>
                <Typography inline>
                  {t('privateBooking.detail.by')} :
                </Typography>
                <Typography inline>{getStaffName(cancelled_by)}</Typography>
              </div>
            )}
          <div className={classes.parameterRow}>
            <Typography inline>
              {t('privateBooking.detail.address')} :
            </Typography>
            <Typography inline>{private_booking.address}</Typography>
          </div>
          {!!private_service && !!private_service.coaches.length && (
            <div className={classes.parameterRow}>
              <Typography inline>
                {t('privateBooking.detail.coach')} :
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
                {t('privateBooking.detail.wasRefunded')} :
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
          {t('privateBooking.detail.historyTitle')}
        </Typography>

        <Paper>
          <PrivateBookingStaffHistory privateBooking={private_booking} />
        </Paper>
      </div>
      <div className={classes.section}>
        <Typography className={classes.sectionTitle} variant="h6">
          {t('privateBooking.detail.slotTitle')}
        </Typography>
        {props.private_slot ? (
          <Paper>
            <PrivateSlotListItem
              onClick={props.onPrivateSlotClick}
              slot={props.private_slot}
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
          <>
            {props.private_booking.is_unpaid ? (
              <div>
                <Typography>
                  {t('privateBooking.detail.unpaidBooking', {
                    credits: getCreditsDividedDisplay(
                      props.private_slot?.credit,
                    ),
                  })}
                </Typography>
                {!!props.forceRegularizeUnpaid && (
                  <Button
                    className={classes.paddingTop}
                    color="primary"
                    disabled={regularizeProcessing}
                    onClick={() => {
                      setRegularizeProcessing(true);
                      props.forceRegularizeUnpaid({
                        onSuccess: () => setRegularizeProcessing(false),
                        onError: () => setRegularizeProcessing(false),
                      });
                    }}
                    variant="contained"
                  >
                    {regularizeProcessing && (
                      <CircularProgress color="inherit" size={16} />
                    )}
                    {t('privatePass.actions.forceRegularizeUnpaid')}
                  </Button>
                )}
              </div>
            ) : (
              <Paper>
                <PrivateConsumerPassBookerListItem
                  onClick={() =>
                    props.goToPrivateConsumerPass(
                      props.private_consumer_pass.id,
                    )
                  }
                  private_consumer_pass={props.private_consumer_pass}
                />
              </Paper>
            )}
          </>
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
  preWrap: {
    whiteSpace: 'pre-wrap',
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
    whiteSpace: 'pre-wrap',
  },
  paddingTop: {
    marginTop: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(PrivateBookingDetail);
