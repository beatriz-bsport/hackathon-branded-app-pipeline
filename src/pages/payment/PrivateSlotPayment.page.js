// @flow
import React from 'react';
import moment from 'moment';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { BUYABLE_ITEM_PRIVATE_PASS } from '@bsport/common/lib/master-data/buyable-items';
import parse from '../../query-string';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  addItemToBasket,
  removeItemFromBasket,
  fetchCurrentBasket,
} from '../../libs/checkout/actions';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import { snackbarError } from '../../actions/snackbar.actions';

import BookingCapabilities from '../../libs/private-service/components/booking-module/BookingCapabilitiesList.component';
import PrivateServiceListItem from '../../libs/private-service/components/service/PrivateServiceListItem.component';
import PrivateSlotListItem from '../../libs/private-service/components/slot/PrivateSlotListItem.component';
import { getPrivateSlot } from '../../libs/private-service/selectors/private-slot';
import { getPrivateService } from '../../libs/private-service/selectors/private-service';
import { getPrivateConsumerPassList } from '../../libs/private-service/selectors/private-consumer-pass';
import { getPrivatePassListWithPrivateService } from '../../libs/private-service/selectors/private-pass';
import {
  fetchPrivateSlot,
  fetchPrivateService,
  fetchCompatiblePrivatePass,
  fetchCompatiblePrivateConsumerPass,
  registerPrivateBooking,
} from '../../libs/private-service/actions';
import type {
  PrivateSlot,
  PrivateConsumerPass,
  PrivatePass,
} from '../../libs/private-service/types';

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
    address: '',
  };

  componentDidMount() {
    this.props.fetchPrivateService(this.props.privateServiceId);
    this.props.fetchPrivateSlot(
      this.props.privateServiceId,
      this.props.privateSlotId,
    );
    this.props.fetchCurrentBasket(this.props.company);

    this.props.fetchCompatiblePrivatePass(this.props.privateSlotId, {
      as_consumer: true,
      date: moment(this.props.data.date).format('YYYY-MM-DD'),
    });
    this.props.fetchCompatiblePrivateConsumerPass(this.props.privateSlotId, {
      date: moment(this.props.data.date).format('YYYY-MM-DD'),
    });
  }

  handleConsumerPassClick = (consumerPassId: number) => {
    this.setState({ processing: true });
    const {
      associated_establishment,
      associated_coach,
      date,
    } = this.props.data;
    this.props.registerPrivateBooking(
      {
        private_slot: this.props.privateSlotId,
        private_consumer_pass: consumerPassId,
        address: this.state.address,
        date,
        date_start: date,
        associated_coach: associated_coach || null,
        associated_establishment: associated_establishment || null,
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
    const {
      associated_establishment,
      associated_coach,
      date,
    } = this.props.data;
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
                  onChange={(ev) => this.setState({ address: ev.target.value })}
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
                privatePassList={this.props.compatiblePrivatePass}
                onConsumerPassClick={this.handleConsumerPassClick}
                onPrivatePassClick={this.handlePrivatePassClick}
              />
            )}
          </div>
        </div>
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
  addressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  paper: {
    padding: theme.spacing.unit * 2,
  },
  bookingCapabilities: {
    marginTop: theme.spacing.unit * 3,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  routerParamsToProps({
    privateServiceId: 'privateServiceId:number',
    privateSlotId: 'privateSlotId:number',
  }),
  withNamespaces(['privateService']),
  withRouter,
  withProps(({ location }) => ({
    data: JSON.parse(decodeURIComponent(parse(location.search).data)),
    company: parse(location.search).membership,
  })),
  connect(
    (state, { privateServiceId, privateSlotId }) => ({
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
