// @flow
import React from 'react';
import moment from 'moment-timezone';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { replace, goBack as goBackRouter } from 'connected-react-router';
import { alpha } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withTranslation, TFunction } from 'react-i18next';
import { BUYABLE_ITEM_PRIVATE_PASS } from '@bsport/common/lib/master-data/buyable-items';

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
import { snackbarError } from '../../../libs/snackbar/actions';
import ConsumerAppBar from '../ConsumerAppBar.container';

import BookingCapabilities from '../../../libs/private-service/components/booking-module/BookingCapabilitiesList.component';
import PrivateServiceListItem from '../../../libs/private-service/components/service/PrivateServiceListItem.component';
import PrivateSlotListItem from '../../../libs/private-service/components/slot/PrivateSlotListItem.component';
import { getPrivateSlot } from '../../../libs/private-service/selectors/private-slot';
import { getPrivateService } from '../../../libs/private-service/selectors/private-service';
import { getPrivateConsumerPassList } from '../../../libs/private-service/selectors/private-consumer-pass';
import { getPrivatePassListWithPrivateService } from '../../../libs/private-service/selectors/private-pass';
import {
  fetchPrivateSlot,
  fetchPrivateService,
  fetchCompatiblePrivatePass,
  fetchCompatiblePrivateConsumerPass,
  registerPrivateBooking,
  fetchAllPrivatePassCategory,
} from '../../../libs/private-service/actions';
import type {
  PrivateSlot,
  PrivateConsumerPass,
  PrivatePassCategoryWithPasses,
} from '../../../libs/private-service/types';
import WidgetUtils from '../../../libs/widget/WidgetUtils';
import { getPrivatePassByCategoryWithPasses } from '../../../libs/private-service/selectors/private-pass-category';

type Props = {
  privateServiceId: number,
  privateSlotId: number,

  date: string,
  company: number,
  data: any,
  t: TFunction,

  fetchPrivateService: (privateServiceId: number) => void,
  fetchPrivateSlot: (privateServiceId: number, privateSlotId: number) => void,
  privateSlot: ?PrivateSlot,

  fetchCurrentBasket: (company: number) => void,

  fetchCompatiblePrivatePass: (privateSlotId: number, params: any) => void,
  fetchCompatiblePrivateConsumerPass: (privateSlotId: number) => void,
  fetchAllPrivatePassCategory: (company: number) => void,

  addItemToBasket: (
    basketId: string,
    data: any,
    options: ?{ onSuccess: ?() => void, onError: ?() => void },
  ) => void,
  goToCheckout: (company: number) => void,

  loading: boolean,

  registerPrivateBooking: (
    params: any,
    options: ?{ onSuccess: ?() => void, onError: ?() => void },
  ) => void,

  compatiblePrivateConsumerPass: Array<PrivateConsumerPass>,
  compatiblePrivatePassByCategory: Array<PrivatePassCategoryWithPasses>,

  goToConsumerHome: () => void,
  displaySnackbarError: (steing) => void,
  basket: Basket,
  privateService: ?PrivateService,

  classes: Object,

  fetchCurrentBasket: (companyId: number) => void,
  currentBasket: ?Basket,
  currentBasketLoading: boolean,
  removeItemFromBasket: (basketId: string, data: any) => void,
  addItemToBasket: (basketId: string, data: any) => void,
  goToCheckout: (companyId: number) => void,

  fetchProfile: () => void,

  auth: any,
};

type State = {
  address: ?string,
};

export class PrivateSlotPayment extends React.Component<Props, State> {
  state = {
    address: '',
  };

  componentDidMount() {
    this.props.fetchPrivateService(this.props.privateServiceId);
    this.props.fetchPrivateSlot(
      this.props.privateServiceId,
      this.props.privateSlotId,
    );
    this.props.fetchCurrentBasket(this.props.company);
    this.props.fetchAllPrivatePassCategory(this.props.company);

    this.props.fetchCompatiblePrivatePass(this.props.privateSlotId, {
      as_consumer: true,
      date: moment(this.props.data.date).format('YYYY-MM-DD'),
    });
    this.props.fetchCompatiblePrivateConsumerPass(this.props.privateSlotId, {
      date: moment(this.props.data.date).format('YYYY-MM-DD'),
    });

    if (this.props.auth.authenticated) {
      this.props.fetchProfile();
    }
  }

