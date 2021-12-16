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
  classes: Object;
  t: TFunction;
  loading: boolean;
  videoPurchase?: VideoPurchase;
  relatedVideoPurchaseList?: Array<VideoPurchase>;
  incrementCredit: (id: number) => void;
  decrementCredit: (id: number) => void;
  incrementPrivatePassCredit: (id: number) => void;
  decrementPrivatePassCredit: (id: number) => void;
  onConsumerPassSelected: (id: number) => void;
  onPrivatePassSelected: (id: number) => void;
  analytics: {
    data: VideoAnalyticsData;
    loading: boolean;
  };
  invoice?: Invoice;
  onInvoiceClick?: (uuid: string) => void;
  fetchVideoPurchaseInvoice: (videoPurchase: VideoPurchase) => void;
};

type State = {
  currentPage: number;
};

export class VideoDetail extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
    };
  }

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
      });
    }
  }

  onPageChange(pageSwitch: number) {
    this.setState((prevState) => {
      const newPage = prevState.currentPage + pageSwitch;
      this.props.fetchVideoPurchaseInvoice(
        this.props.relatedVideoPurchaseList[newPage - 1],
      );
      return {
        currentPage: newPage,
      };
    });
  }

  getSelectedVideoPurchase = () => {
    if (
      this.state.currentPage &&
      this.state.currentPage <=
        (this.props.relatedVideoPurchaseList?.length || 0)
    ) {
      return this.props.relatedVideoPurchaseList[this.state.currentPage - 1];
    }
    return null;
  };

  render() {
    const { classes, t } = this.props;
    const selectedVideoPurchase = this.getSelectedVideoPurchase();
    return (
      <React.Fragment>
        {this.props.loading && <LinearProgress />}
        {this.props.analytics ? (
          <div className={classes.detailContainer}>
            <Typography component="h2" variant="h5">
              {t('details.title')}
            </Typography>
            <VodVideoAnalytics
              loading={this.props.analytics.loading || !selectedVideoPurchase}
              data={this.props.analytics.data}
              videoDateCreated={selectedVideoPurchase?.video?.date_created}
            />
          </div>
        ) : null}
        {selectedVideoPurchase?.video?.rental_days > 0 && (
          <div className={classes.detailContainer}>
            <div className={classes.rental}>
              <div className={classes.rentalContainer}>
                <PlayCircleOutlineIcon />
                <Typography className={classes.rentText}>
                  {t('video.rental.forRent')}
                </Typography>
              </div>
              {this.props.relatedVideoPurchaseList?.length && (
                <div className={classes.rental}>
                  <IconButton
                    size="small"
                    disabled={this.state.currentPage === 1}
                    onClick={() => this.onPageChange(-1)}
                  >
                    <NavigateBeforeIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2" className={classes.rentText}>
                    {`${this.state.currentPage}/${this.props.relatedVideoPurchaseList.length}`}
                  </Typography>
                  <IconButton
                    className={classes.rentText}
                    size="small"
                    disabled={
                      this.state.currentPage ===
                      this.props.relatedVideoPurchaseList.length
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
              {`${moment(selectedVideoPurchase.date_created).format(
                'L',
              )} -> ${moment(selectedVideoPurchase.date_created)
                .add(selectedVideoPurchase.video.rental_days, 'days')
                .format('L')}`}
            </Typography>
            <Typography
              color={!selectedVideoPurchase.available ? 'error' : 'primary'}
            >
              {!selectedVideoPurchase.available
                ? t('video.rental.expired')
                : t('video.rental.valid')}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {`${t('video.rental.buyDate')} : ${moment(
                selectedVideoPurchase.date_created,
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

        {selectedVideoPurchase?.consumer_payment_pack && (
          <div className={classes.detailContainer}>
            <Typography component="h3" variant="h6">
              {t('details.consumerPaymentPackTitle')}
            </Typography>
            <Paper className={classes.paperContainer}>
              <ConsumerPackRowItem
                consumerPack={selectedVideoPurchase.consumer_payment_pack}
                paymentPack={
                  selectedVideoPurchase.consumer_payment_pack
                    ? selectedVideoPurchase.consumer_payment_pack.payment_pack
                    : null
                }
                onClick={() =>
                  this.props.onConsumerPassSelected(
                    selectedVideoPurchase.consumer_payment_pack.id,
                  )
                }
                hideConsumer
                incrementCredit={() =>
                  this.props.incrementCredit(
                    selectedVideoPurchase.consumer_payment_pack.id,
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
        )}
        {selectedVideoPurchase?.private_consumer_pass && (
          <div className={classes.detailContainer}>
            <Typography component="h3" variant="h6">
              {t('details.consumerPaymentPackTitle')}
            </Typography>
            <Paper className={classes.paperContainer}>
              <ConsumerPackRowItem
                consumerPack={selectedVideoPurchase.private_consumer_pass}
                paymentPack={
                  selectedVideoPurchase.private_consumer_pass
                    ? selectedVideoPurchase.private_consumer_pass.private_pass
                    : null
                }
                onClick={() =>
                  this.props.onPrivatePassSelected(
                    selectedVideoPurchase.private_consumer_pass.id,
                  )
                }
                hideConsumer
                incrementCredit={() =>
                  this.props.incrementPrivatePassCredit(
                    selectedVideoPurchase.private_consumer_pass.id,
                  )
                }
                decrementCredit={() =>
                  this.props.decrementPrivatePassCredit(
                    selectedVideoPurchase.private_consumer_pass.id,
                  )
                }
              />
            </Paper>
          </div>
        )}
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
