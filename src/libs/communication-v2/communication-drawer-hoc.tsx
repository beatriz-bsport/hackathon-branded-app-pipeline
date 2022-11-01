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
  sendCommunication,
} from './actions';
import {
  getRecipientWithMemberPaginatedList,
  getThreadCommunicationList,
  getThreadCommunicationListHasNextPage,
  getThreadCommunicationListLoading,
} from './selectors';
import {
  getFormatedFiltersToFetchCommunicationSent,
  getFormatedQueryParamsFromContext,
} from './utils';
import { Communication, MessageData, DrawerProps } from './types';

// TEMPLATES
import {
  emailTemplateComplete,
  emailTemplatesSummaries,
} from '#libs/email-editor/actions';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#libs/email-editor/selectors';
import { getResolvedGenericTags } from '#libs/notification-rule/selectors';
import { fetchResolvedGenericTags as fetchResolvedGenericTagsAction } from '#libs/notification-rule/actions';

// MEMBER
import {
  fetchCommunicationsPaginatedMembers,
  fetchMemberBulkById as fetchMemberBulkByIdAction,
} from '#libs/member/actions';
import { getPaginatedMembers } from '#libs/member/selectors';
import { MAX_DISPLAY, PAGINATION_SIZE_RECIPIENTS } from './constants';

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
  sendCommunication: (
    data: MessageData,
    memberSelectedCategories: number[],
    option: OptionCallback,
  ) => void;
  fetchPaginatedAvailableRecipientMemberList: (
    page: number,
    memberSelectedCategories?: number[],
  ) => void;
};

const connector = connect(
  (state: RootState) => ({
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
    countAvailableRecipientsTotal: state.member.communication.countTotal,
    countAvailableRecipientsWithEmail:
      state.member.communication.countWithEmail,
    countAvailableRecipientsWithPhone:
      state.member.communication.countWithPhone,
    recipientsModalMemberList: getPaginatedMembers(state),
    loadingRecipientsModalMemberList: state.member.communication.loading,
    resolvedGenericTags: getResolvedGenericTags(state),
  }),
  {
    fetchCommunicationSentList: fetchCommunicationSentListAction,
    fetchCommunicationRecipientList: fetchCommunicationRecipientListAction,
    fetchEmailDetail: emailTemplateComplete,
    fetchEmailSummaryList: emailTemplatesSummaries,
    fetchPaginatedMemberList: fetchCommunicationsPaginatedMembers,
    sendCommunicationAction: sendCommunication,
    fetchMemberBulkById: fetchMemberBulkByIdAction,
    fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
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
            context_identifier: props.contextIdentifier,
            context_object_id: props.contextObjectId,
            from_chat: true,
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
      fetchPaginatedAvailableRecipientMemberList:
        (props: CommunicationConnectedProps) =>
        (page: number, memberSelectedCategories?: number[]) => {
          return props.fetchPaginatedMemberList({
            ...getFormatedQueryParamsFromContext(
              props.contextIdentifier,
              props.contextObjectId,
              memberSelectedCategories || [],
            ),
            page_size: PAGINATION_SIZE_RECIPIENTS,
            page,
            ignore_ids: true,
            reset: props.countAvailableRecipientsTotal === 0,
          });
        },
      sendCommunication:
        (props: CommunicationConnectedProps) =>
        (
          data: MessageData,
          memberSelectedCategories: number[],
          option: OptionCallback,
        ) => {
          const dataWithContext = {
            ...data,
            ...(props.contextMember
              ? { members: [props.contextMember.id] }
              : {}),
            context_identifier: props.contextIdentifier,
            context_object_id: props.contextObjectId,
            member_filters: {
              ...getFormatedQueryParamsFromContext(
                props.contextIdentifier,
                props.contextObjectId,
                memberSelectedCategories,
              ),
            },
          };
          return props.sendCommunicationAction(dataWithContext, option);
        },
    }),
  )(WrappedComponent);
}
