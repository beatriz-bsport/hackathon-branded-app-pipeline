import createCachedSelector from 're-reselect';
import Immutable from 'seamless-immutable';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';
import { createSelector } from 'reselect';
import { getMemberListData } from '#src/libs/member/selectors';
import type { Member } from '#src/libs/member/types';
import { getChannelFromMetadata } from '#src/libs/communication-v2/utils';
import { MAX_DISPLAY } from '#src/libs/communication-v2/constants';
import type { RootState } from '#src/reducers';
import type { Communication } from '#src/libs/communication-v2/types';

// ---------- COMMUNICATION RECIPIENT ----------

const getRecipients = (state: RootState) =>
  state.communicationV2.recipient.byId;

const getRecipientIdPaginatedList = (state: RootState) =>
  state.communicationV2.recipient.allPageIds;

export const getRecipientsLoading = (state: RootState) =>
  state.communicationV2.recipient.loading;

export const getRecipientsCount = (state: RootState) =>
  state.communicationV2.recipient.count;

export const getFirstReachedRecipientsListByKind = (state: RootState) =>
  state.communicationV2.firstReachedRecipients.byKind;

export const getFirstReachedRecipientsListLoading = (state: RootState) =>
  state.communicationV2.firstReachedRecipients.loading;

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
  state.communicationV2.sent.messageList.allIds;

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
        const answerSourceMember =
          sent?.is_answer && sent.sender_member_id
            ? members[sent.sender_member_id]
            : undefined;

        const channel = getChannelFromMetadata(sent.metadata);
        return {
          communication: sent,
          photos: firstMembers.map((member: Member) => member?.photo),
          channel,
          answerSourceMember,
        };
      })
      .filter((messageList) => !!messageList),
);

export const getCommunicationMessageListHasNextPage = (state: RootState) =>
  !!state.communicationV2.sent.messageList.next_page;

export const getCommunicationMessageListLoading = (state: RootState) =>
  !!state.communicationV2.sent.messageList.loading;

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
export const getAllUnreadAnswersCount = (state: RootState) =>
  state.communicationV2.inboxThread.allUnreadAnswersCount;

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

const getInboxThreadFromId = (state: RootState, threadId: number) =>
  state.communicationV2.inboxThread.byId[threadId];

export const getInboxThreadFromSelectedId = createCachedSelector(
  [getInboxThreadFromId],
  (thread) => thread,
)((state: RootState, threadId: number) => threadId);

// ---------- COMMUNICATION SCHEDULED ----------

const _getCommunicationScheduledbyId = (state: RootState) =>
  state.communicationV2.communicationScheduled.byId;

const _getCommunicationScheduledbySmartlistAllIds = (
  state: RootState,
  id: number,
) =>
  state.communicationV2.communicationScheduled.bySmartlistId.all[id]?.allIds ??
  [];

export const getCommunicationScheduledForSmartlist = createSelector(
  [_getCommunicationScheduledbySmartlistAllIds, _getCommunicationScheduledbyId],
  (ids, byId) => ids?.map((id) => byId[id]) ?? [],
);

export const getCommunicationScheduledBySmartlistLoading = (state: RootState) =>
  state.communicationV2.communicationScheduled.bySmartlistId.loading;

export const getCommunicationScheduledBySmartlistTotal = (
  state: RootState,
  smartlistId: number,
) =>
  state.communicationV2.communicationScheduled.bySmartlistId.all[smartlistId]
    ?.count ?? 0;

export const getCommunicationScheduledBySmartlistPage = (
  state: RootState,
  smartlistId: number,
) =>
  state.communicationV2.communicationScheduled.bySmartlistId.all[smartlistId]
    ?.page ?? 1;

export const getCommunicationSMSProviderVerificationState = (
  state: RootState,
) => state.communicationV2.communicationSMSProviderVerification;
