// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import ConsumerPackRowItem from '../../consumer-payment-pack/components/ConsumerPackRowItem.component';
import PrivateConsumerPassBookerListItem from '../../private-service/components/booking-module/PrivateConsumerPassBookerListItem.component';

type Props = {
  t: TFunction,
  classes: Object,
  consumerPackList: Array<ConsumerPaymentPack>,
  consumerPackLoading: boolean,
  privateConsumerPassList: Array<PrivateConsumerPass>,
  privateConsumerPassLoading: boolean,
};

export class ConsumerDashboardPassPanel extends React.PureComponent<Props> {
  render() {
    return (
      <div>
        <Typography
          variant="h4"
          component="h3"
          className={this.props.classes.sectionTitle}
          color="textSecondary"
        >
          {this.props.t('dashboard.currentPassTitle')}
        </Typography>
        {this.props.consumerPackList.length === 0 &&
        this.props.privateConsumerPassList &&
        (this.props.consumerPackLoading ||
          this.props.privateConsumerPassLoading) ? (
          <div className={this.props.classes.loading}>
            <CircularProgress />
          </div>
        ) : null}
        {this.props.consumerPackList.length === 0 &&
        this.props.privateConsumerPassList.length === 0 &&
        !this.props.consumerPackLoading &&
        !this.props.privateConsumerPassLoading ? (
          <Typography variant="caption" color="textSecondary">
            {this.props.t('dashboard.noPackCurrentlyActive')}
          </Typography>
        ) : (
          <Paper>
            {this.props.consumerPackList.map((cpp) => (
              <ConsumerPackRowItem
                hideConsumer
                key={cpp.id}
                consumerPack={cpp}
                paymentPack={cpp.payment_pack}
              />
            ))}
            {this.props.privateConsumerPassList.map((pcp) => (
              <PrivateConsumerPassBookerListItem
                divider
                key={pcp.id}
                private_consumer_pass={pcp}
              />
            ))}
          </Paper>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  sectionTitle: {
    marginBottom: theme.spacing(3),
  },
  loading: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
});

export default compose(
  withTranslation(['consumerSpace']),
  withStyles(styles),
)(ConsumerDashboardPassPanel);
