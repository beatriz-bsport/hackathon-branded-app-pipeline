import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import uniq from 'lodash/uniq';
import { OptionCallback } from '../../state/types';
import type { RootState } from '../../reducers';

// COMMUNICATION
import {
  fetchCommunicationRecipientList as fetchCommunicationRecipientListAction,
  fetchCommunicationSentList as fetchCommunicationSentListAction,
  fetchAvailableRecipientMemberLists as fetchAvailableRecipientMemberListsAction,
  sendCommunication,
  fetchSelectedMemberListToSendCommunication as fetchSelectedMemberListToSendCommunicationAction,
} from './actions';
import {
  getRecipientWithMemberPaginatedList,
  getThreadCommunicationList,
  getThreadCommunicationListHasNextPage,
  getThreadCommunicationListLoading,
  getSelectedMemberDetailList,
} from './selectors';
import {
  getFormatedContext,
  getFormatedFiltersToFetchCommunicationSent,
} from './utils';
import { Communication, MessageParams, DrawerProps } from './types';

// TEMPLATES
import {
  emailTemplateComplete,
  emailTemplatesSummaries,
} from '#libs/email-editor/actions';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#libs/email-editor/selectors';

// MEMBER
import {
  fetchCommunicationsPaginatedMembers,
  fetchMemberBulkById as fetchMemberBulkByIdAction,
} from '#libs/member/actions';
import { getPaginatedMembers } from '#libs/member/selectors';
import { Member } from '#libs/member/types';
import { MAX_DISPLAY, PAGINATION_SIZE_RECIPIENTS } from './constants';
import { ResolvedGenericTags } from '#libs/email-editor/types';

type CommunicationConnectedProps = ConnectedProps<typeof connector> &
  DrawerProps;

export type WithCommunicationDataProps = CommunicationConnectedProps & {
  fetchPageThreadCommunicationList: (
    page: number,
    filters: number[],
    dateStart: number,
    dateEnd: number,
  ) => void;
  fetchPageInformationRecipientList: (
    communicationId: number,
    memberIdList: number[],
  ) => void;
  sendCommunication: (data: MessageParams, option: OptionCallback) => void;
  fetchAvailableRecipientMemberIdLists: () => void;
  fetchSelectedMemberListToSendCommunication: (member_id__in: number[]) => void;
  resolvedGenericTags: ResolvedGenericTags;
};

const connector = connect(
  (state: RootState, { contextMember }: { contextMember: Member }) => ({
    // TRHEADS
    threadCommunicationList: getThreadCommunicationList(state),
    loadingThreadCommunicationList: getThreadCommunicationListLoading(state),
    threadCommunicationListHasNextPage:
      getThreadCommunicationListHasNextPage(state),
    // RECIPIENTS
    informationRecipientList: getRecipientWithMemberPaginatedList(state),
    loadingInformationRecipientList:
      state.communicationV2.recipient.byCommunicationSent.loading,
    // TEMPLATES
    emailTemplateDetailList: getEmailTemplatesDetail(state),
    loadingEmailTemplateDetailList: state.emailTemplate.detail.loading,
    emailTemplateSummaryList: getAllEmailTemplatesSummaries(state),
    loadingEmailTemplateSummaryList: state.emailTemplate.loading,
    // MEMBERS
    availableMemberToSendCommunicationIdList: contextMember
      ? [contextMember.id]
      : [...state.communicationV2.memberIdLists.allIds].sort(
          (id, _id) => id - _id,
        ),
    availableMemberWithoutEmailToSendCommunicationIdList: contextMember
      ? [!contextMember.email && contextMember.id].filter(
          (value: any) => !!value,
        ) // because [false and id] give [false], when [true and id] give [id]
      : state.communicationV2.memberIdLists.allIdsWithoutEmail,
    availableMemberWithoutPhoneToSendCommunicationIdList: contextMember
      ? [!contextMember.phone_number && contextMember.id].filter(
          (value: any) => !!value,
        )
      : state.communicationV2.memberIdLists.allIdsWithoutPhone,
    recipientsModalMemberList: getPaginatedMembers(state),
    loadingRecipientsModalMemberList: state.member.communication.loading,
    selectedMemberListToSendCommunication: getSelectedMemberDetailList(state),
    selectedMemberListToSendCommunicationLoading:
      state.communicationV2.send.selectedMemberList.loading,
  }),
  {
    fetchCommunicationSentList: fetchCommunicationSentListAction,
    fetchCommunicationRecipientList: fetchCommunicationRecipientListAction,
    fetchEmailDetail: emailTemplateComplete,
    fetchEmailSummaryList: emailTemplatesSummaries,
    fetchPaginatedMemberList: fetchCommunicationsPaginatedMembers,
    sendCommunicationAction: sendCommunication,
    fetchMemberBulkById: fetchMemberBulkByIdAction,
    fetchAvailableRecipientMemberLists:
      fetchAvailableRecipientMemberListsAction,
    fetchSelectedMemberMiniBulkToSendCommunication:
      fetchSelectedMemberListToSendCommunicationAction,
  },
);

