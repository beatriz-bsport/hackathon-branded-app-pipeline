// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import PrivateConsumerPassBookerListItem from './PrivateConsumerPassBookerListItem.component';
import PrivatePassBookerListItem from './PrivatePassBookerListItem.component';
import type { PrivateConsumerPass, PrivatePass } from '../../types';

type Props = {
  t: TFunction,
  classes: Object,
  loading: boolean,
  privateConsumerPassList: Array<PrivateConsumerPass>,
  privatePassList: Array<PrivatePass>,
  onPrivatePassClick: (privatePassId: number) => void,
  onConsumerPassClick: (consumerPass: number) => void,
};

export const BookingCapabilities = (props: Props) => {
  const {
    t,
    classes,
    loading,
    privateConsumerPassList,
    privatePassList,
  } = props;
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
          <Typography color="textSecondary">
            {t('bookerModule.bookingCapabilities.emptyConsumerPassList')}
          </Typography>
        ) : null}
        <Paper>
          {privateConsumerPassList.map((pcp) => (
            <PrivateConsumerPassBookerListItem
              private_consumer_pass={pcp}
              key={pcp.id}
              onBook={() => props.onConsumerPassClick(pcp.id)}
            />
          ))}
        </Paper>
      </div>
      <div classsName={classes.section}>
        <Typography
          className={classes.sectionTitle}
          variant="h5"
          component="h4"
        >
          {t('bookerModule.bookingCapabilities.compatiblePassTitle')}
        </Typography>
        {privatePassList.length === 0 ? (
          <Typography color="textSecondary">
            {t('bookerModule.bookingCapabilities.emptyPassList')}
          </Typography>
        ) : null}
        <List disablePadding>
          <Paper>
            {privatePassList.map((pp) => (
              <PrivatePassBookerListItem
                private_pass={pp}
                key={pp.id}
                onClick={() => props.onPrivatePassClick(pp.id)}
              />
            ))}
          </Paper>
        </List>
      </div>
    </div>
  );
};

const styles = (theme) => ({
  section: {
    paddingBottom: theme.spacing.unit * 3,
  },
  sectionTitle: {
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
)(BookingCapabilities);
