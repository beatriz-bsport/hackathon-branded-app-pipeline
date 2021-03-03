import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { CircularProgress, Tab, Tabs } from '@material-ui/core';
import AppBarMUI from '@material-ui/core/AppBar';
import { Theme, withStyles } from '@material-ui/core/styles';
import { WithTranslation, withTranslation } from 'react-i18next';
import moment from 'moment';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { RootState } from '../../reducers';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { getAllBookingAndPrivateBooking } from '../../libs/consumer-space/selectors';
import {
  BookingsAndPrivateBookingsTypeEnum,
  fetchBookingsAndPrivateBookings,
} from '../../libs/consumer-space/actions';
import { fetchMembershipListAsConsumer } from '../../libs/membership/actions';
import { fetchCoachBulk } from '../../libs/associated-coach/actions';
import { fetchMetaActivityBulk } from '../../libs/meta-activity/actions';
import { fetchEstablishmentBulk } from '../../libs/establishment/actions';
import { fetchOfferBulk } from '../../libs/offer/actions';

import { getMembership } from '../../libs/membership/selectors';
import ConsumerDashboardBookingPanel from '../../libs/consumer-space/components/ConsumerDashboardBookingPanel.component';
import themeSelectors from '../../libs/theme/selectors';
import { OptionCallback } from '../../state/types';
import PrivateBookingCancellationDialog from '../../libs/private-service/components/booking/PrivateBookingCancellationDialog';
import BookingCancellationDialog from '../../libs/booking/components/BookingCancellationDialog.component';
import { Booking } from '../../libs/booking/types';
import { PrivateBooking } from '../../libs/private-service/types';
import { cancelBooking as cancelBookingAction } from '../../libs/booking/actions';
import { disablePrivateBooking } from '../../libs/private-service/actions';
import { fetchCompanyTheme } from '../../libs/theme/actions';

type OwnProps = {
  companyId: number;
  companyName: string;
};

type OwnAndConnectedProps = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type Props = OwnAndConnectedProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation &
  WithHandlerType<typeof mapWithHandlers> &
  StateHandlerType;

const SHOW_FUTURE_TAB = 0;
const SHOW_PAST_TAB = 1;

interface State {
  tab: SHOW_FUTURE_TAB | SHOW_PAST_TAB;
}

class BookingsAndPrivateBookingsPage extends React.PureComponent<Props, State> {
  state: State = {
    tab: SHOW_FUTURE_TAB,
  };

  componentDidMount() {
    this.props.fetchMembershipListAsConsumer({ page_size: 2 });
    this.props.fetchCompanyTheme(this.props.companyId);

    if (this.props.membership) {
      this.props.fetchBookingsAndPrivateBookings({
        member: this.props.membership.id,
        page: 1,
      });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevProps.membership && this.props.membership) {
      this.props.fetchBookingsAndPrivateBookings({
        member: this.props.membership.id,
        page: 1,
      });
    }

    if (prevState.tab !== this.state.tab) {
      this.props.fetchBookingsAndPrivateBookings({
        member: this.props.membership.id,
        page: 1,
        type:
          this.state.tab === SHOW_FUTURE_TAB
            ? BookingsAndPrivateBookingsTypeEnum.future
            : BookingsAndPrivateBookingsTypeEnum.past,
      });
    }
  }

  onDiscardBooking = (id: number, dialogOptions: OptionCallback) => {
    this.props.cancelBooking(this.props.bookingToCancel.id, null, {
      onSuccess: () => {
        dialogOptions.onSuccess();
        this.props.setBookingToCancel(null);
        this.props.fetchBookingsAndPrivateBookings({
          member: this.props.membership.id,
          page: 1,
          type:
            this.state.tab === SHOW_FUTURE_TAB
              ? BookingsAndPrivateBookingsTypeEnum.future
              : BookingsAndPrivateBookingsTypeEnum.past,
        });
      },
      onError: () => {
        dialogOptions.onError();
        this.props.setBookingToCancel(null);
      },
    });
  };

  onDiscardPrivateBooking = (id: number, dialogOptions: OptionCallback) => {
    this.props.discardPrivateBooking(
      id,
      {},
      {
        onSuccess: () => {
          dialogOptions.onSuccess();
          this.props.setPrivateBookingToCancel(null);
          this.props.fetchBookingsAndPrivateBookings({
            member: this.props.membership.id,
            page: 1,
            type:
              this.state.tab === SHOW_FUTURE_TAB
                ? BookingsAndPrivateBookingsTypeEnum.future
                : BookingsAndPrivateBookingsTypeEnum.past,
          });
        },
      },
    );
  };

  onClickShowMoreBookings = () => {
    this.props.fetchBookingsAndPrivateBookings({
      member: this.props.membership.id,
      type:
        this.state.tab === SHOW_FUTURE_TAB
          ? BookingsAndPrivateBookingsTypeEnum.future
          : BookingsAndPrivateBookingsTypeEnum.past,
    });
  };

  render() {
    const { classes, t } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.bookingsContainer}>
          <AppBarMUI position="relative" color="white">
            <Tabs
              value={this.state.tab}
              onChange={(e, tab) => this.setState({ tab })}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab
                label={t('consumerSpace:widget.futureBooking')}
                value={SHOW_FUTURE_TAB}
              />
              <Tab
                label={t('consumerSpace:widget.pastBooking')}
                value={SHOW_PAST_TAB}
              />
            </Tabs>
          </AppBarMUI>