  handleConsumerPassClick = (consumerPassId: number) => {
    this.setState({ processing: true });
    const { associated_establishment, associated_coach, establishment, date } =
      this.props.data;
    this.props.registerPrivateBooking(
      {
        private_slot: this.props.privateSlotId,
        private_consumer_pass: consumerPassId,
        address: this.state.address,
        date,
        date_start: date,
        associated_coach: associated_coach || null,
        associated_establishment: associated_establishment || null,
        establishment: establishment || null,
        notify_member: true,
      },
      {
        onSuccess: () => {
          if (WidgetUtils.isWidget()) {
            WidgetUtils.paymentSuccess();
          }

          this.props.goToConsumerHome();
          this.setState({ processing: false });
        },
        onError: () => {
          this.setState({ processing: false });
          this.props.displaySnackbarError();
        },
      },
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
          this.props.displaySnackbarError();
          this.setState({ processing: false });
        },
        onSuccess: () => {
          this.props.goToCheckout(this.props.company);
          this.setState({ processing: false });
        },
      },
    );
  };

  toogleCurrentBasketOpen = (currentBasketOpen: boolean) =>
    this.setState({ currentBasketOpen });

  render() {
    if (
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

    const needAddress = this.props.privateService.is_home_service;

    return (
      <ConsumerAppBar>
        <div className={this.props.classes.container}>
          <div className={this.props.classes.titleContainer}>
            <ScheduleIcon
              fontSize="large"
              className={this.props.classes.leftIcon}
            />
            <Typography variant="h4">
              {moment(this.props.data.date).format('LLLL')}
            </Typography>
          </div>
          <div className={this.props.classes.paper}>
            <Paper>
              <PrivateServiceListItem
                privateService={this.props.privateService}
              />
              <PrivateSlotListItem slot={this.props.privateSlot} />
            </Paper>
            <div className={this.props.classes.bookingCapabilities}>
              {needAddress && !this.state.addressValidated ? (
                <div className={this.props.classes.addressContainer}>
                  <TextField
                    label={this.props.t('bookerModule.address.label')}
                    helperText={this.props.t('bookerModule.address.helperText')}
                    onChange={(ev) =>
                      this.setState({ address: ev.target.value })
                    }
                    value={this.state.address}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={5}
                  />
                  <Button
                    onClick={() => this.setState({ addressValidated: true })}
                  >
                    {this.props.t('bookerModule.address.submit')}
                  </Button>
                </div>
              ) : (
                <BookingCapabilities
                  loading={this.state.processing}
                  privateConsumerPassList={
                    this.props.compatiblePrivateConsumerPass
                  }
                  privatePassByCategory={this.props.compatiblePrivatePassByCategory.filter(
                    (cat) => cat.passes.length,
                  )}
                  onConsumerPassClick={this.handleConsumerPassClick}
                  onPrivatePassClick={this.handlePrivatePassClick}
                />
              )}
            </div>
            <MarketplaceBasketDialog
              open={!!this.state.currentBasketOpen}
              basket={this.props.currentBasket}
              onCancel={() => this.toogleCurrentBasketOpen(false)}
              loading={this.props.currentBasketLoading}
              onRemoveCheckoutItem={(data) =>
                this.props.removeItemFromBasket(
                  this.props.currentBasket.id,
                  data,
                )
              }
              onAddCheckoutItem={(data) =>
                this.props.addItemToBasket(this.props.currentBasket.id, data)
              }
              goToCheckout={() =>
                this.props.goToCheckout(this.props.currentBasket.company)
              }
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
    paddingBottom: theme.spacing(32),
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
      privateSlot: getPrivateSlot(state, privateSlotId),
      privateService: getPrivateService(state, privateServiceId),
      basket: getCurrentBasket(state),
      loading:
        state.privateService.privateService.loading ||
        state.privateService.privatePass.loading ||
        state.privateService.privateSlot.loading ||
        state.privateService.privateConsumerPass.loading,
    }),
    {
      linkMeToCompany,
      fetchCompanyTheme,
      goBack: goBackRouter,
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
      goToCheckout: (companyId: number) => replace(`/checkout/${companyId}`),
      displaySnackbarError: () =>
        snackbarError('privateService:bookerModule.error'),
      goToConsumerHome: () => replace('/customer'),
    },
  ),
)(PrivateSlotPayment);
