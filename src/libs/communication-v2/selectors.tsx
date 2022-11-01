import { createSelector } from 'reselect';
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

export const getThreadCommunicationList = createSelector(
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
        return {
          communication: sent,
          photos: firstMembers.map((member: Member) => member?.photo),
          channel,
        };
      })
      .filter((thread) => !!thread),
);

export const getThreadCommunicationListHasNextPage = (state: RootState) =>
  !!state.communicationV2.sent.thread.next_page;

export const getThreadCommunicationListLoading = (state: RootState) =>
  !!state.communicationV2.sent.thread.loading;
