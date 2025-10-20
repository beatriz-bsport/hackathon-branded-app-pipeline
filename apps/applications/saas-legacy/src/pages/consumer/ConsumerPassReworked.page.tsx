import React from 'react';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import uniq from 'lodash/uniq';

import type { RootState } from 'src/reducers';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import ReLiftReduxProviderIfDetected from '#src/hocs/relift-redux-provider.hoc';

/** COMPONENTS */

import ConsumerPassReworkedComponent from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassPageReworked';

/** SELECTORS */

import {
  getConsumerPassMetadataLoading,
  getConsumerPassesLoading,
  getMyActiveConsumerPaymentPacksList,
  getMyActiveConsumerPaymentPacksState,
  getMyActivePrivateConsumerPassesList,
  getMyActivePrivateConsumerPassesState,
  getMyActiveUniversalPassesList,
  getMyActiveUniversalPassesState,
  getMyExpiredConsumerPaymentPacksList,
  getMyExpiredConsumerPaymentPacksState,
  getMyExpiredPrivateConsumerPassesList,
  getMyExpiredPrivateConsumerPassesState,
  getMyExpiredUniversalPassesList,
  getMyExpiredUniversalPassesState,
  getMyFutureConsumerPaymentPacksList,
  getMyFutureConsumerPaymentPacksState,
  getMyFuturePrivateConsumerPassesList,
  getMyFuturePrivateConsumerPassesState,
  getMyFutureUniversalPassesList,
  getMyFutureUniversalPassesState,
  getConsumerPassesTabDisplay,
  getConsumerPassesTabDisplayLoading,
} from '#src/libs/consumer-space/selectors';
import { getTheme } from '#src/libs/theme/selectors';
import { getMembership } from '#src/libs/membership/selectors';
import { getMarketplaceSettingsConfig } from '#src/libs/marketplace/selectors';

/** ACTIONS */

import {
  fetchMyActiveConsumerPaymentPacksAsMember as fetchMyActiveConsumerPaymentPacksAsMemberAction,
  fetchMyActivePrivateConsumerPassesAsMember as fetchMyActivePrivateConsumerPassesAsMemberAction,
  fetchMyActiveUniversalPassesAsMember as fetchMyActiveUniversalPassesAsMemberAction,
  fetchMyExpiredConsumerPaymentPacksAsMember as fetchMyExpiredConsumerPaymentPacksAsMemberAction,
  fetchMyExpiredPrivateConsumerPassesAsMember as fetchMyExpiredPrivateConsumerPassesAsMemberAction,
  fetchMyExpiredUniversalPassesAsMember as fetchMyExpiredUniversalPassesAsMemberAction,
  fetchMyFutureConsumerPaymentPacksAsMember as fetchMyFutureConsumerPaymentPacksAsMemberAction,
  fetchMyFuturePrivateConsumerPassesAsMember as fetchMyFuturePrivateConsumerPassesAsMemberAction,
  fetchMyFutureUniversalPassesAsMember as fetchMyFutureUniversalPassesAsMemberAction,
  fetchConsumerPassesTabDisplay as fetchMyPassesTabsAction,
  resetConsumerState as resetConsumerStateAction,
} from '#src/libs/consumer-space/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#src/libs/payment-packs/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '#src/libs/establishment/actions';
import { fetchSCT as fetchSCTAction } from '#src/libs/category/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#src/libs/meta-activity/actions';
import {
  fetchPrivatePassBulk as fetchPrivatePassBulkAction,
  fetchPrivateServiceBulk as fetchPrivateServiceBulkAction,
  fetchPrivateServiceCompatiblePassList as fetchPrivateServiceCompatiblePassListAction,
} from '#src/libs/private-service/actions';
import {
  fetchRelatedMembersNamesByConsumerPaymentPackLinks as fetchRelatedMembersNamesByConsumerPaymentPackLinksAction,
  fetchRelatedMembersNamesByPrivateConsumerPassLinks as fetchRelatedMembersNamesByPrivateConsumerPassLinksAction,
} from '#src/libs/relationship/actions';

/** TYPES */

import type { ConsumerPaymentPackREST } from '#src/libs/consumer-payment-pack/types';
import type { PrivateConsumerPassREST } from '#src/libs/private-service/types';
import { UniversalPassREST } from '#src/libs/universal-pass/types';
import { trackMemberProfileViewedEvent } from '#src/events/member-profile/trackers';
import { analyticsClientB2C } from '#src/components/analytics/mixpanel';

export class ConsumerPassReworked extends React.Component<
  ConnectedProps<typeof connector>
