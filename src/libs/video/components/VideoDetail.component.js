// @flow
import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import type { Video, VideoAnalyticsData } from '../types';
import ConsumerPackRowItem from '../../consumer-payment-pack/components/ConsumerPackRowItem.component';
import VodVideoAnalytics from './VodVideoAnalytics.component';
import InvoiceListItem from '../../invoice/InvoiceListItem.component';

type Props = {
  classes: Object,
  t: TFunction,
  loading: boolean,
  video: ?Video,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  onConsumerPassSelected: (id: number) => void,
  analytics: {
    data: VideoAnalyticsData,
    loading: boolean,
  },
  invoice: ?Invoice,
  onInvoiceClick?: (uuid: string) => void,
};

export class VideoDetail extends Component<Props> {
  render() {
    const { classes, t } = this.props;
    return (
      <React.Fragment>
        {this.props.loading && <LinearProgress />}
        {this.props.analytics ? (
          <div className={classes.detailContainer}>
            <Typography component="h2" variant="h5">
              {t('details.title')}
            </Typography>
            <VodVideoAnalytics
              loading={this.props.analytics.loading || !this.props.video}
              data={this.props.analytics.data}
              videoDateCreated={
                this.props.video ? this.props.video.date_created : null
              }
            />
          </div>
        ) : null}
        {this.props.invoice ? (
          <div className={classes.detailContainer}>
            <Typography component="h3" variant="h6">
              {this.props.t('details.invoiceTitle')}
            </Typography>
            <Paper className={this.props.classes.paper}>
              <InvoiceListItem
                onClick={() =>
                  this.props.onInvoiceClick(this.props.invoice.uuid)
                }
                invoice={this.props.invoice}
              />
            </Paper>
          </div>
        ) : null}

        {this.props.video.consumer_payment_pack ? (
          <div className={classes.detailContainer}>
            <Typography component="h3" variant="h6">
              {t('details.consumerPaymentPackTitle')}
            </Typography>
            <Paper className={classes.paperContainer}>
              <ConsumerPackRowItem
                consumerPack={this.props.video.consumer_payment_pack}
                paymentPack={
                  this.props.video.consumer_payment_pack
                    ? this.props.video.consumer_payment_pack.payment_pack
                    : null
                }
                onClick={() =>
                  this.props.onConsumerPassSelected(
                    this.props.video.consumer_payment_pack.id,
                  )
                }
                hideConsumer
                incrementCredit={() =>
                  this.props.incrementCredit(
                    this.props.video.consumer_payment_pack.id,
                  )
                }
                decrementCredit={() =>
                  this.props.decrementCredit(
                    this.props.video.consumer_payment_pack.id,
                  )
                }
              />
            </Paper>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

const styles = (theme) => ({
  detailContainer: {
    paddingBottom: theme.spacing(2),
  },
  parameter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  paperContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  emptyMessageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  emptyMessageText: {
    marginTop: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['video']),
)(VideoDetail);
