import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
// @ts-expect-error
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import IconButton from '@material-ui/core/IconButton';
import { DateTime } from 'luxon';
import ObjectLevelPermissionProviderComponent from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { hasPaymentPackManagementPermission } from '#libs/payment-packs/utils';
import type { VideoAnalyticsData, VideoPurchase } from '../types';
import ConsumerPackRowItem from '../../consumer-payment-pack/components/ConsumerPackRowItem.component';
// @ts-expect-error
import VodVideoAnalytics from './VodVideoAnalytics.component';
import InvoiceListItem from '../../invoice/InvoiceListItem.component';
import { Invoice } from '../../invoice/types';
import { formatISOStringAsTime } from '../../../utils/datetime';

type Props = {
  classes: Object;
  t: TFunction;
  loading: boolean;
  videoPurchase?: VideoPurchase;
  relatedVideoPurchaseList?: Array<VideoPurchase>;
  incrementCredit: (id: number) => void;
  decrementCredit: (id: number) => void;
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
  // @ts-expect-error
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
      <ObjectLevelPermissionProviderComponent
        requiredPermission={[
          'product.paymentPack.allowed_actions.manageCredit',
          'product.paymentPack.allowed_actions.block',
        ]}
      >
        {([hasManageCreditPermission, hasBlockPermission]: boolean[]) => (
          <React.Fragment>
            {this.props.loading && <LinearProgress />}
            {this.props.analytics ? (
              // @ts-expect-error
              <div className={classes.detailContainer}>
                <Typography component="h2" variant="h5">
                  {t('details.title')}
                </Typography>
                <VodVideoAnalytics
                  data={this.props.analytics.data}
                  loading={
                    this.props.analytics.loading || !selectedVideoPurchase
                  }
                  // @ts-expect-error
                  videoDateCreated={selectedVideoPurchase?.video?.date_created}
                />
              </div>
            ) : null}
            {/* @ts-expect-error */}
            {selectedVideoPurchase?.video?.rental_days > 0 && (
              // @ts-expect-error
              <div className={classes.detailContainer}>
                {/* @ts-expect-error */}
                <div className={classes.rental}>
                  {/* @ts-expect-error */}
                  <div className={classes.rentalContainer}>
                    <PlayCircleOutlineIcon />
                    {/* @ts-expect-error */}
                    <Typography className={classes.rentText}>
                      {t('video.rental.forRent')}
                    </Typography>
                  </div>
                  {!!this.props.relatedVideoPurchaseList?.length && (
                    // @ts-expect-error
                    <div className={classes.rental}>
                      <IconButton
                        disabled={this.state.currentPage === 1}
                        onClick={() => this.onPageChange(-1)}
                        size="small"
                      >
                        <NavigateBeforeIcon fontSize="small" />
                      </IconButton>
                      {/* @ts-expect-error */}
                      <Typography className={classes.rentText} variant="body2">
                        {`${this.state.currentPage}/${this.props.relatedVideoPurchaseList.length}`}
                      </Typography>
                      <IconButton
                        // @ts-expect-error
                        className={classes.rentText}
                        disabled={
                          this.state.currentPage ===
                          this.props.relatedVideoPurchaseList.length
                        }
                        onClick={() => this.onPageChange(1)}
                        size="small"
                      >
                        <NavigateNextIcon fontSize="small" />
                      </IconButton>
                    </div>
                  )}
                </div>
                <Typography
                  // @ts-expect-error
                  className={classes.marginTop}
                  color="textSecondary"
                  variant="body2"
                >
                  {`${DateTime.fromISO(
                    selectedVideoPurchase.date_created,
                  ).toFormat('D')} -> ${DateTime.fromISO(
                    selectedVideoPurchase.date_created,
                  )
                    // @ts-expect-error
                    .plus({ days: selectedVideoPurchase.video.rental_days })
                    .toFormat('D')}`}
                </Typography>
                <Typography
                  color={!selectedVideoPurchase.available ? 'error' : 'primary'}
                >
                  {!selectedVideoPurchase.available
                    ? t('video.rental.expired')
                    : t('video.rental.valid')}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  {`${t('video.rental.buyDate')} : ${formatISOStringAsTime(
                    selectedVideoPurchase.date_created,
                  )}`}
                </Typography>
              </div>
            )}
            {this.props.invoice ? (
              // @ts-expect-error
              <div className={classes.detailContainer}>
                <Typography component="h3" variant="h6">
                  {this.props.t('details.invoiceTitle')}
                </Typography>
                {/* @ts-expect-error */}
                <Paper className={this.props.classes.paper}>
                  <InvoiceListItem
                    invoice={this.props.invoice}
                    onClick={() =>
                      this.props.onInvoiceClick(this.props.invoice.uuid)
                    }
                  />
                </Paper>
              </div>
            ) : null}
            {selectedVideoPurchase?.consumer_payment_pack && (
              // @ts-expect-error
              <div className={classes.detailContainer}>
                <Typography component="h3" variant="h6">
                  {t('details.consumerPaymentPackTitle')}
                </Typography>
                {/* @ts-expect-error */}
                <Paper className={classes.paperContainer}>
                  <ConsumerPackRowItem
                    hideConsumer
                    // @ts-expect-error
                    consumerPack={selectedVideoPurchase.consumer_payment_pack}
                    decrementCredit={
                      // prettier-ignore
                      hasPaymentPackManagementPermission(
                        selectedVideoPurchase.consumer_payment_pack
                          // @ts-expect-error
                          ?.payment_pack,
                        hasManageCreditPermission,
                        hasBlockPermission,
                      ) && this.props.decrementCredit
                    }
                    incrementCredit={
                      // prettier-ignore
                      hasPaymentPackManagementPermission(
                        selectedVideoPurchase.consumer_payment_pack
                          // @ts-expect-error
                          ?.payment_pack,
                        hasManageCreditPermission,
                        hasBlockPermission,
                      ) && this.props.incrementCredit
                    }
                    onClick={() =>
                      this.props.onConsumerPassSelected(
                        // @ts-expect-error
                        selectedVideoPurchase.consumer_payment_pack.id,
                      )
                    }
                    // prettier-ignore
                    paymentPack={
                      selectedVideoPurchase.consumer_payment_pack
                        ? 
                          selectedVideoPurchase.consumer_payment_pack
                            // @ts-expect-error
                            .payment_pack
                        : null
                    }
                  />
                </Paper>
              </div>
            )}
            {selectedVideoPurchase?.private_consumer_pass && (
              // @ts-expect-error
              <div className={classes.detailContainer}>
                <Typography component="h3" variant="h6">
                  {t('details.consumerPaymentPackTitle')}
                </Typography>
                {/* @ts-expect-error */}
                <Paper className={classes.paperContainer}>
                  <ConsumerPackRowItem
                    hideConsumer
                    // @ts-expect-error
                    consumerPack={selectedVideoPurchase.private_consumer_pass}
                    decrementCredit={this.props.decrementCredit}
                    incrementCredit={this.props.incrementCredit}
                    onClick={() =>
                      this.props.onPrivatePassSelected(
                        // @ts-expect-error
                        selectedVideoPurchase.private_consumer_pass.id,
                      )
                    }
                    paymentPack={
                      // prettier-ignore
                      selectedVideoPurchase.private_consumer_pass
                        ?
                          selectedVideoPurchase.private_consumer_pass
                            // @ts-expect-error
                            .private_pass
                        : null
                    }
                  />
                </Paper>
              </div>
            )}
          </React.Fragment>
        )}
      </ObjectLevelPermissionProviderComponent>
    );
  }
}

// @ts-expect-error
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
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['video']),
)(VideoDetail);