          {(!this.props.bookingsAndPrivateBookings.length &&
            this.props.bookingsAndPrivateBookingsLoading) ||
          this.props.companyThemeLoading ? (
            <div className={classes.loaderView}>
              <CircularProgress />
            </div>
          ) : (
            <div className={classes.bookingsContainerInner}>
              <ConsumerDashboardBookingPanel
                bookingsAndPrivateBookings={
                  this.props.bookingsAndPrivateBookings
                }
                isPast={this.state.tab === SHOW_PAST_TAB}
                loading={this.props.bookingsAndPrivateBookingsLoading}
                hasMore={this.props.hasMoreBookingsAndPrivateBookings}
                timezone={this.props.companyTheme.timezone_name}
                membership={this.props.membership}
                onDiscardBooking={this.props.setBookingToCancel}
                onDiscardPrivateBooking={this.props.setPrivateBookingToCancel}
                showMoreBooking={this.onClickShowMoreBookings}
                fullWidth
                hideTitle
              />
            </div>
          )}

          <BookingCancellationDialog
            open={!!this.props.bookingToCancel}
            fullScreen
            booking={this.props.bookingToCancel}
            onCancel={() => this.props.setBookingToCancel(null)}
            onSubmit={(options: OptionCallback) =>
              this.onDiscardBooking(this.props.bookingToCancel.id, options)
            }
          />

          <PrivateBookingCancellationDialog
            open={!!this.props.privateBookingToCancel}
            fullScreen
            privateBooking={this.props.privateBookingToCancel}
            onCancel={() => this.props.setPrivateBookingToCancel(null)}
            onSubmit={(options) =>
              this.onDiscardPrivateBooking(
                this.props.privateBookingToCancel.id,
                options,
              )
            }
          />
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    height: '100vh',
  },
  bookingsContainer: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loaderView: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingsContainerInner: {
    display: 'flex',
    flex: 1,
    width: '100%',
    height: '100%',
    paddingBottom: theme.spacing(4),
    'overflow-y': 'scroll',
  },
});

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  auth: state.auth,
  membership: getMembership(state, ownProps.companyId),
  bookingsAndPrivateBookings: getAllBookingAndPrivateBooking(state),
  bookingsAndPrivateBookingsLoading:
    state.consumer.bookingAndPrivateBooking.loading,
  hasMoreBookingsAndPrivateBookings:
    state.consumer.bookingAndPrivateBooking.hasMore,
  companyTheme: themeSelectors.getTheme(state),
  companyThemeLoading: state.theme.loading,
});

const mapDispatchToProps = {
  fetchBookingsAndPrivateBookings,
  fetchCoachBulk,
  fetchEstablishmentBulk,
  fetchMetaActivityBulk,
  fetchOfferBulk,
  fetchMembershipListAsConsumer,
  cancelBooking: cancelBookingAction,
  discardPrivateBooking: disablePrivateBooking,
  fetchCompanyTheme,
};

const mapWithHandlers = {
  fetchBookingsAndPrivateBookings: (props: OwnAndConnectedProps) => (args: {
    member: number;
    page?: number;
    type?: BookingsAndPrivateBookingsTypeEnum;
  }) => {
    const { member, page, type } = args;

    props.fetchBookingsAndPrivateBookings({
      page,
      date_start: moment().format('YYYY-MM-DD'),
      member,
      type,
      options: {
        onSuccess: (bookingsAndPrivateBookings) => {
          const bookings = bookingsAndPrivateBookings
            .filter((bAndP) => bAndP.type === 'booking' && bAndP.booking)
            .map((b) => b.booking);

          props.fetchOfferBulk(
            bookings.map((b) => b.offer),
            {
              // @ts-ignore
              onSuccess: (offerList) => {
                // @ts-ignore
                props.fetchMetaActivityBulk(
                  // @ts-ignore
                  offerList.map((b) => b.meta_activity),
                );
                props.fetchCoachBulk([
                  // @ts-ignore
                  ...offerList.map((b) => b.coach),
                  // @ts-ignore
                  ...offerList.map((b) => b.coach_override),
                ]);
                props.fetchEstablishmentBulk([
                  // @ts-ignore
                  ...offerList.map((b) => b.establishment),
                  // @ts-ignore
                  ...offerList.map((b) => b.establishment_override),
                ]);
              },
            },
          );
        },
      },
    });
  },
};

type StateHandlerInit = {
  bookingToCancel: Booking | null;
  privateBookingToCancel: PrivateBooking | null;
};

const withStateHandlersInit: StateHandlerInit = {
  bookingToCancel: null,
  privateBookingToCancel: null,
};

const withStateHandlersSetter = {
  setBookingToCancel: () => (bookingToCancel: Booking | null) => {
    return { bookingToCancel };
  },
  setPrivateBookingToCancel: () => (
    privateBookingToCancel: PrivateBooking | null,
  ) => {
    return { privateBookingToCancel };
  },
};

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
    companyName: 'companyName',
  }),
  // @ts-ignore
  withStyles(styles),
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
)(BookingsAndPrivateBookingsPage);