> {
  componentDidMount() {
    !!this.props.membership?.id &&
      this.props.fetchMyPassesTabs(this.props.membership.id);
    // Only fetch current tab data -> default is Consumer payment packs
    this.fetchActiveConsumerPaymentPacks();
    this.fetchExpiredConsumerPaymentPacks();
    this.fetchFutureConsumerPaymentPacks();
    // Only fetch SCTs once and for all
    !!this.props.membership?.id &&
      this.props.fetchSCTs({
        member: this.props.membership.id,
      });
    analyticsClientB2C.track(
      trackMemberProfileViewedEvent({ page_type: 'pass' }),
    );
  }

  componentDidUpdate(prevProps: ConnectedProps<typeof connector>) {
    // Membership did update
    if (!prevProps?.membership?.id && !!this.props?.membership?.id) {
      this.props.fetchMyPassesTabs(this.props.membership.id);
      this.props.fetchSCTs({
        member: this.props.membership.id,
      });
      this.fetchActiveConsumerPaymentPacks();
      this.fetchExpiredConsumerPaymentPacks();
      this.fetchFutureConsumerPaymentPacks();
    }
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
    ]).filter((pass) => !!pass);

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

    const src_private_consumer_passes = passes.reduce(
      (acc, pass) => [...acc, ...pass.src_private_consumer_pass],
      [],
    );
    const dst_private_consumer_passes = passes.reduce(
      (acc, pass) => [...acc, ...pass.dst_private_consumer_pass],
      [],
    );
    const privateConsumerPasses = uniq([
      ...src_private_consumer_passes,
      ...dst_private_consumer_passes,
    ]).filter((pass) => !!pass);

    if (privateConsumerPasses?.length) {
      this.props.fetchRelatedMembersNamesByPrivateConsumerPassLinks(
        privateConsumerPasses,
      );
    }
  };

  fetchAssociatedUniversalPassObjects = (passes: UniversalPassREST[]) => {
    this.fetchAssociatedConsumerPaymentPackObjects(
      passes?.map((universalPass) => universalPass.consumer_payment_pack),
    );
    this.fetchAssociatedPrivateConsumerPassObjects(
      passes?.map((universalPass) => universalPass.private_consumer_pass),
    );
  };

  fetchActiveConsumerPaymentPacks = (page?: number) => {
    !!this.props.membership?.id &&
      this.props.fetchMyActiveConsumerPaymentPacksAsMember(
        { page, memberId: this.props.membership.id },
        {
          onSuccess: (data) =>
            this.fetchAssociatedConsumerPaymentPackObjects(data.results),
        },
      );
  };

  fetchActivePrivateConsumerPasses = (page?: number) => {
    !!this.props.membership?.id &&
      this.props.fetchMyActivePrivateConsumerPassesAsMember(
        { page, memberId: this.props.membership.id },
        {
          onSuccess: (data) =>
            this.fetchAssociatedPrivateConsumerPassObjects(data.results),
        },
      );
  };

  fetchActiveUniversalPasses = (page?: number) => {
    !!this.props.membership?.id &&
      this.props.fetchMyActiveUniversalPassesAsMember(
        { page, memberId: this.props.membership.id },
        {
          onSuccess: (data) =>
            this.fetchAssociatedUniversalPassObjects(data.results),
        },
      );
  };

  fetchExpiredConsumerPaymentPacks = (page?: number) => {
    !!this.props.membership?.id &&
      this.props.fetchMyExpiredConsumerPaymentPacksAsMember(
        { page, memberId: this.props.membership.id },
        {
          onSuccess: (data) =>
            this.fetchAssociatedConsumerPaymentPackObjects(data.results),
        },
      );
  };

  fetchExpiredPrivateConsumerPasses = (page?: number) => {
    !!this.props.membership?.id &&
      this.props.fetchMyExpiredPrivateConsumerPassesAsMember(
        { page, memberId: this.props.membership.id },
        {
          onSuccess: (data) =>
            this.fetchAssociatedPrivateConsumerPassObjects(data.results),
        },
      );
  };

  fetchExpiredUniversalPasses = (page?: number) => {
    !!this.props.membership?.id &&
      this.props.fetchMyExpiredUniversalPassesAsMember(
        { page, memberId: this.props.membership.id },
        {
          onSuccess: (data) =>
            this.fetchAssociatedUniversalPassObjects(data.results),
        },
      );
  };

  fetchFutureConsumerPaymentPacks = (page?: number) => {
    !!this.props.membership?.id &&
      this.props.fetchMyFutureConsumerPaymentPacksAsMember(
        { page, memberId: this.props.membership.id },
        {
          onSuccess: (data) =>
            this.fetchAssociatedConsumerPaymentPackObjects(data.results),
        },
      );
  };

  fetchFuturePrivateConsumerPasses = (page?: number) => {
    !!this.props.membership?.id &&
      this.props.fetchMyFuturePrivateConsumerPassesAsMember(
        { page, memberId: this.props.membership.id },
        {
          onSuccess: (data) =>
            this.fetchAssociatedPrivateConsumerPassObjects(data.results),
        },
      );
  };

  fetchFutureUniversalPasses = (page?: number) => {
    !!this.props.membership?.id &&
      this.props.fetchMyFutureUniversalPassesAsMember(
        { page, memberId: this.props.membership.id },
        {
          onSuccess: (data) =>
            this.fetchAssociatedUniversalPassObjects(data.results),
        },
      );
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
        activeUniversalPassesList={this.props.myActiveUniversalPassesList}
        activeUniversalPassesState={this.props.myActiveUniversalPassesState}
        consumerPassesTabDisplay={this.props.consumerPassesTabDisplay}
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
        expiredUniversalPassesList={this.props.myExpiredUniversalPassesList}
        expiredUniversalPassesState={this.props.myExpiredUniversalPassesState}
        fetchActiveConsumerPaymentPacks={this.fetchActiveConsumerPaymentPacks}
        fetchActivePrivateConsumerPasses={this.fetchActivePrivateConsumerPasses}
        fetchActiveUniversalPasses={this.fetchActiveUniversalPasses}
        fetchExpiredConsumerPaymentPacks={this.fetchExpiredConsumerPaymentPacks}
        fetchExpiredPrivateConsumerPasses={
          this.fetchExpiredPrivateConsumerPasses
        }
        fetchExpiredUniversalPasses={this.fetchExpiredUniversalPasses}
        fetchFutureConsumerPaymentPacks={this.fetchFutureConsumerPaymentPacks}
        fetchFuturePrivateConsumerPasses={this.fetchFuturePrivateConsumerPasses}
        fetchFutureUniversalPasses={this.fetchFutureUniversalPasses}
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
        futureUniversalPassesList={this.props.myFutureUniversalPassesList}
        futureUniversalPassesState={this.props.myFutureUniversalPassesState}
        isLoading={this.getIsLoading()}
        isMetadataLoading={this.props.consumerPassesMetadataLoading}
        resetConsumerState={this.props.resetConsumerState}
      />
    );
  }
}

