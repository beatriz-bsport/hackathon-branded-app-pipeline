// @flow
import React from 'react';
import { DateTime } from 'luxon';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles/createTheme';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { replace, goBack as goBackRouter, push } from 'connected-react-router';
import { alpha } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withTranslation, TFunction } from 'react-i18next';
import { BUYABLE_ITEM_PRIVATE_PASS } from '@bsport/common/lib/master-data/buyable-items.js';
import PrivateServiceIneligibleBanner from '#src/libs/private-service/components/service/PrivateServiceIneligibleBanner.component';

import {
  getCheckoutUrl,
  getUserSpaceUrl,
} from '#src/libs/marketplace/routing-utils';
import themeSelectors from '../../../libs/theme/selectors';

import MarketplaceBasketDialog from '../../marketplace/MarketplaceBasketDialog.component';
import { fetchCompanyTheme } from '../../../libs/theme/actions';

import { fetchProfile } from '../../../libs/consumer-space/actions';

import { parseQueryString } from '../../../http';

import { linkMeToCompany } from '../../../libs/member/actions';

import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import {
  addItemToBasket,
  removeItemFromBasket,
  fetchCurrentBasket,
} from '../../../libs/checkout/actions';
import { getCurrentBasket } from '../../../libs/checkout/selectors';
import ConsumerAppBar from '../ConsumerAppBar.container';

import BookingCapabilities from '../../../libs/private-service/components/booking-module/BookingCapabilitiesList.component';
import PrivateServiceListItem from '../../../libs/private-service/components/service/PrivateServiceListItem.component';
import PrivateSlotListItem from '../../../libs/private-service/components/slot/PrivateSlotListItem.component';
import { getPrivateSlot } from '../../../libs/private-service/selectors/private-slot';
import {
  getPrivateService,
  getPrivateServiceTagEligible,
  getPrivateServiceTagEligibleLoading,
} from '../../../libs/private-service/selectors/private-service';
import {
  getPrivateConsumerPassList,
  getUnPaidBookingAvailabilityForPrivateslot,
} from '../../../libs/private-service/selectors/private-consumer-pass';
import { getPrivatePassListWithPrivateService } from '../../../libs/private-service/selectors/private-pass';
import {
  fetchPrivateSlot,
  fetchPrivateService,
  fetchCompatiblePrivatePass,
  fetchCompatiblePrivateConsumerPass,
  registerPrivateBooking,
  fetchAllPrivatePassCategory,
  checkPrivateSlotUnpaidBookingEligibility,
  checkPrivateServiceTagEligibility,
} from '../../../libs/private-service/actions';
import type {
  PrivateSlot,
  PrivateConsumerPass,
  PrivatePassCategoryWithPasses,
  PrivateService,
  PrivateBooking,
} from '../../../libs/private-service/types';
import type { OptionCallback } from '#src/state/types.ts';
import type { Basket } from '../../../libs/checkout/types';
import WidgetUtils from '../../../libs/widget/WidgetUtils';
import { getPrivatePassByCategoryWithPasses } from '../../../libs/private-service/selectors/private-pass-category';
import { borderRadius } from 'react-select/lib/theme';
import { LabelOff } from '@material-ui/icons';
import { getMarketplaceRoute } from '../../../libs/marketplace/routing-utils';
import { analyticsClientB2C } from '#src/components/analytics/mixpanel';
import { trackBookingConfirmedEvent } from '#src/events/booking/trackers';

