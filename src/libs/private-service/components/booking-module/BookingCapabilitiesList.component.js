// @flow
import React from 'react';
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
};

export const BookingCapabilities = (props: Props) => {
  const { t, classes, loading, privateConsumerPassList } = props;
  if (loading) {
    return <LinearProgress />;
  }
  return (
    <div>
      <div classsName={classes.section}>
        <Typography
          className={classes.sectionTitle}
          variant="h5"
          component="h4"
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
              private_consumer_pass={null}
              key="unpaid_booking_pass"
              onBook={() => props.onConsumerPassClick(null, true)}
              compatibleWithUnpaidBooking={props.compatibleWithUnpaidBooking}
              privateSlotCredit={props.privateSlotCredit}
            />
          )}
          {privateConsumerPassList.map((pcp) => (
            <PrivateConsumerPassBookerListItem
              private_consumer_pass={pcp}
              key={pcp.id}
              onBook={() => props.onConsumerPassClick(pcp.id)}
              compatibleWithUnpaidBooking={props.compatibleWithUnpaidBooking}
            />
          ))}
        </Paper>
      </div>

      {props.privatePassByCategory.length === 0 ? (
        <div classsName={classes.section}>
          <Typography
            className={classes.sectionTitle}
            variant="h5"
            component="h4"
          >
            {t('bookerModule.bookingCapabilities.compatiblePassTitle')}
          </Typography>

          <Typography color="textSecondary" variant="body1">
            {t('bookerModule.bookingCapabilities.emptyPassList')}
          </Typography>
        </div>
      ) : (
        props.privatePassByCategory.map((cat) => (
          <div classsName={classes.section}>
            <Typography
              className={classes.sectionTitle}
              variant="h5"
              component="h4"
            >
              {cat.name
                ? cat.name
                : t('bookerModule.bookingCapabilities.compatiblePassTitle')}
            </Typography>
            <List disablePadding>
              <Paper>
                {cat.passes.map((pp) => (
                  <PrivatePassBookerListItem
                    isExcludingTax={props.isExcludingTax}
                    private_pass={pp}
                    key={pp.id}
                    onClick={() => props.onPrivatePassClick(pp.id)}
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
