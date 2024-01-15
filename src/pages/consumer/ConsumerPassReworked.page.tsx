import React from 'react';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import uniq from 'lodash/uniq';

import type { RootState } from 'src/reducers';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

/** COMPONENTS */

import ConsumerPassReworkedComponent from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassPageReworked';

/** UTILS */

import {
  urlToMarketplacePassTab,
  urlToMarketplaceSessionTab,
} from '#libs/marketplace/utils/navigation';
import WidgetUtils from '#libs/widget/WidgetUtils';

/** SELECTORS */

import {
  getConsumerPassesLoading,
  getMyActiveConsumerPaymentPacksList,
  getMyActiveConsumerPaymentPacksState,
  getMyActivePrivateConsumerPassesList,
  getMyActivePrivateConsumerPassesState,
  getMyExpiredConsumerPaymentPacksList,
  getMyExpiredConsumerPaymentPacksState,
  getMyExpiredPrivateConsumerPassesList,
  getMyExpiredPrivateConsumerPassesState,
  getMyFutureConsumerPaymentPacksList,
  getMyFutureConsumerPaymentPacksState,
  getMyFuturePrivateConsumerPassesList,
  getMyFuturePrivateConsumerPassesState,
} from '#libs/consumer-space/selectors';
import { getTheme } from '#libs/theme/selectors';
import { getMembership } from '#libs/membership/selectors';

/** ACTIONS */

import {
  fetchMyActiveConsumerPaymentPacksAsMember as fetchMyActiveConsumerPaymentPacksAsMemberAction,
  fetchMyActivePrivateConsumerPassesAsMember as fetchMyActivePrivateConsumerPassesAsMemberAction,
  fetchMyExpiredConsumerPaymentPacksAsMember as fetchMyExpiredConsumerPaymentPacksAsMemberAction,
  fetchMyExpiredPrivateConsumerPassesAsMember as fetchMyExpiredPrivateConsumerPassesAsMemberAction,
  fetchMyFutureConsumerPaymentPacksAsMember as fetchMyFutureConsumerPaymentPacksAsMemberAction,
  fetchMyFuturePrivateConsumerPassesAsMember as fetchMyFuturePrivateConsumerPassesAsMemberAction,
} from '#libs/consumer-space/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#libs/payment-packs/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '#libs/establishment/actions';
import { fetchSCT as fetchSCTAction } from '#libs/category/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#libs/meta-activity/actions';
import {
  fetchPrivatePassBulk as fetchPrivatePassBulkAction,
  fetchPrivateServiceBulk as fetchPrivateServiceBulkAction,
  fetchPrivateServiceCompatiblePassList as fetchPrivateServiceCompatiblePassListAction,
} from '#libs/private-service/actions';
import {
  fetchRelatedMembersNamesByConsumerPaymentPackLinks as fetchRelatedMembersNamesByConsumerPaymentPackLinksAction,
  fetchRelatedMembersNamesByPrivateConsumerPassLinks as fetchRelatedMembersNamesByPrivateConsumerPassLinksAction,
} from '#libs/relationship/actions';

/** TYPES */

import type { ConsumerPaymentPackREST } from '#libs/consumer-payment-pack/types';
import type { PrivateConsumerPassREST } from '#libs/private-service/types';

export class ConsumerPassReworked extends React.Component<
  ConnectedProps<typeof connector>