type Props = {
  privateServiceId: number,
  privateSlotId: number,

  date: string,
  company: number,
  data: any,
  t: TFunction,

  fetchPrivateService: (privateServiceId: number) => void,
  fetchPrivateSlot: (privateServiceId: number, privateSlotId: number) => void,
  privateSlot?: PrivateSlot,

  fetchCurrentBasket: (company: number) => void,

  fetchCompatiblePrivatePass: (privateSlotId: number, params: any) => void,
  fetchCompatiblePrivateConsumerPass: (privateSlotId: number) => void,
  fetchAllPrivatePassCategory: (company: number) => void,

  addItemToBasket: (
    basketId: string,
    data: any,
    options?: { onSuccess?: () => void, onError?: () => void },
  ) => void,
  goToCheckout: (company: number) => void,

  loading: boolean,

  registerPrivateBooking: (
    params: any,
    options?: {
      onSuccess?: (privateBooking: PrivateBooking) => void,
      onError?: () => void,
    },
    asConsumer: boolean,
  ) => void,

  compatiblePrivateConsumerPass: Array<PrivateConsumerPass>,
  compatiblePrivatePassByCategory: Array<PrivatePassCategoryWithPasses>,

  goToConsumerHome: () => void,
  basket: Basket,
  privateService?: PrivateService,

  classes: Object,

  fetchCurrentBasket: (companyId: number) => void,
  currentBasket?: Basket,
  currentBasketLoading: boolean,
  removeItemFromBasket: (basketId: string, data: any) => void,
  addItemToBasket: (basketId: string, data: any) => void,
  goToCheckout: (companyId: number) => void,

  fetchProfile: () => void,

  auth: any,
  checkPrivateSlotUnpaidBookingEligibility: (params: {
    privateSlotId: number,
  }) => void,
  checkPrivateServiceTagEligibility: (
    privateServiceId: number,
    callback: OptionCallback,
  ) => void,
  compatibleWithUnpaidBooking: boolean,
  theme: Theme,
  push: (string) => void,
  eligibleByTags: boolean,
  eligibleByTagsLoading: boolean,
};

type State = {
  address?: string,
  hastrackedPassSelectionForAppointmentViewed: boolean,
};

export class PrivateSlotPayment extends React.Component<Props, State> {
  state = {
    address: '',
    hastrackedPassSelectionForAppointmentViewed: false,
  };

  componentDidMount() {
    this.props.checkPrivateServiceTagEligibility(
      this.props.privateServiceId,
      null,
    );
    this.props.fetchPrivateService(this.props.privateServiceId);
    this.props.fetchPrivateSlot(
      this.props.privateServiceId,
      this.props.privateSlotId,
    );
    this.props.fetchCurrentBasket(this.props.company);
    this.props.fetchAllPrivatePassCategory(this.props.company);

    this.props.fetchCompatiblePrivatePass(this.props.privateSlotId, {
      as_consumer: true,
      date: DateTime.fromISO(this.props.data.date).toISODate(),
    });
    this.props.fetchCompatiblePrivateConsumerPass(this.props.privateSlotId, {
      date: DateTime.fromISO(this.props.data.date).toISODate(),
    });

    if (this.props.auth.authenticated) {
      this.props.fetchProfile();
    }
    this.props.checkPrivateSlotUnpaidBookingEligibility({
      privateSlotId: this.props.privateSlotId,
    });
  }

  handleConsumerPassClick = (consumerPassId: number, unpaid?: boolean) => {
    this.setState({ processing: true });
    const { associated_establishment, associated_coach, establishment, date } =
      this.props.data;
    this.props.registerPrivateBooking(
      {
        private_slot: this.props.privateSlotId,
        private_consumer_pass: unpaid ? null : consumerPassId,
        address: this.state.address,
        date,
        date_start: date,
        associated_coach: associated_coach || null,
        associated_establishment: associated_establishment || null,
        establishment: establishment || null,
        notify_member: true,
        unpaid,
      },
      {
        onSuccess: (privateBooking) => {
          if (WidgetUtils.isWidget()) {
            WidgetUtils.paymentSuccess();
          }
          analyticsClientB2C.track(
            trackBookingConfirmedEvent({
              activity_id: privateBooking.private_service,
              activity_name: privateBooking.name,
              offer_id: privateBooking.private_service,
              session_type: 'appointment',
            }),
          );

          this.props.goToConsumerHome(this.props.company);
          this.setState({ processing: false });
        },
        onError: () => {
          this.setState({ processing: false });
        },
      },
      true,
    );
  };

