// @ts-nocheck
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment-timezone';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { push as pushRouter } from 'connected-react-router';
import TodayIcon from '@material-ui/icons/Today';

import { Theme } from '@material-ui/core/styles';
import flatten from 'lodash/flatten';
import { WidgetUtils } from '#libs/widget/WidgetUtils';
import themeSelectors from '#libs/theme/selectors';
import BookingCancellationDialog from '#libs/booking/components/BookingCancellationDialog.component';
import MemberBillingProblemCard from '#libs/member/components/MemberBillingProblemCard.component';
import BookingOptionCancelDialog from '#libs/waiting-list/components/BookingOptionCancelDialog.component';
import ConsumerDashboardBookingPanel from '#libs/consumer-space/components/ConsumerDashboardBookingPanel.component';
import ConsumerDashboardHeader from '#libs/consumer-space/components/ConsumerDashboardHeader.component';
import ConsumerDashboardPassPanel from '#libs/consumer-space/components/ConsumerDashboardPassPanel.component';
import ConsumerDashboardBookingOptionPanel from '#libs/consumer-space/components/ConsumerDashboardBookingOptionPanel.component';
import { fetchMembership as fetchMembershipAction } from '#libs/membership/actions';
import { fetchMember } from '#libs/member/actions';

import { getFavoriteEstablishment } from '#libs/establishment/selectors';
import { getFavoriteMetaActivity } from '#libs/meta-activity/selectors';
import { retrieveGroupOffer } from '#libs/group-offer/selectors';
import { getMemberTagsIdsList } from '#libs/tag/selectors';

import { buildUrlParams } from '../../http';
import {
  getPrivateConsumerPassList,
  excludeUnPaidPrivateConsumerPass,
} from '#libs/private-service/selectors/private-consumer-pass';

import { getConsumerPacksByMemberWithPaymentPack } from '#libs/consumer-payment-pack/selectors';
import {
  fetchSpotForBlueprint as fetchSpotForBlueprintAction,
  fetchAssetForBlueprint,
  fetchRoomBlueprintDetail,
} from '#libs/spot-scheduling/actions';

import {
  getSpotTypesOfCompany,
  getAssetByBlueprintByIdentifier,
} from '#libs/spot-scheduling/selector';
import {
  cancelBooking as cancelBookingAction,
  fetchSimilarFuturBookingInGroup as fetchSimilarFuturBookingInGroupAction,
} from '#libs/booking/actions';
import { fetchOfferBulk as fetchOfferBulkAction } from '#libs/offer/actions';
import {
  fetchEstablishmentFavorite,
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
} from '#libs/establishment/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '#libs/associated-coach/actions';
import {
  fetchMetaActivityFavorite,
  fetchMetaActivityBulk as fetchMetaActivityBulkAction,
} from '#libs/meta-activity/actions';
import {
  resetGroupOffer as resetGroupOfferAction,
  fetchGroupOffer as fetchGroupOfferAction,
} from '#libs/group-offer/actions';
import { getBookingOptionConsumerList } from '#libs/waiting-list/selectors';
import {
  fetchBookingOptionAsConsumer,
  discardBookingOption as cancelBookingOptionAction,
} from '#libs/waiting-list/actions';
import { withCoach } from '#libs/offer/selectors';
import {
  fetchPrivateConsumerPassList,
  disablePrivateBooking,
} from '#libs/private-service/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#libs/payment-packs/actions';
import { fetchByMember as fetchConsumerPackByMemberAction } from '#libs/consumer-payment-pack/actions';
import { urlToMarketplace } from '#libs/marketplace/utils';
import {
  fetchInvoiceList as fetchInvoiceListAction,
  applyBalanceToInvoice as applyBalanceToInvoiceAction,
} from '#libs/invoice/actions';
import {
  getSimilarBookingList,
  withOfferFull as withOffer,
} from '#libs/booking/selectors';
import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';
import { withCustomLevel } from '#libs/level/selectors';
import { withInvoiceItem, getInvoiceList } from '#libs/invoice/selectors';
import { RootState } from '../../reducers';
import { Membership } from '#libs/membership/types';
import { OptionCallback } from '../../state/types';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import type { Booking } from '#libs/booking/types';
import { Invoice } from '#libs/invoice/types';
import {
  fetchBookingsAndPrivateBookings as fetchBookingsAndPrivateBookingsAction,
  BookingsAndPrivateBookingsTypeEnum,
} from '#libs/consumer-space/actions';
import { getAllBookingAndPrivateBooking } from '#libs/consumer-space/selectors';
import { PrivateBooking } from '#libs/private-service/types';
import PrivateBookingCancellationDialog from '#libs/private-service/components/booking/PrivateBookingCancellationDialog';
import { MetaActivity } from '#libs/meta-activity/types';
import {
  detachPaymentMethod,
  fetchPaymentMethodList,
} from '#libs/payment/actions';
import { snackbarWarning, snackbarSuccess } from '#libs/snackbar/actions';
import { getMarketplaceRoute } from '#libs/marketplace/routing-utils';
import { getMember } from '#libs/member/selectors';
import { Offer } from '#libs/offer/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import CanvasPreviewDialog from '#libs/spot-scheduling/component/SpotPreview/CanvasPreviewDialog.Component';