> {
  componentDidMount() {
    // Only fetch current tab data -> default is Consumer payment packs
    this.fetchActiveConsumerPaymentPacks();
    this.fetchExpiredConsumerPaymentPacks();
    this.fetchFutureConsumerPaymentPacks();
  }

  /**
   * Function that fetches associated consumer payment pack objects.
   *
   * @function
   * @param {ConsumerPaymentPackREST[]} passes - The consumer payment packs to fetch associated objects for.
   *
   * This function first fetches the payment packs associated with the provided consumer payment packs.
   * Then, it fetches the establishments, SCTs, and meta activities associated with these payment packs.
   * Finally, it fetches the related members' names the pass is eventually shared with.
   */
  fetchAssociatedConsumerPaymentPackObjects = (
    passes: ConsumerPaymentPackREST[],
  ) => {
    const paymentPackIdList = uniq(passes.map((pass) => pass.payment_pack));

    this.props.fetchPaymentPackBulk(paymentPackIdList, {
      onSuccess: (paymentPacks) => {
        const establishmentIds = uniq(
          paymentPacks?.reduce(
            (acc, paymentPack) => [...acc, ...paymentPack.establishments],
            [],
          ),
        );

        const metaActivitiesIds = uniq(
          paymentPacks?.reduce(
            (acc, paymentPack) => [...acc, ...paymentPack.metaActivities],
            [],
          ),
        );

        this.props.fetchEstablishmentBulk(establishmentIds);
        this.props.fetchSCTs();
        this.props.fetchMetaActivityBulk(metaActivitiesIds);
      },
    });

    const src_consumer_payment_packs = passes.reduce(
      (acc, pass) => [...acc, ...pass.src_consumer_payment_pack],
      [],
    );

    const dst_consumer_payment_packs = passes.map(
      (pass) => pass.dst_consumer_payment_pack,
    );

    const consumerPaymentPackIds = uniq([
      ...src_consumer_payment_packs,
      ...dst_consumer_payment_packs,
    ]);

    if (consumerPaymentPackIds?.length) {
      this.props.fetchRelatedMembersNamesByConsumerPaymentPackLinks(
        consumerPaymentPackIds,
      );
    }
  };

  /**
   * Function that fetches associated private consumer pass objects.
   *
   * @function
   * @param {PrivateConsumerPassREST[]} passes - The private consumer passes to fetch associated objects for.
   *
   * This function first fetches the private services associated with the provided private consumer passes.
   * Then, it fetches the compatible pass list for these private services.
   * Finally, it fetches the related members' names the pass is eventually shared with.
   */
  fetchAssociatedPrivateConsumerPassObjects = (
    passes: PrivateConsumerPassREST[],
  ) => {
    const privateServicesIds = uniq(
      passes.reduce(
        (acc, pass) => [...acc, ...pass.private_pass.private_services],
        [],
      ),
    );
    if (privateServicesIds?.length) {
      this.props.fetchPrivateServiceCompatiblePassList({
        private_service__in: privateServicesIds,
      });
    }

    const src_private_consumer_passes = uniq(
      passes.reduce(
        (acc, pass) => [...acc, ...pass.src_private_consumer_pass],
        [],
      ),
    );
    const dst_private_consumer_passes = uniq(
      passes.map((pass) => pass.dst_private_consumer_pass),
    );
    const privateConsumerPasses = uniq([
      ...src_private_consumer_passes,
      ...dst_private_consumer_passes,
    ]);

    if (privateConsumerPasses?.length) {
      this.props.fetchRelatedMembersNamesByPrivateConsumerPassLinks(
        privateConsumerPasses,
      );
    }
  };

  fetchActiveConsumerPaymentPacks = () => {
    this.props.fetchMyActiveConsumerPaymentPacksAsMember(
      { memberId: this.props.membership.id },
      {
        onSuccess: this.fetchAssociatedConsumerPaymentPackObjects,
      },
    );
  };

  fetchActivePrivateConsumerPasses = () => {
    this.props.fetchMyActivePrivateConsumerPassesAsMember(
      { memberId: this.props.membership.id },
      { onSuccess: this.fetchAssociatedPrivateConsumerPassObjects },
    );
  };

  fetchExpiredConsumerPaymentPacks = () => {
    this.props.fetchMyExpiredConsumerPaymentPacksAsMember(
      { memberId: this.props.membership.id },
      {
        onSuccess: this.fetchAssociatedConsumerPaymentPackObjects,
      },
    );
  };

  fetchExpiredPrivateConsumerPasses = () => {
    this.props.fetchMyExpiredPrivateConsumerPassesAsMember(
      { memberId: this.props.membership.id },
      { onSuccess: this.fetchAssociatedPrivateConsumerPassObjects },
    );
  };

  fetchFutureConsumerPaymentPacks = () => {
    this.props.fetchMyFutureConsumerPaymentPacksAsMember(
      { memberId: this.props.membership.id },
      {
        onSuccess: this.fetchAssociatedConsumerPaymentPackObjects,
      },
    );
  };

  fetchFuturePrivateConsumerPasses = () => {
    this.props.fetchMyFuturePrivateConsumerPassesAsMember(
      { memberId: this.props.membership.id },
      { onSuccess: this.fetchAssociatedPrivateConsumerPassObjects },
    );
  };

  handleBuyPassClick = () => {
    const marketplaceTabPath = urlToMarketplacePassTab(
      this.props.marketplaceSettings?.config,
      this.props.theme.company_name,
      this.props.theme.company.toString(),
    );
    if (WidgetUtils.isWidget()) {
      WidgetUtils.closeModal();
      window?.close();
    } else {
      this.props.push(marketplaceTabPath);
    }
  };

  handleBookASessionClick = () => {
    const marketplaceTabPath = urlToMarketplaceSessionTab(
      this.props.marketplaceSettings?.config,
      this.props.theme.company_name,
      this.props.theme.company.toString(),
    );
    if (WidgetUtils.isWidget()) {
      WidgetUtils.closeModal();
      window?.close();
    } else {
      this.props.push(marketplaceTabPath);
    }
  };

  getIsLoading = () => {
    return this.props.consumerPassesLoading;
  };

  render() {
    return (
      <ConsumerPassReworkedComponent
        activeConsumerPaymentPacksList={
          this.props.myActiveConsumerPaymentPacksList
        }
        activeConsumerPaymentPacksState={
          this.props.myActiveConsumerPaymentPacksState
        }
        activePrivateConsumerPassesList={
          this.props.myActivePrivateConsumerPassesList
        }
        activePrivateConsumerPassesState={
          this.props.myActivePrivateConsumerPassesState
        }
        expiredConsumerPaymentPacksList={
          this.props.myExpiredConsumerPaymentPacksList
        }
        expiredConsumerPaymentPacksState={
          this.props.myExpiredConsumerPaymentPacksState
        }
        expiredPrivateConsumerPassesList={
          this.props.myExpiredPrivateConsumerPassesList
        }
        expiredPrivateConsumerPassesState={
          this.props.myExpiredPrivateConsumerPassesState
        }
        fetchActiveConsumerPaymentPacks={this.fetchActiveConsumerPaymentPacks}
        fetchActivePrivateConsumerPasses={this.fetchActivePrivateConsumerPasses}
        fetchExpiredConsumerPaymentPacks={this.fetchExpiredConsumerPaymentPacks}
        fetchExpiredPrivateConsumerPasses={
          this.fetchExpiredPrivateConsumerPasses
        }
        fetchFutureConsumerPaymentPacks={this.fetchFutureConsumerPaymentPacks}
        fetchFuturePrivateConsumerPasses={this.fetchFuturePrivateConsumerPasses}
        futureConsumerPaymentPacksList={
          this.props.myFutureConsumerPaymentPacksList
        }
        futureConsumerPaymentPacksState={
          this.props.myFutureConsumerPaymentPacksState
        }
        futurePrivateConsumerPassesList={
          this.props.myFuturePrivateConsumerPassesList
        }
        futurePrivateConsumerPassesState={
          this.props.myFuturePrivateConsumerPassesState
        }
        handleBookASessionClick={this.handleBookASessionClick}
        handleBuyPassClick={this.handleBuyPassClick}
        isLoading={this.getIsLoading()}
      />
    );
  }
}

