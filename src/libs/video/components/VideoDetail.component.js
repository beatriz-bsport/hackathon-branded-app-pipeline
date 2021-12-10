// @flow
import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import moment from 'moment/moment';
import IconButton from '@material-ui/core/IconButton';
import type { VideoAnalyticsData, VideoPurchase } from '../types';
import ConsumerPackRowItem from '../../consumer-payment-pack/components/ConsumerPackRowItem.component';
import VodVideoAnalytics from './VodVideoAnalytics.component';
import InvoiceListItem from '../../invoice/InvoiceListItem.component';
import { Invoice } from '../../invoice/types';

type Props = {
  classes: Object,
  t: TFunction,
  loading: boolean,
  videoPurchase?: VideoPurchase,
  associatedVideos?: Array<VideoPurchase>,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  onConsumerPassSelected: (id: number) => void,
  analytics: {
    data: VideoAnalyticsData,
    loading: boolean,
  },
  invoice?: Invoice,
  onInvoiceClick?: (uuid: string) => void,
  getInvoice: (videoPurchaseId: number) => void,
};

export class VideoDetail extends Component<Props> {
  state = {
    currentPage: 1,
    selectedVideoPurchase: this.props.videoPurchase,
  };

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.videoPurchase.id !== this.props.videoPurchase.id ||
      prevProps.videoPurchase.consumer_payment_pack !==
        this.props.videoPurchase.consumer_payment_pack ||
      prevProps.videoPurchase.private_consumer_pass !==
        this.props.videoPurchase.private_consumer_pass
    ) {
      this.setState({
        currentPage: 1,
        selectedVideoPurchase: this.props.videoPurchase,
      });
    }
  }

  onPageChange(pageSwitch: number) {
    this.setState((prevState) => {
      const newPage = prevState.currentPage + pageSwitch;
      this.props.getInvoice(this.props.associatedVideos[newPage - 1]);
      return {
        currentPage: newPage,
        selectedVideoPurchase: this.props.associatedVideos[newPage - 1],
      };
    });
  }

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
              loading={
                this.props.analytics.loading ||
                !this.state.selectedVideoPurchase
              }
              data={this.props.analytics.data}
              videoDateCreated={
                this.state.selectedVideoPurchase
                  ? this.state.selectedVideoPurchase.video?.date_created
                  : null
              }
            />
          </div>
        ) : null}
        {this.state.selectedVideoPurchase?.video?.rental_days > 0 && (
          <div className={classes.detailContainer}>
            <div className={classes.rental}>
              <div className={classes.rentalContainer}>
                <PlayCircleOutlineIcon />
                <Typography className={classes.rentText}>
                  {t('video.rental.forRent')}
                </Typography>
              </div>
              {this.props.associatedVideos?.length && (
                <div className={classes.rental}>
                  <IconButton
                    size="small"
                    disabled={this.state.currentPage === 1}
                    onClick={() => this.onPageChange(-1)}
                  >
                    <NavigateBeforeIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2" className={classes.rentText}>
                    {`${this.state.currentPage}/${this.props.associatedVideos.length}`}
                  </Typography>
                  <IconButton
                    className={classes.rentText}
                    size="small"
                    disabled={
                      this.state.currentPage ===
                      this.props.associatedVideos.length
                    }
                    onClick={() => this.onPageChange(1)}
                  >
                    <NavigateNextIcon fontSize="small" />
                  </IconButton>
                </div>
              )}
            </div>
            <Typography
              className={classes.marginTop}
              variant="body2"
              color="textSecondary"
            >
              {`${moment(this.state.selectedVideoPurchase.date_created).format(
                'L',
              )} -> ${moment(this.state.selectedVideoPurchase.date_created)
                .add(this.state.selectedVideoPurchase.video.rental_days, 'days')
                .format('L')}`}
            </Typography>
            <Typography
              color={
                !this.state.selectedVideoPurchase.available
                  ? 'error'
                  : 'primary'
              }
            >
              {!this.state.selectedVideoPurchase.available
                ? t('video.rental.expired')
                : t('video.rental.valid')}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {`${t('video.rental.buyDate')} : ${moment(
                this.state.selectedVideoPurchase.date_created,
              ).format('LT')}`}
            </Typography>
          </div>
        )}
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

        {this.state.selectedVideoPurchase.consumer_payment_pack ? (
          <div className={classes.detailContainer}>
            <Typography component="h3" variant="h6">
              {t('details.consumerPaymentPackTitle')}
            </Typography>
            <Paper className={classes.paperContainer}>
              <ConsumerPackRowItem
                consumerPack={
                  this.state.selectedVideoPurchase.consumer_payment_pack
                }
                paymentPack={
                  this.state.selectedVideoPurchase.consumer_payment_pack
                    ? this.state.selectedVideoPurchase.consumer_payment_pack
                        .payment_pack
                    : null
                }
                onClick={() =>
                  this.props.onConsumerPassSelected(
                    this.state.selectedVideoPurchase.consumer_payment_pack.id,
                  )
                }
                hideConsumer
                incrementCredit={() =>
                  this.props.incrementCredit(
                    this.state.selectedVideoPurchase.consumer_payment_pack.id,
                  )
                }
                decrementCredit={() =>
                  this.props.decrementCredit(
                    this.state.selectedVideoPurchase.consumer_payment_pack.id,
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
  rental: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rentalContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  rentText: {
    marginLeft: theme.spacing(1),
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['video']),
)(VideoDetail);