  handlePrivatePassClick = (privatePassId: number) => {
    this.setState({ processing: true });
    const { associated_establishment, establishment, associated_coach, date } =
      this.props.data;
    this.props.addItemToBasket(
      this.props.basket.id,
      {
        buyable_item_identifier: BUYABLE_ITEM_PRIVATE_PASS,
        quantity: 1,
        buyable_item_id: privatePassId,
        extra_data: {
          next_private_booking: {
            private_slot: this.props.privateSlotId,
            date,
            associated_coach: associated_coach || null,
            associated_establishment: associated_establishment || null,
            establishment: establishment || null,
            address: this.state.address,
          },
        },
      },
      {
        onError: () => {
          this.setState({ processing: false });
        },
        onSuccess: () => {
          this.props.goToCheckout(this.props.company);
          this.setState({ processing: false });
        },
      },
    );
  };

  toggleCurrentBasketOpen = (currentBasketOpen: boolean) =>
    this.setState({ currentBasketOpen });

  goToAppointments = () => {
    this.props.push(
      getMarketplaceRoute('_', this.props.company, 'private-service'),
    );
  };

  getTrackingParams = () => {
    if (
      !this.props.privateService?.name ||
      !this.props.privateServiceId ||
      this.state.hastrackedPassSelectionForAppointmentViewed
    )
      return null;
    this.setState({ hastrackedPassSelectionForAppointmentViewed: true });
    return {
      activity_id: this.props.privateServiceId,
      activity_name: this.props.privateService?.name || '',
      offer_id: this.props.privateServiceId,
      session_type: 'appointment',
    };
  };