const connector = connect(
  (state: RootState, { companyId }: { companyId: number }) => ({
    membership: getMembership(state, companyId),
    companyId,
    theme: getTheme(state),
    marketplaceSettings: state.marketplace.settings,

    /** REWORKED */
    consumerPassesLoading: getConsumerPassesLoading(state),
    myActiveConsumerPaymentPacksList:
      getMyActiveConsumerPaymentPacksList(state),
    myFutureConsumerPaymentPacksList:
      getMyFutureConsumerPaymentPacksList(state),
    myExpiredConsumerPaymentPacksList:
      getMyExpiredConsumerPaymentPacksList(state),
    myActivePrivateConsumerPassesList:
      getMyActivePrivateConsumerPassesList(state),
    myFuturePrivateConsumerPassesList:
      getMyFuturePrivateConsumerPassesList(state),
    myExpiredPrivateConsumerPassesList:
      getMyExpiredPrivateConsumerPassesList(state),
    myActiveConsumerPaymentPacksState:
      getMyActiveConsumerPaymentPacksState(state),
    myFutureConsumerPaymentPacksState:
      getMyFutureConsumerPaymentPacksState(state),
    myExpiredConsumerPaymentPacksState:
      getMyExpiredConsumerPaymentPacksState(state),
    myActivePrivateConsumerPassesState:
      getMyActivePrivateConsumerPassesState(state),
    myFuturePrivateConsumerPassesState:
      getMyFuturePrivateConsumerPassesState(state),
    myExpiredPrivateConsumerPassesState:
      getMyExpiredPrivateConsumerPassesState(state),
  }),
  {
    fetchPaymentPackBulk: fetchPaymentPackBulkAction,
    fetchEstablishmentBulk: fetchEstablishmentBulkAction,
    fetchSCTs: fetchSCTAction,
    fetchMetaActivityBulk: fetchMetaActivityBulkAction,
    fetchRelatedMembersNamesByConsumerPaymentPackLinks:
      fetchRelatedMembersNamesByConsumerPaymentPackLinksAction,
    fetchRelatedMembersNamesByPrivateConsumerPassLinks:
      fetchRelatedMembersNamesByPrivateConsumerPassLinksAction,
    fetchPrivatePassBulk: fetchPrivatePassBulkAction,
    fetchPrivateServiceBulk: fetchPrivateServiceBulkAction,
    fetchPrivateServiceCompatiblePassList:
      fetchPrivateServiceCompatiblePassListAction,
    push,

    /** REWORKED */
    fetchMyActiveConsumerPaymentPacksAsMember:
      fetchMyActiveConsumerPaymentPacksAsMemberAction,
    fetchMyActivePrivateConsumerPassesAsMember:
      fetchMyActivePrivateConsumerPassesAsMemberAction,
    fetchMyExpiredConsumerPaymentPacksAsMember:
      fetchMyExpiredConsumerPaymentPacksAsMemberAction,
    fetchMyExpiredPrivateConsumerPassesAsMember:
      fetchMyExpiredPrivateConsumerPassesAsMemberAction,
    fetchMyFutureConsumerPaymentPacksAsMember:
      fetchMyFutureConsumerPaymentPacksAsMemberAction,
    fetchMyFuturePrivateConsumerPassesAsMember:
      fetchMyFuturePrivateConsumerPassesAsMemberAction,
  },
);

export default compose(connector, marketplaceCssHoc())(ConsumerPassReworked);
