// @flow
import React, { useEffect } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withTranslation, TFunction } from 'react-i18next';

import PrivateConsumerPassBookerListItem from './PrivateConsumerPassBookerListItem.component';
import UnPrivateConsumerPassBookerListItem from './UnpaidPrivateConsumerPassBookerListItem.component';
import PrivatePassBookerListItem from './PrivatePassBookerListItem.component';
import { trackPassSelectionForAppointmentViewedEvent } from '#src/events/booking/trackers';
import { analyticsClientB2C } from '#src/components/analytics/mixpanel';

import type {
  PrivateConsumerPass,
  PrivatePassCategoryWithPasses,
} from '../../types';

type Props = {
  t: TFunction,
  classes: Object,
  loading: boolean,
  privateConsumerPassList: Array<PrivateConsumerPass>,
  privatePassByCategory: Array<PrivatePassCategoryWithPasses>,
  onPrivatePassClick: (privatePassId: number) => void,
  onConsumerPassClick: (consumerPass: number | null, unpaid?: boolean) => void,
  compatibleWithUnpaidBooking: boolean,
  privateSlotCredit?: number,
  isExcludingTax?: boolean,
  hideCredits?: boolean,
  trackingParams: {
    activity_id: number,
    activity_name: string,
    offer_id: number,
    session_type: string,
  } | null,
};

export const BookingCapabilities = (props: Props) => {
  const {
    t,
    classes,
    loading,
    privateConsumerPassList,
    hideCredits,
    trackingParams,
  } = props;

  useEffect(() => {
    if (!loading && !!trackingParams) {
      analyticsClientB2C.track(
        trackPassSelectionForAppointmentViewedEvent(trackingParams),
      );
    }
  }, [loading, trackingParams?.activity_id]);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <div>
      <div className={classes.section}>
        <Typography
          className={classes.sectionTitle}
          component="h4"
          variant="h5"
        >
          {t('bookerModule.bookingCapabilities.compatibleConsumerPassTitle')}
        </Typography>
        {privateConsumerPassList.length === 0 ? (
          <Typography color="textSecondary" variant="body1">
            {t('bookerModule.bookingCapabilities.emptyConsumerPassList')}
          </Typography>
        ) : null}
        <Paper>
          {props.compatibleWithUnpaidBooking && (
            <UnPrivateConsumerPassBookerListItem
              key="unpaid_booking_pass"
              compatibleWithUnpaidBooking={props.compatibleWithUnpaidBooking}
              onBook={() => props.onConsumerPassClick(null, true)}
              private_consumer_pass={null}
              privateSlotCredit={props.privateSlotCredit}
            />
          )}
          {privateConsumerPassList.map((pcp) => (
            <PrivateConsumerPassBookerListItem
              key={pcp.id}
              compatibleWithUnpaidBooking={props.compatibleWithUnpaidBooking}
              onBook={() => props.onConsumerPassClick(pcp.id)}
              private_consumer_pass={pcp}
            />
          ))}
        </Paper>
      </div>

      {props.privatePassByCategory.length === 0 ? (
        <div className={classes.section}>
          <Typography
            className={classes.sectionTitle}
            component="h4"
            variant="h5"
          >
            {t('bookerModule.bookingCapabilities.compatiblePassTitle')}
          </Typography>

          <Typography color="textSecondary" variant="body1">
            {t('bookerModule.bookingCapabilities.emptyPassList')}
          </Typography>
        </div>
      ) : (
        props.privatePassByCategory.map((cat) => (
          <div className={classes.section}>
            <Typography
              className={classes.sectionTitle}
              component="h4"
              variant="h5"
            >
              {cat.name
                ? cat.name
                : t('bookerModule.bookingCapabilities.compatiblePassTitle')}
            </Typography>
            <List disablePadding>
              <Paper>
                {cat.passes.map((pp) => (
                  <PrivatePassBookerListItem
                    key={pp.id}
                    hideCredits={!!hideCredits}
                    isExcludingTax={props.isExcludingTax}
                    onClick={() => props.onPrivatePassClick(pp.id)}
                    private_pass={pp}
                  />
                ))}
              </Paper>
            </List>
          </div>
        ))
      )}
    </div>
  );
};

const styles = (theme) => ({
  section: {
    paddingBottom: theme.spacing(3),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(BookingCapabilities);
