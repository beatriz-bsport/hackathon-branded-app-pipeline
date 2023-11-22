// @ts-nocheck
import React from 'react';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { connect } from 'react-redux';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { Box, Theme, withStyles } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { WithTranslation, withTranslation } from 'react-i18next';
import flatten from 'lodash/flatten';

import { OFFER_WAITING_LIST_STATUS_CONVERTIBLE } from '@bsport/common/lib/master-data/waiting-list-status';
import {
  OFFER_BOOKABLE_STATUS_BOOKABLE,
  OFFER_BOOKABLE_STATUS_FULL,
} from '@bsport/common/lib/master-data/bookable-status';
import {
  getAvailablePaymentPacks,
  getAvailableConsumerPack,
  getAvailableComboPacks,
  getAvailableContracts,
} from '@bsport/common/lib/master-data/available-payment';

import { replace as replaceAction } from 'connected-react-router';
import memoize from 'memoize-one';
import { OptionCallback } from '../../../../state/types';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../../../libs/payment/api';
import { Offer_FULL, OfferStatus } from '../../../../libs/offer/types';
import { MaterialStyleType, WithHandlerType } from '../../../../utils/types';
import { RootState } from '../../../../reducers';
import {
  getConsumerPaymentPackForBooking,
  withPaymentPack as withPaymentPackForConsumer,
} from '../../../../libs/consumer-payment-pack/selectors';
import { ConsumerPaymentPack } from '../../../../libs/consumer-payment-pack/types';
import { PaymentPack } from '../../../../libs/payment-packs/types';
import { PaymentCombo } from '../../../../libs/payment-combo/types';
import {
  getPaymentComboForBooking,
  withPaymentPack as withPaymentPackForCombo,
} from '../../../../libs/payment-combo/selectors';
import {
  excludeUnaccessiblePacks,
  getPaymentPackForBooking,
  getAllPaymentPackCategory,
} from '../../../../libs/payment-packs/selectors';
import {
  fetchPaymentPackForBooking,
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
  fetchAllPaymentPackCategory,
  resetPaymentPackForBooking,
} from '../../../../libs/payment-packs/actions';
import {
  fetchPaymentComboForBooking,
  fetchPaymentComboFromContract as fetchPaymentComboFromContractAction,
} from '../../../../libs/payment-combo/actions';
import {
  fetchConsumerPaymentPackForBooking,
  fetchConsumerPaymentPackMaxoutBooking,
} from '../../../../libs/consumer-payment-pack/actions';
import BookingMethodSelector from '../../../../libs/booker-module/components/BookingMethodSelector.component';

import SubscriptionContractBooking from '../SubscriptionPaymentDialog.component';

import {
  fetchContractForBooking as fetchContractForBookingAction,
  resetContractForBooking as resetContractForBookingAction,
} from '../../../../libs/subscription/actions';
import {
  getContractForBooking,
  withPaymentPack as withPaymentPackForContract,
} from '../../../../libs/subscription/selectors';
import {
  OfferData,
  OfferConstraint,
  SelectedPack,
} from '../../../../libs/booker-module/types';
import { fetchMemberTagList } from '../../../../libs/tag/actions';
import { getMemberTagsIdsList } from '../../../../libs/tag/selectors';
import type { Tag } from '../../../../libs/tag/types';
import { CompanyTheme } from '#libs/theme/types';
import { getTheme } from '#libs/theme/selectors';
import { getSubscriptionValidationUrl } from '#libs/marketplace/routing-utils';
import { EstablishmentBillingGroup } from '#libs/establishment/types';
import { loadDefaultEstablishmentBillingGroupFromOffers } from '#libs/marketplace/utils/booking';

type OwnProps = {
  offerId: number;
  offer?: Offer_FULL;
  offerStatus?: OfferStatus;
  company?: number;
  selectedOffers: OfferData[];
  offersConstraint?: OfferConstraint;
  loading: boolean;
  selectedPack: SelectedPack;
  onPackChange: (selectedPack: SelectedPack) => void;
  paymentPackForBookingNextPage?: number;
  isExcludingTax: boolean;
  theme?: CompanyTheme;
  setGuestMaxNumber: (maxNumber: number) => void;
  establishmentBillingGroups?: EstablishmentBillingGroup[];
};