export default function withCommunicationData(
  WrappedComponent: React.ComponentType,
) {
  return compose(
    connector,
    withHandlers({
      fetchPageThreadCommunicationList:
        (props: CommunicationConnectedProps) =>
        (
          page: number,
          filters: number[],
          dateStart: number,
          dateEnd: number,
        ) => {
          const params = {
            page,
            ...getFormatedFiltersToFetchCommunicationSent(
              filters,
              dateStart,
              dateEnd,
            ),
            context: JSON.stringify(
              getFormatedContext({
                identifier: props.contextIdentifier,
                objectId: props.contextObjectId,
              }),
            ),
          };

          const onSuccess = (responseData: Communication[]) => {
            const memberIds = uniq(
              responseData
                .map((sent: Communication) =>
                  sent.recipient_member_id_list?.slice(
                    0,
                    Math.min(MAX_DISPLAY, sent.recipient_member_id_list.length),
                  ),
                )
                .flat(1)
                .filter((id: number) => !!id),
            );
            props.fetchMemberBulkById(memberIds);
          };
          return props.fetchCommunicationSentList(params, {
            onSuccess,
          });
        },
      fetchPageInformationRecipientList:
        ({ fetchCommunicationRecipientList, fetchMemberBulkById }) =>
        (communicationId: number, memberIdList: number[]) => {
          const params = {
            page_size: PAGINATION_SIZE_RECIPIENTS,
            page: 1,
            communication_sent: communicationId,
            member_id__in: memberIdList,
          };
          fetchCommunicationRecipientList(params);
          fetchMemberBulkById(memberIdList);
        },
      fetchAvailableRecipientMemberIdLists:
        (props: CommunicationConnectedProps) => () => {
          return props.fetchAvailableRecipientMemberLists(
            getFormatedContext({
              identifier: props.contextIdentifier,
              objectId: props.contextObjectId,
            }),
          );
        },
      fetchSelectedMemberListToSendCommunication:
        (props: CommunicationConnectedProps) => (member_id__in: number[]) => {
          return props.fetchSelectedMemberMiniBulkToSendCommunication({
            id__in: member_id__in.slice(
              0,
              Math.min(member_id__in.length, MAX_DISPLAY),
            ),
            page: 1,
            page_size: MAX_DISPLAY,
          });
        },
      sendCommunication:
        (props: CommunicationConnectedProps) =>
        (data: MessageParams, option: OptionCallback) => {
          const dataWithContext = {
            ...data,
            context: getFormatedContext({
              identifier: props.contextIdentifier,
              objectId: props.contextObjectId,
            }),
          };
          return props.sendCommunicationAction(dataWithContext, option);
        },
    }),
  )(WrappedComponent);
}
