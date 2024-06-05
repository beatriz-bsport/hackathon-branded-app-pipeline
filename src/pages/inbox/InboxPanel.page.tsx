import React, { PureComponent } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { push } from 'connected-react-router';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import InboxPanelComponent from '#src/libs/communication-v2/thread/InboxPanel';
import type { CommunicationThread } from '#src/libs/communication-v2/types';
import { getMember } from '#src/libs/member/selectors';
import {
  getSmartListFilters,
  getSmartList,
} from '#src/libs/smart-list/selectors';
import { withCustomLevel } from '#src/libs/level/selectors';
import { withGroup } from '#src/libs/group-offer/selectors';
import {
  getOfferById,
  withCoach,
  withEstablishment,
  withMetaActivity,
} from '#src/libs/offer/selectors';
import { withInvoiceItem, getInvoiceList } from '#src/libs/invoice/selectors';
import tagSelectors from '#src/libs/tag/selectors';
import { fetchMember as fetchMemberAction } from '#src/libs/member/actions';
import { fetchInvoiceList as fetchInvoiceListAction } from '#src/libs/invoice/actions';
import { fetchTags as fetchTagsAction } from '#src/libs/tag/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#src/libs/meta-activity/actions';

import {
  fetchSmartListDetail as fetchSmartListDetailAction,
  fetchSmartListFilters as fetchSmartListFiltersAction,
} from '#src/libs/smart-list/actions';

import { retrieveOffer as retrieveOfferAction } from '#src/libs/offer/actions';
import { fetchGroupsOfferList as fetchGroupsOfferListAction } from '#src/libs/group-offer/actions';

import { fetchCoachBulk as fetchCoachBulkAction } from '#src/libs/associated-coach/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '#src/libs/establishment/actions';
import { fetchLevelList as fetchLevelListAction } from '#src/libs/level/actions';
import { fetchSmartListMembers as fetchSmartListMembersAPI } from '#src/libs/smart-list/api';
import type { Offer } from '#src/libs/offer/types';
import { getFilterTagsFromSmartlist } from '#src/libs/communication-v2/utils';
import { getTheme } from '#src/libs/theme/selectors';
import type { RootState } from '../../reducers';

type OwnProps = {
  isPanelOpen?: boolean;
  setIsPanelOpen?: (isOpen: boolean) => void;
  thread: CommunicationThread;
  isLoadingThread: boolean;
};

type InboxPanelConnectedProps = OwnProps & ConnectedProps<typeof connector>;

type WithState = {
  memberInSmartlistCount: number;
  setMemberInSmartlistCount: (count: number) => void;
};
type WithHandlers = {
  fetchInvoiceListUnpaid: (id: number) => void;
  handleFetchOffer: (id: number) => void;
};

type Props = InboxPanelConnectedProps & WithState & WithHandlers;

class InboxPanel extends PureComponent<Props> {
  componentDidMount() {
    if (this.props.thread) {
      this.fetchDataFromThread();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.thread?.id !== prevProps.thread?.id) {
      if (this.props.thread) {
        this.fetchDataFromThread();
      } else {
        this.props.setIsPanelOpen(false);
      }
    }
  }

  fetchDataFromThread = () => {
    const {
      thread,
      fetchMember,
      fetchInvoiceListUnpaid,
      fetchSmartListDetail,
      fetchSmartListFilters,
      fetchTags,
      handleFetchOffer,
    } = this.props;

    const id = thread?.related_object_id;

    switch (thread?.related_object_kind) {
      case ChatThreadKinds.Member:
        fetchMember(id);
        fetchInvoiceListUnpaid(id);
        break;
      case ChatThreadKinds.Smartlist:
        fetchSmartListDetail(id);
        fetchSmartListFilters(id);
        fetchTags();
        this.getMembersCountInSmartlist(id);
        break;
      case ChatThreadKinds.Offer:
        handleFetchOffer(id);
        break;
      default:
        break;
    }
  };

  getMembersCountInSmartlist = (id: number) => {
    fetchSmartListMembersAPI(id).then((response) => {
      this.props.setMemberInSmartlistCount(response.data.count);
    });
  };

  getUnpaidInvoicesCount = () => {
    const { unpaidInvoiceList } = this.props;
    if (!unpaidInvoiceList) {
      return 0;
    }
    if (Array.isArray(unpaidInvoiceList)) {
      return unpaidInvoiceList.length;
    }
    return 1;
  };

  getFilterTagsFromSmartlist = () => {
    const { filtersSmartlist, tags } = this.props;

    return getFilterTagsFromSmartlist(filtersSmartlist, tags);
  };

