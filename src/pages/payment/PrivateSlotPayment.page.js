// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import { BUYABLE_ITEM_PRIVATE_PASS } from '@bsport/common/lib/master-data/buyable-items';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  addItemToBasket,
  removeItemFromBasket,
  fetchCurrentBasket,
} from '../../libs/checkout/actions';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import { snackbarError } from '../../actions/snackbar.actions';

import BookingCapabilities from '../../libs/private-service/components/booking-module/BookingCapabilitiesList.component';
import PrivateBookingPreviewListItem from '../../libs/private-service/components/booking-module/PrivateBookingPreviewListItem.component';
import { getPrivateSlot } from '../../libs/private-service/selectors/private-slot';
import { getPrivateService } from '../../libs/private-service/selectors/private-service';
import { getPrivateConsumerPassList } from '../../libs/private-service/selectors/private-consumer-pass';
import { getPrivatePassListWithPrivateService } from '../../libs/private-service/selectors/private-pass';
import {
  fetchPrivateBookingPreview,
  fetchPrivateSlot,
  fetchPrivateService,
  fetchCompatiblePrivatePass,
  fetchCompatiblePrivateConsumerPass,
  registerPrivateBooking,
} from '../../libs/private-service/actions';
import type {
  PrivateSlot,
  PrivateBookingPreview,
  PrivateConsumerPass,
  PrivatePass,
} from '../../libs/private-service/types';

import AddressForm from './AddressForm.component';

type Props = {
  privateServiceId: number,
  privateSlotId: number,

  associatedCoachId: number,
  date: string,

  fetchPrivateService: (privateServiceId: number) => void,
  fetchPrivateSlot: (privateServiceId: number, privateSlotId: number) => void,
  privateSlot: ?PrivateSlot,

  fetchCurrentBasket: (company: number) => void,
  fetchPrivateBookingPreview: (
    privateSlotId: number,
    associatedCoachId: number,
    date: string,
    options: ?{ onSuccess?: () => void, onError?: () => void },
  ) => void,

  fetchCompatiblePrivatePass: (privateSlotId: number, params: any) => void,
  fetchCompatiblePrivateConsumerPass: (privateSlotId: number) => void,

  addItemToBasket: (
    basketId: string,
    data: any,
    options: ?{ onSuccess: ?() => void, onError: ?() => void },
  ) => void,
  goToCheckout: (company: number) => void,

  loading: boolean,

  privateBookingPreview: ?PrivateBookingPreview,
  registerPrivateBooking: (
    params: any,
    options: ?{ onSuccess: ?() => void, onError: ?() => void },
  ) => void,

  compatiblePrivateConsumerPass: Array<PrivateConsumerPass>,
  compatiblePrivatePass: Array<PrivatePass>,

  goToConsumerHome: () => void,
  displaySnackbarError: (steing) => void,
  basket: Basket,
  privateService: ?PrivateService,

  classes: Object,
};

type State = {
  address: ?string,
};

export class PrivateSlotPayment extends React.Component<Props, State> {
  state = {
    address: null,
  };

  componentDidMount() {
    this.props.fetchPrivateService(this.props.privateServiceId);
    this.props.fetchPrivateSlot(
      this.props.privateServiceId,
      this.props.privateSlotId,
    );
    this.props.fetchPrivateBookingPreview(
      this.props.privateSlotId,
      this.props.associatedCoachId,
      this.props.date,
      {
        onSuccess: (privateBookingPreview) =>
          this.props.fetchCurrentBasket(privateBookingPreview.company),
      },
    );

    this.props.fetchCompatiblePrivatePass(this.props.privateSlotId, {
      as_consumer: true,
    });
    this.props.fetchCompatiblePrivateConsumerPass(this.props.privateSlotId);
  }

  handleConsumerPassClick = (consumerPassId: number) => {
    this.setState({ processing: true });
    this.props.registerPrivateBooking(
      {
        private_slot: this.props.privateSlotId,
        private_consumer_pass: consumerPassId,
        date_start: this.props.date,
        coach: this.props.associatedCoachId,
        address: this.state.address,
      },
      {
        onSuccess: () => {
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
    this.props.addItemToBasket(
      this.props.basket.id,
      {
        buyable_item_identifier: BUYABLE_ITEM_PRIVATE_PASS,
        quantity: 1,
        buyable_item_id: privatePassId,
        extra_data: {
          next_private_booking: {
            private_slot: this.props.privateSlotId,
            date: this.props.date,
            coach: this.props.associatedCoachId,
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
          this.props.goToCheckout(this.props.privateBookingPreview.company);
          this.setState({ processing: false });
        },
      },
    );
  };

  render() {
    if (
      this.props.loading ||
      !this.props.privateSlot ||
      !this.props.privateService ||
      !this.props.privateBookingPreview
    ) {
      return (
        <div className={this.props.classes.container}>
          <CircularProgress />
        </div>
      );
    }
    return (
      <div className={this.props.classes.container}>
        <Paper className={this.props.classes.paper}>
          <PrivateBookingPreviewListItem
            preview={this.props.privateBookingPreview}
            credit_cost={this.props.privateSlot.credit}
            address={this.state.address}
            onAddressEdit={
              this.props.privateService.establishments.length === 0
                ? () => this.setState({ address: null })
                : null
            }
          />
          <div className={this.props.classes.bookingCapabilities}>
            {!this.state.address &&
            this.props.privateService.establishments.length === 0 ? (
              <AddressForm
                address={this.state.address}
                onSubmit={(address) => this.setState({ address })}
              />
            ) : (
              <BookingCapabilities
                loading={this.state.processing}
                privateConsumerPassList={
                  this.props.compatiblePrivateConsumerPass
                }
                privatePassList={this.props.compatiblePrivatePass}
                onConsumerPassClick={this.handleConsumerPassClick}
                onPrivatePassClick={this.handlePrivatePassClick}
              />
            )}
          </div>
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingBottom: theme.spacing.unit * 32,
    paddingTop: theme.spacing.unit * 16,
  },
  paper: {
    padding: theme.spacing.unit * 2,
  },
  bookingCapabilities: {
    marginTop: theme.spacing.unit * 3,
  },
});

export default compose(
  withStyles(styles),
  routerParamsToProps({
    privateServiceId: 'privateServiceId:number',
    privateSlotId: 'privateSlotId:number',
    associatedCoachId: 'associatedCoachId:number',
    date: 'date',
  }),
  connect(
    (state, { privateServiceId, privateSlotId }) => ({
      privateBookingPreview: state.privateService.privateBooking.preview.data,
      compatiblePrivateConsumerPass: getPrivateConsumerPassList(state),
      compatiblePrivatePass: getPrivatePassListWithPrivateService(state),
      privateSlot: getPrivateSlot(state, privateSlotId),
      privateService: getPrivateService(state, privateServiceId),
      basket: getCurrentBasket(state),
      loading:
        state.privateService.privateService.loading ||
        state.privateService.privatePass.loading ||
        state.privateService.privateSlot.loading ||
        state.privateService.privateBooking.preview.loading ||
        state.privateService.privateConsumerPass.loading,
    }),
    {
      fetchPrivateSlot,
      fetchPrivateService,
      fetchPrivateBookingPreview,
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