type OwnAndConnectedProps = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = OwnProps &
  OwnAndConnectedProps &
  WithHandlerType<typeof mapHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  consumerPacksLoaded: boolean;
  consumerPacksMaxoutLoaded: boolean;
  paymentPacksLoaded: boolean;
  paymentComboPacksLoaded: boolean;
  defaultBillingGroupFromOffer: EstablishmentBillingGroup;
};

export class BookingMethodSelectorContainer extends React.PureComponent<
  Props,
  State
> {
  state: State = {
    consumerPacksLoaded: false,
    paymentComboPacksLoaded: false,
    paymentPacksLoaded: false,
    consumerPacksMaxoutLoaded: false,
    defaultBillingGroupFromOffer: null,
  };

  componentDidMount() {
    this.props.resetPaymentPackForBooking();
    this.fetchConsumerPaymentPack();
    this.fetchPaymentPack(1);
    this.fetchComboPack();
    this.props.fetchContractForBookingHandler(
      this.props.offerId,
      this.props.company,
    );
    this.props.fetchMemberTagList(this.props.company);
    this.props.fetchAllPaymentPackCategory(this.props.company);
  }

  fetchConsumerPaymentPack = () => {
    this.props.fetchConsumerPaymentPackForBooking(this.props.offerId, {
      onSuccess: (cppList) => {
        const cpp_ids = cppList.map((cpp) => cpp.id);
        const pp_ids = cppList.map((cpp) => cpp.payment_pack);
        cppList.length === 0 &&
          this.setState({
            consumerPacksLoaded: true,
            consumerPacksMaxoutLoaded: true,
          });

        this.props.fetchPaymentPackBulk(pp_ids, {
          onSuccess: () => {
            this.setState({ consumerPacksLoaded: true });
          },
        });
        this.props.fetchConsumerPaymentPackMaxoutBooking(cpp_ids, {
          onSuccess: () => this.setState({ consumerPacksMaxoutLoaded: true }),
        });
      },
    });
  };

  fetchPaymentPack = (page: number) => {
    this.props.fetchPaymentPackForBooking(
      this.props.offerId,
      this.props.company,
      page,
      15,
      { onSuccess: () => this.setState({ paymentPacksLoaded: true }) },
    );
  };

  fetchComboPack = () => {
    if (this.props.company !== undefined) {
      this.props.fetchPaymentComboForBooking(
        this.props.company,
        this.props.offerId,
        {
          onSuccess: (comboList: PaymentCombo[]) => {
            const ids = flatten(
              comboList.map((pc) => pc.payment_packs.map((pp) => pp.id)),
            );
            comboList.length === 0 &&
              this.setState({ paymentComboPacksLoaded: true });
            this.props.fetchPaymentPackBulk(ids, {
              onSuccess: () => this.setState({ paymentComboPacksLoaded: true }),
            });
          },
        },
      );
    }
  };

  getAvailablePaymentPackCategories(packs: Array<PaymentPack>) {
    return this.props.paymentPackCategories
      .map((cat) => ({
        ...cat,
        packs: packs.filter((p) => p.category === cat.id),
      }))
      .filter((cat) => cat.packs.length);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.company !== this.props.company) {
      this.fetchPaymentPack(1);
      this.fetchComboPack();
      this.props.fetchContractForBookingHandler(
        this.props.offerId,
        this.props.company,
      );
      this.props.fetchAllPaymentPackCategory(this.props.company);
    }
    if (
      this.props.paymentPackForBookingNextPage &&
      this.props.paymentPackForBookingNextPage !==
        prevProps.paymentPackForBookingNextPage &&
      this.props.paymentPackForBookingNextPage < 6
    )
      this.fetchPaymentPack(this.props.paymentPackForBookingNextPage);
    if (
      prevProps.establishmentBillingGroups !==
        this.props.establishmentBillingGroups ||
      prevProps.offer !== this.props.offer
    ) {
      this.setState({
        defaultBillingGroupFromOffer:
          loadDefaultEstablishmentBillingGroupFromOffers(
            this.props.theme.enable_multi_localization,
            this.props.establishmentBillingGroups,
            [this.props.offer],
          ),
      });
    }
  }

  requestSetupIntentSecret = () => {
    return this.props.requestSetupIntentSecret(this.props.offer.company);
  };

  renderLoadingBlock = () => {
    const { classes } = this.props;
    return (
      <div className={classes.skeletonContainer}>
        <Skeleton animation="wave" height={30} variant="text" width="40%" />
        <Box mt={2} />
        <Skeleton animation="wave" height={50} variant="rect" width="100%" />
        <Box mt={2} />
        <Skeleton animation="wave" height={50} variant="rect" width="100%" />
        <Box mt={2} />
        <Skeleton animation="wave" height={50} variant="rect" width="100%" />
      </div>
    );
  };

  goToValidationPage = (contractId: number, success: boolean) => {
    if (success) {
      this.props.replace(
        getSubscriptionValidationUrl(this.props.company, contractId, {
          success: 'true',
          next: encodeURIComponent(
            `${window.location.pathname}${window.location.search}`,
          ),
        }),
      );
    } else {
      this.props.replace(
        getSubscriptionValidationUrl(this.props.company, contractId, {
          success: 'false',
          next: encodeURIComponent(
            `${window.location.pathname}${window.location.search}`,
          ),
        }),
      );
    }
  };

  getGuestMaxNumberFromAllPacks = memoize(
    (
      availableConsumerPacks: any,
      availablePaymentPacks: any,
      availableComboPacks: any,
    ) => {
      let maxNumber = 0;
      availableConsumerPacks.forEach((cp: any) => {
        if (cp.payment_pack.allow_guest_pass) {
          if (cp.payment_pack.unlimited) {
            maxNumber = this.props.theme.allow_guest_max_number;
          }
          if (cp.available_credits > maxNumber)
            maxNumber = cp.available_credits;
        }
      });
      availablePaymentPacks.forEach((pp: any) => {
        if (pp.allow_guest_pass) {
          if (pp.unlimited) {
            maxNumber = this.props.theme.allow_guest_max_number;
          }
          if (pp.credits > maxNumber) maxNumber = pp.credits;
        }
      });
      availableComboPacks.forEach((combo: any) => {
        combo.payment_packs.forEach((cpp: any) => {
          if (cpp.allow_guest_pass) {
            if (cpp.unlimited) {
              maxNumber = this.props.theme.allow_guest_max_number;
            }
            if (cpp.credits > maxNumber) maxNumber = cpp.credits;
          }
        });
      });
      return maxNumber;
    },
  );

  render() {
    const { offerStatus, loading } = this.props;
    if (
      loading ||
      !this.state.consumerPacksLoaded ||
      !this.state.paymentPacksLoaded ||
      !this.state.consumerPacksMaxoutLoaded ||
      !this.state.paymentComboPacksLoaded
    ) {
      return this.renderLoadingBlock();
    }
    let bookableCount =
      offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE ||
      (offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_FULL &&
        offerStatus.waiting_list_status ===
          OFFER_WAITING_LIST_STATUS_CONVERTIBLE)
        ? 1
        : 0;

    this.props.selectedOffers.forEach((offerData) => {
      if (
        this.props.offerStatusById[offerData.offer.id] &&
        this.props.offerStatusById[offerData.offer.id].bookable_status ===
          OFFER_BOOKABLE_STATUS_BOOKABLE
      ) {
        bookableCount += 1;
      }
    });

    if (bookableCount === 0) {
      return null;
    }

    const availableConsumerPacks = this.props.getAvailableConsumerPack();
    const availablePaymentPacks = this.props.getAvailablePaymentPacks();
    const availablePaymentPackCategories =
      this.getAvailablePaymentPackCategories(availablePaymentPacks);
    const availableComboPacks = this.props.getAvailableComboPacks();
    const availableContracts = this.props.getAvailableContracts();
    const maxNumber = this.getGuestMaxNumberFromAllPacks(
      availableConsumerPacks,
      availablePaymentPacks,
      availableComboPacks,
    );
    this.props.setGuestMaxNumber(maxNumber);

    return (
      <React.Fragment>
        <BookingMethodSelector
          availableComboPacks={availableComboPacks}
          availableConsumerPacks={availableConsumerPacks}
          contractList={availableContracts}
          isExcludingTax={this.props.isExcludingTax}
          offersConstraint={this.props.offersConstraint}
          onOpenSubscriptionModal={this.props.setOpenSubscriptionModal}
          onPackChange={this.props.onPackChange}
          paymentPackCategories={availablePaymentPackCategories}
          selectedOffers={this.props.selectedOffers}
          selectedPack={this.props.selectedPack}
          theme={this.props.theme}
          unCategorizedPacks={availablePaymentPacks.filter(
            (pack) => !pack.category,
          )}
        />

        <SubscriptionContractBooking
          companyId={this.props.offer && this.props.offer.company}
          contract={this.props.openSubscriptionModal}
          defaultBillingGroupFromOffer={this.state.defaultBillingGroupFromOffer}
          establishmentBillingGroups={this.props.establishmentBillingGroups}
          isExcludingTax={this.props.isExcludingTax}
          onCancel={this.props.closeSubscripionModal}
          onSubmit={this.goToValidationPage}
          requestSetupIntentSecret={this.requestSetupIntentSecret}
        />
      </React.Fragment>
    );
  }
}

