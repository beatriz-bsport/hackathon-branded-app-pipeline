import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import { getMemberListData } from '#libs/member/selectors';
import { RootState } from '../../reducers';
import { Communication } from './types';
import { Member } from '#libs/member/types';
import { getChannelFromMetadata } from './utils';
import { MAX_DISPLAY } from './constants';

// ---------- COMMUNICATION RECIPIENT ----------

const getRecipients = (state: RootState) =>
  state.communicationV2.recipient.byId;

const getRecipientIdPaginatedList = (state: RootState) =>
  state.communicationV2.recipient.allPageIds;

export const getRecipientWithMemberPaginatedList = createSelector(
  [getRecipients, getRecipientIdPaginatedList, getMemberListData],
  (recipients, recipientIdList, members) =>
    recipientIdList
      .map((recipientId: number) => {
        const recipient = recipients[recipientId];
        if (recipient)
          return {
            ...recipient,
            member: members[recipient.member],
          };
        return undefined;
      })
      .filter((recipient) => !!recipient),
);

// ---------- COMMUNICATION SENT ----------

const getCommunicationSents = (state: RootState) =>
  state.communicationV2.sent.byId;

const getCommunicationSentPaginatedList = (state: RootState) =>
  state.communicationV2.sent.thread.allIds;

export const getCommunicationMessageList = createSelector(
  [getCommunicationSents, getCommunicationSentPaginatedList, getMemberListData],
  (sents, ids, members) =>
    ids
      .map((id: number) => {
        if (!sents) {
          return undefined;
        }
        const sent: Communication = sents[id];
        if (!sent) return undefined;
        const recipients = sent?.recipient_member_id_list || [];
        const firstMemberIds = recipients.slice(
          0,
          Math.min(MAX_DISPLAY, recipients.length),
        );
        const firstMembers = firstMemberIds.map(
          (member_id: number) => members[member_id],
        );
        const channel = getChannelFromMetadata(sent.metadata);
        const answerSourceMember =
          sent?.is_answer && firstMembers?.length ? firstMembers[0] : undefined;
        return {
          communication: sent,
          photos: firstMembers.map((member: Member) => member?.photo),
          channel,
          answerSourceMember,
        };
      })
      .filter((thread) => !!thread),
);

export const getCommunicationMessageListHasNextPage = (state: RootState) =>
  !!state.communicationV2.sent.thread.next_page;

export const getCommunicationMessageListLoading = (state: RootState) =>
  !!state.communicationV2.sent.thread.loading;

export const getIsTwoWayEmailActivated = (state: RootState): boolean => {
  const provider =
    state.communicationV2.company_communication_provider.email.provider;
  let isTwoWayEmailActivated = false;
  if (provider) isTwoWayEmailActivated = provider.is_two_way_email_activated;
  return isTwoWayEmailActivated;
};

const getSmartListPopupSendingIds = (state: RootState) =>
  state.communicationV2.smartListPopupSending.allIds;

const getSmartListPopupSendingById = (state: RootState) =>
  state.communicationV2.smartListPopupSending.byId;

export const getSmartListPopupSendingList = createSelector(
  [getSmartListPopupSendingIds, getSmartListPopupSendingById],
  (ids, data) => ids.map((id) => data[id]),
);

// --------INBOX THREAD--------

const getInboxThreadsById = (state: RootState) =>
  state.communicationV2.inboxThread.byId;
const getUnreadAnswersCounts = (state: RootState) =>
  state.communicationV2.inboxThread.unreadAnswersCountsById;

const getInboxThreadsIds = (state: RootState, threadKind: ChatThreadKinds) =>
  state.communicationV2.inboxThread[threadKind].allIds;

export const getInboxThreadsWithUnreadAnswersCount = createCachedSelector(
  [getInboxThreadsIds, getInboxThreadsById, getUnreadAnswersCounts],
  (ids, data, unreadAnswersCounts) =>
    ids.map((id) => {
      const numberOfUnreadAnswers =
        id in unreadAnswersCounts ? unreadAnswersCounts[id] : 0;
      return Immutable({ ...data[id], numberOfUnreadAnswers });
    }),
)((state: RootState, threadKind: ChatThreadKinds) => threadKind);

const getCountThreadsResults = (
  state: RootState,
  threadKind: ChatThreadKinds,
): number => state.communicationV2.inboxThread[threadKind].count;

const getNextPageThreadsResults = (
  state: RootState,
  threadKind: ChatThreadKinds,
): number => state.communicationV2.inboxThread[threadKind].next_page;

export const getThreadsPaginationResults = createCachedSelector(
  [getCountThreadsResults, getNextPageThreadsResults],
  (count, nextPage) => {
    return Immutable({ count, nextPage });
  },
)((state: RootState, threadKind: ChatThreadKinds) => threadKind);