  render() {
    const {
      isPanelOpen,
      setIsPanelOpen,
      thread,
      tags,
      member,
      goToMemberPage,
      smartlist,
      memberInSmartlistCount,
      filtersSmartlist,
      goToSmartlistPage,
      offer,
      goToOfferPage,
      closeInboxPanel,
      isLoadingThread,
      theme,
    } = this.props;

    const unpaidInvoicesCount = this.getUnpaidInvoicesCount();

    const { includedTagsForSmartlist, excludedTagsForSmartlist } =
      this.getFilterTagsFromSmartlist();

    return (
      <InboxPanelComponent
        closeInboxPanel={closeInboxPanel}
        excludedTagsForSmartlist={excludedTagsForSmartlist}
        filtersSmartlist={filtersSmartlist}
        goToMemberPage={goToMemberPage}
        // In reality, typeof tags is Tag<TagGroup>[] and not Tag<TagGroupAPI>[]
        goToOfferPage={goToOfferPage}
        goToSmartlistPage={goToSmartlistPage}
        includedTagsForSmartlist={includedTagsForSmartlist}
        isLoadingThread={isLoadingThread}
        isPanelOpen={isPanelOpen}
        member={member}
        memberInSmartlistCount={memberInSmartlistCount}
        offer={offer}
        setIsPanelOpen={setIsPanelOpen}
        showOfferGender={theme?.show_booked_gender_offer}
        smartlist={smartlist}
        // @ts-expect-error
        tags={tags}
        thread={thread}
        unpaidInvoicesCount={unpaidInvoicesCount}
      />
    );
  }
}

const connector = connect(
  (state: RootState, { thread }: OwnProps) => ({
    tags: tagSelectors.getMemberTagsWithTagGroup(state),
    member:
      thread?.related_object_kind === ChatThreadKinds.Member &&
      getMember(state, thread.related_object_id),
    unpaidInvoiceList: withInvoiceItem(getInvoiceList)(state),
    smartlist:
      thread?.related_object_kind === ChatThreadKinds.Smartlist &&
      getSmartList(state, thread.related_object_id),
    filtersSmartlist: getSmartListFilters(state, thread?.related_object_id),
    offer:
      thread?.related_object_kind === ChatThreadKinds.Offer &&
      withMetaActivity(
        // @ts-expect-error
        withGroup(withCustomLevel(withEstablishment(withCoach(getOfferById)))),
      )(state, thread?.related_object_id),
    theme: getTheme(state),
  }),
  {
    fetchMember: fetchMemberAction,
    fetchInvoiceList: fetchInvoiceListAction,
    fetchSmartListDetail: fetchSmartListDetailAction,
    fetchSmartListFilters: fetchSmartListFiltersAction,
    fetchTags: fetchTagsAction,
    fetchMetaActivityBulk: fetchMetaActivityBulkAction,
    retrieveOffer: retrieveOfferAction,
    fetchCoachBulk: fetchCoachBulkAction,
    fetchEstablishmentBulk: fetchEstablishmentBulkAction,
    fetchLevelList: fetchLevelListAction,
    fetchGroupsOfferList: fetchGroupsOfferListAction,
    goToMemberPage: (id: number) => push(`/member/${id}/info/`),
    goToSmartlistPage: (id: number) => push(`/smart-list/${id}/member/`),
    goToOfferPage: (id: number) => push(`/offer/${id}/`),
    closeInboxPanel: (id: number) => push(`/inbox/thread/${id}/`),
  },
);

export default compose<Props, OwnProps>(
  connector,
  withState('memberInSmartlistCount', 'setMemberInSmartlistCount', 0),
  withHandlers({
    fetchInvoiceListUnpaid:
      ({ fetchInvoiceList }: InboxPanelConnectedProps) =>
      (id: number) => {
        fetchInvoiceList({
          is_v2: true,
          unpaid: true,
          member: id.toString(),
        });
      },
    handleFetchOffer:
      ({
        retrieveOffer,
        fetchCoachBulk,
        fetchEstablishmentBulk,
        fetchGroupsOfferList,
        fetchLevelList,
        fetchMetaActivityBulk,
      }: InboxPanelConnectedProps) =>
      (id: number) => {
        retrieveOffer(id, {
          onSuccess: (offer: Offer) => {
            fetchCoachBulk([offer.coach, offer.coach_override]);
            fetchMetaActivityBulk([offer.meta_activity]);

            fetchEstablishmentBulk([offer.establishment]);
            fetchLevelList();
            if (offer.group) {
              fetchGroupsOfferList({
                // @ts-expect-error
                id__in: offer.group.id,
                page: 1,
                page_size: 1,
              });
            }
          },
        });
      },
  }),
)(InboxPanel);