const connector = connect(
  (state: RootState, { companyId }: { companyId: number }) => ({
    authenticated: state.auth.authenticated,
    membership: getMembership(state, companyId),
    companyId,
    theme: getTheme(state),
    marketplaceSettingsConfig: getMarketplaceSettingsConfig(state),

    /** REWORKED */
    consumerPassesTabDisplayLoading: getConsumerPassesTabDisplayLoading(state),
    consumerPassesLoading: getConsumerPassesLoading(state),
    consumerPassesMetadataLoading: getConsumerPassMetadataLoading(state),
    consumerPassesTabDisplay: getConsumerPassesTabDisplay(state),
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
    myActiveUniversalPassesList: getMyActiveUniversalPassesList(state),
    myFutureUniversalPassesList: getMyFutureUniversalPassesList(state),
    myExpiredUniversalPassesList: getMyExpiredUniversalPassesList(state),
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
    myActiveUniversalPassesState: getMyActiveUniversalPassesState(state),
    myFutureUniversalPassesState: getMyFutureUniversalPassesState(state),
    myExpiredUniversalPassesState: getMyExpiredUniversalPassesState(state),
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
    fetchMyPassesTabs: fetchMyPassesTabsAction,
    fetchMyActiveConsumerPaymentPacksAsMember:
      fetchMyActiveConsumerPaymentPacksAsMemberAction,
    fetchMyActivePrivateConsumerPassesAsMember:
      fetchMyActivePrivateConsumerPassesAsMemberAction,
    fetchMyActiveUniversalPassesAsMember:
      fetchMyActiveUniversalPassesAsMemberAction,
    fetchMyExpiredConsumerPaymentPacksAsMember:
      fetchMyExpiredConsumerPaymentPacksAsMemberAction,
    fetchMyExpiredPrivateConsumerPassesAsMember:
      fetchMyExpiredPrivateConsumerPassesAsMemberAction,
    fetchMyExpiredUniversalPassesAsMember:
      fetchMyExpiredUniversalPassesAsMemberAction,
    fetchMyFutureConsumerPaymentPacksAsMember:
      fetchMyFutureConsumerPaymentPacksAsMemberAction,
    fetchMyFuturePrivateConsumerPassesAsMember:
      fetchMyFuturePrivateConsumerPassesAsMemberAction,
    fetchMyFutureUniversalPassesAsMember:
      fetchMyFutureUniversalPassesAsMemberAction,
    resetConsumerState: resetConsumerStateAction,
  },
);

export const UnconnectedConsumerPass = compose(
  ReLiftReduxProviderIfDetected(),
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(ConsumerPassReworked);

export default compose(
  ReLiftReduxProviderIfDetected(),
  connector,
)(UnconnectedConsumerPass);