import withQueryParams from '../../hocs/with-query-params.hoc';
import { fetchConsumerPaymentPackLinks } from '#libs/relationship/actions';
import { withIsSharedActive } from '#libs/relationship/selectors';
import { getUsableCreditAccountBalance } from '#libs/membership/selectors';
import { fetchMemberTagList } from '#libs/tag/actions';

type OwnProps = {
  hideCoach: boolean;
  companyId: number;
  membership?: Membership;
};

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type OwnConnectedStateHandlerProps = OwnProps &
  ConnectedProps &
  StateHandlerType;

type Props = WithHandlerType<typeof mapWithHandlers> &
  OwnConnectedStateHandlerProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export class ConsumerDashboard extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchBookingsAndPrivateBookings(1);

    this.props.fetchPrivateConsumerPassList({
      company: this.props.membership.company,
      mine: true,
    });
    this.props.fetchConsumerPacks(this.props.membership.id, 1, 300);

    this.props.fetchEstablishmentFavorite(this.props.membership.company);
    this.props.fetchMetaActivityFavorite(this.props.membership.company);

    this.props.fetchInvoiceListUnpaid(this.props.membership.id);
    this.props.fetchMember(this.props.membership.id);
    this.props.fetchMembership(this.props.membership.id);
    this.fetchBookingOption();
    this.props.fetchMemberTagList(this.props.membership.company);
  }

  refreshDebtStatus = () => {
    this.props.fetchMembership(this.props.membership.id);
    this.props.fetchInvoiceListUnpaid(this.props.membership.id);
  };

  goToInvoice = (uuid: string, invoice: Invoice) => {
    if (invoice?.stripe_invoice_pdf) {
      window.open(invoice.stripe_invoice_pdf);
    }
  };

  fetchBookingOption = () => {
    this.props.fetchBookingOptionAsConsumer(
      this.props.membership.company,
      {
        min_date: moment().format('YYYY-MM-DD'),
      },
      {
        onSuccess: (options) => {
          if (options?.length > 0) {
            this.props.fetchLevelList({
              company: this.props.companyId,
              id__in: Array.from(
                new Set(options?.results?.map((option) => option.level) ?? []),
              ),
            });
          }
        },
      },
    );
  };

  cancelBookingOption = (options: OptionCallback) => {
    this.props.cancelBookingOption(this.props.optionToCancel, null, {
      onSuccess: () => {
        this.props.setOptionToCancel(null);
        this.fetchBookingOption();
        if (options && options.onSuccess) {
          options.onSuccess();
        }
      },
      onError: options && options.onError,
    });
  };

  onDiscardBooking = (id: number, dialogOptions: OptionCallback) => {
    this.props.cancelBooking(this.props.bookingToCancel.id, null, {
      onSuccess: () => {
        dialogOptions.onSuccess();
        this.props.setBookingToCancel(null);
        this.props.fetchBookingsAndPrivateBookings(1);
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
          this.props.fetchBookingsAndPrivateBookings(1);
        },
      },
    );
  };

  onInvoicePaymentDialogClose = () => {
    if (this.props.queryParams) {
      this.props.setQueryParams('invoiceInPayment')(null);
    }
  };

  handleSetBookingToCancel = (booking: Booking) => {
    if (booking.offer.group) {
      this.props.resetGroupOffer();
      this.props.fetchGroupOffer(booking.offer.group);
      this.props.fetchSimilarFuturBookingInGroup(booking.id, {
        onSuccess: (data) => {
          this.props.fetchOfferBulk(
            Array.from(new Set(data.results?.map((b) => b.offer))),
          );
          this.props.fetchCoachBulk(
            Array.from(new Set(data.results?.map((b) => b.coach))),
          );
        },
      });
    }
    this.props.setBookingToCancel(booking);
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        {!WidgetUtils.isWidget() && (
          <div className={this.props.classes.header}>
            <div>
              <Button
                color="primary"
                onClick={this.props.goToHomeTab}
                variant="contained"
              >
                <TodayIcon className={this.props.classes.iconLeft} />
                {this.props.t('actions.goToHome')}
              </Button>
            </div>
          </div>
        )}
        <ConsumerDashboardHeader
          favoriteEstablishment={this.props.favoriteEstablishment}
          favoriteMetaActivity={this.props.favoriteMetaActivity}
          goToCalendar={this.props.goToCalendar}
        />
        <div style={{ marginBottom: 32 }}>
          {!!this.props.member && !this.props.companyThemeLoading && (
            <MemberBillingProblemCard
              asConsumer
              allowConsumerToUseInternalAccount={
                this.props.companyTheme.allow_consumer_to_use_internal_account
              }
              applyBalanceLoading={this.props.applyBalanceLoading}
              applyBalanceToInvoice={this.props.applyBalanceToInvoice}
              availablePaymentMethodList={
                this.props.payment_method_available_basket
              }
              balance={this.props.membership.credit_account_balance}
              cardBillingDetailsMandatory={
                this.props.companyTheme.force_billing_details_on_cards
              }
              companyId={this.props.companyTheme.company}
              creditAccountBalance={this.props.creditAccountBalance}
              detachPaymentMethod={this.props.detachPaymentMethod}
              detachPaymentMethodLoading={this.props.detachPaymentMethodLoading}
              fetchInvoiceListUnpaid={this.refreshDebtStatus}
              goToInvoice={this.goToInvoice}
              invoiceLoading={this.props.invoiceLoading}
              member={this.props.member}
              memberId={this.props.membership.id}
              onInvoicePaymentDialogClose={this.onInvoicePaymentDialogClose}
              onlinePaymentEnabled={this.props.onlinePaymentEnabled}
              selectedInvoiceId={this.props.queryParams.invoiceInPayment}
              showPositiveBalance={
                this.props.companyTheme?.allow_consumer_to_use_internal_account
              }
              snackbarErrorMsg={this.props.snackbarErrorMsg}
              snackbarSuccessMsg={this.props.snackbarSuccessMsg}
              stripeId={this.props.companyTheme.stripe_id}
              unpaidInvoiceList={this.props.unpaidInvoiceList}
            />
          )}
        </div>
        <Grid container direction="row" spacing={2}>
          <Grid item md={6} xs={12}>
            <ConsumerDashboardBookingPanel
              bookingsAndPrivateBookings={this.props.bookingsAndPrivateBookings}
              goToBroadcast={this.props.goToBroadcast}
              goToCalendar={this.props.goToCalendar}
              goToPrivateService={this.props.goToPrivateService}
              hasMore={this.props.hasMoreBookingsAndPrivateBookings}
              hideCoach={this.props.companyTheme.hideCoach}
              loading={this.props.bookingsAndPrivateBookingsLoading}
              membership={this.props.membership}
              onClickBlueprintPreview={this.props.previewSpotHandler}
              onDiscardBooking={this.handleSetBookingToCancel}
              onDiscardPrivateBooking={this.props.setPrivateBookingToCancel}
              showMoreBooking={this.props.fetchBookingsAndPrivateBookings}
              timezone={this.props.companyTheme.timezone_name}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <ConsumerDashboardBookingOptionPanel
              bookingOptionList={this.props.bookingOptionList}
              cancelBookingOption={this.props.setOptionToCancel}
              confirmBookingOption={this.props.confirmBookingOption}
            />
            <ConsumerDashboardPassPanel
              consumerPackList={this.props.consumerPackList}
              consumerPackLoading={this.props.consumerPackLoading}
              privateConsumerPassList={this.props.privateConsumerPassList}
              privateConsumerPassLoading={this.props.privateConsumerPassLoading}
            />
          </Grid>
        </Grid>
        <BookingOptionCancelDialog
          onCancel={() => this.props.setOptionToCancel(null)}
          onSubmit={this.cancelBookingOption}
          open={this.props.optionToCancel}
        />
        <BookingCancellationDialog
          booking={this.props.bookingToCancel}
          group={this.props.group}
          memberTags={this.props.memberTags}
          onCancel={() => this.props.setBookingToCancel(null)}
          onSubmit={(options: OptionCallback) =>
            this.onDiscardBooking(this.props.bookingToCancel.id, options)
          }
          open={this.props.bookingToCancel}
          similarBookings={this.props.similarBookings}
          similarBookingsLoading={this.props.similarBookingsLoading}
        />

        <PrivateBookingCancellationDialog
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

        {this.props.spotPreview && (
          <CanvasPreviewDialog
            open
            assets={
              this.props.assetForBlueprint[this.props.spotPreview.blueprint]
            }
            fetchSpotForBlueprint={this.props.fetchSpotForBlueprint}
            onClose={() => this.props.setSpotPreview(null)}
            roomBlueprint={
              this.props.roomBlueprintById[this.props.spotPreview.blueprint]
            }
            selectedSpot={this.props.spotPreview.spot}
            spotTypes={this.props.spotTypes}
          />
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {},
  header: {
    display: 'flex',
    padding: theme.spacing(1),
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  statRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
});

const mapStateToProps = (state: RootState, props) => ({
  bookingsAndPrivateBookings: getAllBookingAndPrivateBooking(state),
  bookingsAndPrivateBookingsLoading:
    state.consumer.bookingAndPrivateBooking.loading,
  hasMoreBookingsAndPrivateBookings:
    state.consumer.bookingAndPrivateBooking.hasMore,

  bookingOptionList: withCustomLevel(getBookingOptionConsumerList)(state),

  privateConsumerPassList: excludeUnPaidPrivateConsumerPass(
    getPrivateConsumerPassList,
  )(state),
  privateConsumerPassLoading: state.privateService.privateConsumerPass.loading,
  consumerPackLoading: state.consumerPaymentPack.byMember.loading,
  companyThemeLoading: state.theme.loading,
  companyTheme: themeSelectors.getTheme(state),
  consumerPackList: withIsSharedActive(getConsumerPacksByMemberWithPaymentPack)(
    state,
  ),
  favoriteMetaActivity: getFavoriteMetaActivity(state),
  favoriteEstablishment: getFavoriteEstablishment(state),
  unpaidInvoiceList: withInvoiceItem(getInvoiceList)(state),
  invoiceLoading: state.invoice.list.loading,
  onlinePaymentEnabled: state.theme.theme.online_payment_enabled,
  payment_method_available_basket:
    state.theme.theme.payment_method_available_basket,
  metaActivitiesById: state.metaActivity.byId,
  detachPaymentMethodLoading: state.paymentBackend.detachPaymentMethod.loading,
  marketplaceSettings: state.marketplace.settings,
  member: getMember(state, props.membership.id),
  roomBlueprintById: state.spotScheduling.roomBlueprint.byId,
  assetForBlueprint: getAssetByBlueprintByIdentifier(state),
  creditAccountBalance: getUsableCreditAccountBalance(
    state,
    props.membership?.company,
  ),
  applyBalanceLoading: state.invoice.applyBalance.loading,
  similarBookings: withCustomLevel(withCoach(withOffer(getSimilarBookingList)))(
    state,
  ),
  similarBookingsLoading: state.booking.similar.loading,
  memberTags: getMemberTagsIdsList(state),
  group: retrieveGroupOffer(state),
  spotTypes: getSpotTypesOfCompany(state),
});

const mapDispatchToProps = {
  fetchInvoiceList: fetchInvoiceListAction,
  push: pushRouter,
  cancelBooking: cancelBookingAction,
  discardPrivateBooking: disablePrivateBooking,
  fetchOfferBulk: fetchOfferBulkAction,
  fetchMetaActivityBulk: fetchMetaActivityBulkAction,
  fetchCoachBulk: fetchCoachBulkAction,
  fetchEstablishmentBulk: fetchEstablishmentBulkAction,
  fetchPaymentPackBulk: fetchPaymentPackBulkAction,
  fetchConsumerPacks: (
    memberId: number,
    page: number,
    page_size: number,
    options: OptionCallback,
    params: any,
  ) =>
    fetchConsumerPackByMemberAction({
      member: memberId,
      page,
      page_size,
      options,
      params,
    }),
  fetchBookingOptionAsConsumer,
  fetchLevelList: fetchLevelListAction,
  fetchPrivateConsumerPassList,
  fetchMetaActivityFavorite,
  fetchEstablishmentFavorite,
  fetchMembership: fetchMembershipAction,
  cancelBookingOption: cancelBookingOptionAction,
  fetchBookingsAndPrivateBookings: fetchBookingsAndPrivateBookingsAction,
  fetchMember,
  detachPaymentMethodAction: detachPaymentMethod,
  fetchMemberPaymentMethod: fetchPaymentMethodList,
  snackbarErrorMsg: snackbarWarning,
  snackbarSuccessMsg: snackbarSuccess,
  fetchRoomBlueprintDetail,
  fetchAssetForBlueprint,
  fetchConsumerPaymentPackLinks,
  applyBalanceToInvoiceAction,
  fetchInvoiceListUnpaid: (id: number) =>
    fetchInvoiceListAction({
      is_draft: false,
      is_v2: true,
      unpaid: true,
      member: id,
    }),
  fetchSimilarFuturBookingInGroup: fetchSimilarFuturBookingInGroupAction,
  resetGroupOffer: resetGroupOfferAction,
  fetchGroupOffer: fetchGroupOfferAction,
  fetchMemberTagList,
  fetchSpotForBlueprint: fetchSpotForBlueprintAction,
};

type StateHandlerInit = {
  bookingToCancel: Booking | null;
  privateBookingToCancel: PrivateBooking | null;
  optionToCancel: number | null;
  spotPreview: { blueprint: number; spot: number } | null;
};

const withStateHandlersInit: StateHandlerInit = {
  bookingToCancel: null,
  privateBookingToCancel: null,
  optionToCancel: null,
  spotPreview: null,
};

const withStateHandlersSetter = {
  setBookingToCancel: () => (bookingToCancel: Booking | null) => {
    return { bookingToCancel };
  },
  setPrivateBookingToCancel:
    () => (privateBookingToCancel: PrivateBooking | null) => {
      return { privateBookingToCancel };
    },
  setOptionToCancel: () => (optionToCancel: number | null) => {
    return { optionToCancel };
  },
  setSpotPreview:
    () => (spotPreview: { blueprint: number; spot: number } | null) => {
      return { spotPreview };
    },
};

const mapWithHandlers = {
  confirmBookingOption:
    (props: OwnConnectedStateHandlerProps) =>
    (offerId: number, optionId: number) => {
      props.push(`/payment/offer/${offerId}?option_id=${optionId}`);
    },
  goToBroadcast:
    (props: OwnConnectedStateHandlerProps) => (bookingId: number) => {
      props.push(`/c/${props.membership.company}/broadcast/${bookingId}/`);
    },
  goToCalendar:
    (props: OwnConnectedStateHandlerProps) =>
    (params: any, metaActivityId: number) => {
      const metaActivity: MetaActivity =
        props.metaActivitiesById[metaActivityId];
      const componentType =
        metaActivity && metaActivity.is_workshop ? 'workshop' : 'calendar';

      props.push(
        `${urlToMarketplace(
          props.membership.company_name,
          props.membership.company.toString(),
        )}/${componentType}/${buildUrlParams({
          ...params,
          filtersOpen: true,
        })}`,
      );
    },
  goToPrivateService: (props: OwnConnectedStateHandlerProps) => () => {
    props.push(
      `${urlToMarketplace(
        props.membership.company_name,
        props.membership.company.toString(),
      )}/private-service/`,
    );
  },
  fetchBookingsAndPrivateBookings:
    (props: OwnConnectedStateHandlerProps) => (page?: number) => {
      props.fetchBookingsAndPrivateBookings({
        page,
        date_start: moment().format('YYYY-MM-DD'),
        member: props.membership.id,
        options: {
          onSuccess: (allObj) => {
            props.fetchOfferBulk(
              allObj.booking.results.map((b) => b.offer),
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
              false,
              true, // ignoreManagerOnly
            );
          },
        },
        type: BookingsAndPrivateBookingsTypeEnum.beforeDateEnd,
      });
    },
  fetchConsumerPacks:
    (props: OwnConnectedStateHandlerProps) =>
    (memberId: number, page: number, page_size: number) =>
      props.fetchConsumerPacks(
        memberId,
        page,
        page_size,
        {
          onSuccess: (cpps: any) => {
            props.fetchPaymentPackBulk(cpps.map((c: any) => c.payment_pack));
            props.fetchConsumerPaymentPackLinks(
              flatten(
                cpps.map((cpp) =>
                  cpp.src_consumer_payment_pack.map((id: number) => id),
                ),
              ),
            );
          },
        },
        { mine: true, reverted: false, current: true, disabled: false },
      ),
  detachPaymentMethod:
    (props: OwnConnectedStateHandlerProps) => (pm_id: string, options: any) => {
      const {
        detachPaymentMethodAction,
        fetchMemberPaymentMethod,
        membership,
      } = props;

      detachPaymentMethodAction(
        { member: membership.id, payment_method_id: pm_id },
        {
          onSuccess: () => {
            fetchMemberPaymentMethod({ member: membership.id });
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: options && options.onError,
        },
      );
    },
  goToHomeTab: (props: Props) => () => {
    props.push(
      getMarketplaceRoute(props.companyTheme.company_name, props.companyId, ''),
    );
  },
  previewSpotHandler:
    (props: OwnConnectedStateHandlerProps) =>
    (booking: Booking<Offer<Coach, Establishment, MetaActivity>>) => {
      props.fetchRoomBlueprintDetail(booking.offer.room_blueprint);
      props.fetchAssetForBlueprint({ blueprint: booking.offer.room_blueprint });
      props.setSpotPreview({
        blueprint: booking.offer.room_blueprint,
        spot: booking.spot_id,
      });
    },
  applyBalanceToInvoice:
    (props: OwnConnectedStateHandlerProps) =>
    (uuid: string, options?: OptionCallback) => {
      props.applyBalanceToInvoiceAction(uuid, {
        onSuccess: () => {
          props.fetchMembership(props.membership.id);
          props.fetchInvoiceListUnpaid(props.membership.id);
          if (options && options.onSuccess) options.onSuccess();
        },
        onError: () => {
          props.fetchMembership(props.membership.id);
          props.fetchInvoiceListUnpaid(props.membership.id);
          if (options && options.onError) options.onError();
        },
      });
    },
};
export default compose(
  withTranslation(['consumerSpace']),
  // @ts-ignore
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withQueryParams([['invoiceInPayment'], 'queryParams', 'setQueryParams']),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers(mapWithHandlers),
)(ConsumerDashboard);