const styles = (theme: Theme) => ({
  skeletonContainer: {
    marginTop: theme.spacing(4),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(0),
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
});

const mapHandlers = {
  requestSetupIntentSecret: () => (companyId: number) =>
    requestSetupIntentSecretAPI(null, companyId),
  getAvailableConsumerPack: (props: OwnAndConnectedProps) => () => {
    const selectedOffers = props.selectedOffers.map((data) => data.offer);

    return getAvailableConsumerPack(
      props.offersConstraint,
      props.consumerPaymentPackList,
      props.cppMaxoutBookings,
      // For group using full_booking_only, maxout are computed only considering the first offer
      // and not all group's offers
      props.offer?.group?.full_booking_only
        ? uniqBy(selectedOffers, 'group')
        : selectedOffers,
      props.offer,
      props.offer.timezone_name,
    );
  },
  getAvailablePaymentPacks: (props: OwnAndConnectedProps) => () => {
    const selectedOffers = props.selectedOffers.map((data) => data.offer);
    return getAvailablePaymentPacks(
      props.offersConstraint,
      props.paymentPackList,
      // For group using full_booking_only, maxout are computed only considering the first offer
      // and not all group's offers
      props.offer?.group?.full_booking_only
        ? uniqBy(selectedOffers, 'group')
        : selectedOffers,
      props.offer,
      props.offer.timezone_name,
    );
  },
  getAvailableComboPacks: (props: OwnAndConnectedProps) => () => {
    const selectedOffers = props.selectedOffers.map((data) => data.offer);
    return getAvailableComboPacks(
      props.offersConstraint,
      props.paymentComboList,
      // For group using full_booking_only, maxout are computed only considering the first offer
      // and not all group's offers
      props.offer?.group?.full_booking_only
        ? uniqBy(selectedOffers, 'group')
        : selectedOffers,
      props.offer,
      props.offer.timezone_name,
    );
  },
  getAvailableContracts: (props: OwnAndConnectedProps) => () => {
    const selectedOffers = props.selectedOffers.map((data) => data.offer);
    return getAvailableContracts(
      props.offersConstraint,
      props.contractList,
      // For group using full_booking_only, maxout are computed only considering the first offer
      // and not all group's offers
      props.offer?.group?.full_booking_only
        ? uniqBy(selectedOffers, 'group')
        : selectedOffers,
      props.offer,
      props.offer.timezone_name,
    );
  },
  fetchContractForBookingHandler:
    ({
      fetchContractForBooking,
      fetchPaymentPackBulk,
      fetchPaymentComboFromContract,
    }: OwnAndConnectedProps) =>
    (offer, company) => {
      fetchContractForBooking(offer, company, {
        onSuccess: (contractList) => {
          fetchPaymentPackBulk(contractList.map((c) => c.payment_pack));
          const uniqPaymentComboIds = uniq(
            contractList.map((c) => c.payment_combo),
          ).filter((id) => !!id);
          if (uniqPaymentComboIds.length) {
            fetchPaymentComboFromContract(
              {
                company,
                id__in: uniqPaymentComboIds,
              },
              {
                onSuccess: (paymentComboList: PaymentCombo[]) => {
                  const paymentPackIds = paymentComboList.reduce(
                    (allIds: number[], combo: PaymentCombo) => [
                      ...allIds,
                      ...combo.payment_packs.map((pp) => pp.id),
                    ],
                    [],
                  );
                  paymentPackIds.filter((id) => !!id);
                  if (paymentPackIds.length) {
                    fetchPaymentPackBulk(paymentPackIds);
                  }
                },
              },
            );
          }
        },
      });
    },
};

const mapMemberInfoStateToProps = (
  // Have to do this separation here for widget purpose

  state: RootState,
  {
    memberTagList,
    authenticated,
  }: { memberTagList: Array<Tag>; authenticated: boolean },
) => ({
  memberTagList: memberTagList || getMemberTagsIdsList(state),
  authenticated: authenticated || state.auth.authenticated,
});
const mapStateToProps = (
  state: RootState,
  {
    memberTagList,
    authenticated,
  }: { memberTagList: Array<Tag>; authenticated: boolean },
) => ({
  consumerPaymentPackList: withPaymentPackForConsumer(
    getConsumerPaymentPackForBooking,
  )(state) as ConsumerPaymentPack<PaymentPack>[],
  paymentPackList: excludeUnaccessiblePacks(getPaymentPackForBooking)(state, {
    memberTagList,
    authenticated,
  }) as PaymentPack[],
  paymentComboList: withPaymentPackForCombo(getPaymentComboForBooking)(
    state,
  ) as PaymentCombo[],
  offerStatusById: state.offer.offerStatus.byId,
  contractList: withPaymentPackForContract(getContractForBooking)(state),
  cppMaxoutBookings: state.consumerPaymentPack.maxout_booking.byId,
  paymentPacksById: state.paymentPack.byId,
  paymentPackCategories: getAllPaymentPackCategory(state),
  paymentPackForBookingNextPage: state.paymentPack.forBooking.page,
  theme: getTheme(state),
});

const mapDispatchToProps = {
  replace: replaceAction,
  fetchConsumerPaymentPackForBooking,
  fetchPaymentPackBulk: fetchPaymentPackBulkAction,
  fetchPaymentComboFromContract: fetchPaymentComboFromContractAction,
  fetchPaymentPackForBooking,
  fetchPaymentComboForBooking,
  fetchContractForBooking: fetchContractForBookingAction as (
    offer: number,
    company: number,
    options: OptionCallback,
  ) => void,
  resetContractForBooking: resetContractForBookingAction,
  fetchConsumerPaymentPackMaxoutBooking,
  fetchMemberTagList,
  fetchAllPaymentPackCategory,
  resetPaymentPackForBooking,
};

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['paymentPack', 'booking']),
  connect(mapMemberInfoStateToProps),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapHandlers),
  withStateHandlers(
    { openSubscriptionModal: null },
    {
      setOpenSubscriptionModal: () => (openSubscriptionModal) => {
        return {
          openSubscriptionModal,
        };
      },
      closeSubscripionModal: () => () => ({
        openSubscriptionModal: null,
      }),
    },
  ),
)(BookingMethodSelectorContainer);