  render() {
    if (
      this.props.eligibleByTagsLoading ||
      this.props.loading ||
      !this.props.privateSlot ||
      !this.props.privateService
    ) {
      return (
        <div className={this.props.classes.container}>
          <CircularProgress />
        </div>
      );
    }

    if (!this.props.eligibleByTags) {
      return (
        <ConsumerAppBar>
          <PrivateServiceIneligibleBanner
            goToAppointments={this.goToAppointments}
          />
        </ConsumerAppBar>
      );
    }

    const needAddress = this.props.privateService.is_home_service;

    return (
      <ConsumerAppBar>
        <div className={this.props.classes.container}>
          <div className={this.props.classes.titleContainer}>
            <ScheduleIcon
              className={this.props.classes.leftIcon}
              fontSize="large"
            />
            <Typography variant="h4">
              {DateTime.fromISO(this.props.data.date)
                .setZone(this.props.theme.timezone_name)
                .toFormat('DDDD t')}
            </Typography>
          </div>
          <div className={this.props.classes.paper}>
            <Paper>
              <PrivateServiceListItem
                privateService={this.props.privateService}
              />
              <PrivateSlotListItem
                hideCredits={this.props.theme.hide_credits_for_customers}
                slot={this.props.privateSlot}
              />
            </Paper>
            <div className={this.props.classes.bookingCapabilities}>
              {needAddress && !this.state.addressValidated ? (
                <div className={this.props.classes.addressContainer}>
                  <TextField
                    fullWidth
                    multiline
                    helperText={this.props.t('bookerModule.address.helperText')}
                    label={this.props.t('bookerModule.address.label')}
                    onChange={(ev) =>
                      this.setState({ address: ev.target.value })
                    }
                    rows={5}
                    value={this.state.address}
                    variant="outlined"
                  />
                  <Button
                    onClick={() => this.setState({ addressValidated: true })}
                  >
                    {this.props.t('bookerModule.address.submit')}
                  </Button>
                </div>
              ) : (
                <BookingCapabilities
                  compatibleWithUnpaidBooking={
                    this.props.compatibleWithUnpaidBooking
                  }
                  hideCredits={this.props.theme.hide_credits_for_customers}
                  isExcludingTax={
                    this.props.theme.is_tax_excluded_in_marketplace
                  }
                  loading={this.state.processing}
                  onConsumerPassClick={this.handleConsumerPassClick}
                  onPrivatePassClick={this.handlePrivatePassClick}
                  privateConsumerPassList={
                    this.props.compatiblePrivateConsumerPass
                  }
                  privatePassByCategory={this.props.compatiblePrivatePassByCategory.filter(
                    (cat) => cat.passes.length,
                  )}
                  privateSlotCredit={this.props.privateSlot?.credit}
                  trackingParams={this.getTrackingParams()}
                />
              )}
            </div>
            <MarketplaceBasketDialog
              basket={this.props.currentBasket}
              goToCheckout={() =>
                this.props.goToCheckout(this.props.currentBasket.company)
              }
              loading={this.props.currentBasketLoading}
              onAddCheckoutItem={(data) =>
                this.props.addItemToBasket(this.props.currentBasket.id, data)
              }
              onCancel={() => this.toggleCurrentBasketOpen(false)}
              onRemoveCheckoutItem={(data) =>
                this.props.removeItemFromBasket(
                  this.props.currentBasket.id,
                  data,
                )
              }
              open={!!this.state.currentBasketOpen}
            />
          </div>
        </div>
      </ConsumerAppBar>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingTop: theme.spacing(16),
  },
  addressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  paper: {
    padding: theme.spacing(2),
  },
  bookingCapabilities: {
    marginTop: theme.spacing(3),
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  accountIcon: {
    marginRight: theme.spacing(1),
  },
  loginButton: {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  routerParamsToProps({
    privateServiceId: 'privateServiceId:number',
    privateSlotId: 'privateSlotId:number',
  }),
  withTranslation(['privateService']),
  withRouter,
  withProps(({ location }) => ({
    data: JSON.parse(
      decodeURIComponent(parseQueryString(location.search).data),
    ),
    company: parseQueryString(location.search).membership,
  })),
  connect(
    (state, { privateServiceId, privateSlotId }) => ({
      auth: state.auth,
      currentBasket: getCurrentBasket(state),
      currentBasketLoading: state.checkout.basket.current.loading,
      theme: themeSelectors.getTheme(state),

      compatiblePrivateConsumerPass: getPrivateConsumerPassList(state),
      compatiblePrivatePassByCategory: getPrivatePassByCategoryWithPasses(
        getPrivatePassListWithPrivateService,
      )(state),
      compatibleWithUnpaidBooking: getUnPaidBookingAvailabilityForPrivateslot(
        state,
        privateSlotId,
      ),
      privateSlot: getPrivateSlot(state, privateSlotId),
      privateService: getPrivateService(state, privateServiceId),
      basket: getCurrentBasket(state),
      loading:
        state.privateService.privateService.loading ||
        state.privateService.privatePass.loading ||
        state.privateService.privateSlot.loading ||
        state.privateService.privateConsumerPass.loading,
      eligibleByTags: getPrivateServiceTagEligible(state, privateServiceId),
      eligibleByTagsLoading: getPrivateServiceTagEligibleLoading(state),
    }),
    {
      linkMeToCompany,
      fetchCompanyTheme,
      goBack: goBackRouter,
      push,
      fetchProfile,
      fetchAllPrivatePassCategory,
      fetchPrivateSlot,
      fetchPrivateService,
      fetchCompatiblePrivatePass,
      fetchCompatiblePrivateConsumerPass,
      registerPrivateBooking,
      addItemToBasket,
      removeItemFromBasket,
      fetchCurrentBasket,
      goToCheckout: (companyId: number) => replace(getCheckoutUrl(companyId)),
      goToConsumerHome: (companyId: number) =>
        replace(getUserSpaceUrl(companyId)),
      checkPrivateSlotUnpaidBookingEligibility,
      checkPrivateServiceTagEligibility,
    },
  ),
)(PrivateSlotPayment);
