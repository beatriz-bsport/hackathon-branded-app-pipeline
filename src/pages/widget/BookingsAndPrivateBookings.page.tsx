import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { CircularProgress, Tab, Tabs } from '@material-ui/core';
import AppBarMUI from '@material-ui/core/AppBar';
import { Theme, withStyles } from '@material-ui/core/styles';
import { WithTranslation, withTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { DIALOG_MODE_DEACTIVATED } from '@bsport/common/lib/master-data/widget-dialog-mode';

// @ts-expect-error
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { RootState } from '../../reducers';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { getAllBookingAndPrivateBooking } from '../../libs/consumer-space/selectors';
import {
  BookingsAndPrivateBookingsTypeEnum,
  fetchBookingsAndPrivateBookings,
} from '../../libs/consumer-space/actions';
import { fetchMembershipByCompany } from '../../libs/membership/actions';
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
import ConsumerAppBarContainer from '../checkout/ConsumerAppBar.container';
import WidgetUtils from '#libs/widget/WidgetUtils';

const EmptyWrapper: React.FC = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);

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
  tab: typeof SHOW_FUTURE_TAB | typeof SHOW_PAST_TAB;
}

class BookingsAndPrivateBookingsPage extends React.PureComponent<Props, State> {
  state: State = {
    tab: SHOW_FUTURE_TAB,
  };

  componentDidMount() {
    this.props.fetchMembershipByCompany(this.props.companyId);

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

    if (prevState.tab !== this.state.tab && this.props.membership) {
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

  isNoPopUpMode = WidgetUtils.getDialogMode() === DIALOG_MODE_DEACTIVATED;

  render() {
    const { classes, t } = this.props;

    const MainWrapper = this.isNoPopUpMode
      ? ConsumerAppBarContainer
      : EmptyWrapper;

    return (
      <MainWrapper>
        <div className={classes.container}>
          <div className={classes.bookingsContainer}>
            <AppBarMUI color="transparent" position="relative">
              <Tabs
                aria-label="full width tabs example"
                indicatorColor="primary"
                onChange={(e, tab) => this.setState({ tab })}
                textColor="primary"
                value={this.state.tab}
                variant="fullWidth"
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

            {!this.props.bookingsAndPrivateBookings.length &&
            this.props.bookingsAndPrivateBookingsLoading ? (
              <div className={classes.loaderView}>
                <CircularProgress />
              </div>
            ) : (
              <div className={classes.bookingsContainerInner}>
                <ConsumerDashboardBookingPanel
                  fullWidth
                  hideTitle
                  bookingsAndPrivateBookings={
                    this.props.bookingsAndPrivateBookings
                  }
                  hasMore={this.props.hasMoreBookingsAndPrivateBookings}
                  hideCoach={this.props.companyTheme.hideCoach}
                  isPast={this.state.tab === SHOW_PAST_TAB}
                  loading={this.props.bookingsAndPrivateBookingsLoading}
                  membership={this.props.membership}
                  onDiscardBooking={this.props.setBookingToCancel}
                  onDiscardPrivateBooking={this.props.setPrivateBookingToCancel}
                  showMoreBooking={this.onClickShowMoreBookings}
                  timezone={this.props.companyTheme.timezone_name}
                />
              </div>
            )}

            <BookingCancellationDialog
              fullScreen
              // @ts-expect-error
              booking={this.props.bookingToCancel}
              onCancel={() => this.props.setBookingToCancel(null)}
              onSubmit={(options: OptionCallback) =>
                this.onDiscardBooking(this.props.bookingToCancel.id, options)
              }
              open={!!this.props.bookingToCancel}
            />

            <PrivateBookingCancellationDialog
              fullScreen
              onCancel={() => this.props.setPrivateBookingToCancel(null)}
              onSubmit={(options) =>
                this.onDiscardPrivateBooking(
                  this.props.privateBookingToCancel.id,
                  options,
                )
              }
              open={!!this.props.privateBookingToCancel}
              privateBooking={this.props.privateBookingToCancel}
            />
          </div>
        </div>
      </MainWrapper>
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
});

const mapDispatchToProps = {
  fetchBookingsAndPrivateBookings,
  fetchCoachBulk,
  fetchEstablishmentBulk,
  fetchMetaActivityBulk,
  fetchOfferBulk,
  fetchMembershipByCompany,
  cancelBooking: cancelBookingAction,
  discardPrivateBooking: disablePrivateBooking,
};

const mapWithHandlers = {
  fetchBookingsAndPrivateBookings:
    (props: OwnAndConnectedProps) =>
    (args: {
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
          onSuccess: (allObj) => {
            props.fetchOfferBulk(
              // @ts-expect-error
              allObj.booking.results.map((b) => b.offer),
              {
                onSuccess: (offerList) => {
                  props.fetchMetaActivityBulk(
                    offerList.map((b) => b.meta_activity),
                  );
                  props.fetchCoachBulk([
                    ...offerList.map((b) => b.coach),
                    ...offerList.map((b) => b.coach_override),
                  ]);
                  props.fetchEstablishmentBulk([
                    ...offerList.map((b) => b.establishment),
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
  setPrivateBookingToCancel:
    () => (privateBookingToCancel: PrivateBooking | null) => {
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
