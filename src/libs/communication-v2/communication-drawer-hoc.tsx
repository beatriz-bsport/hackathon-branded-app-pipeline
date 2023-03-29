import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import uniq from 'lodash/uniq';
import { UNREAD_COMMUNICATION } from '@bsport/common/lib/master-data/alerting_kind';
import { OptionCallback } from '../../state/types';
import type { RootState } from '../../reducers';

// COMMUNICATION
import {
  fetchCommunicationRecipientList as fetchCommunicationRecipientListAction,
  fetchCommunicationSentList as fetchCommunicationSentListAction,
  sendCommunication,
  flagAllUnreadCommunicationsAsReadInContext as flagAllUnreadCommunicationsAsReadInContextAction,
  getUnreadAnswersCount as getUnreadAnswersCountAction,
} from './actions';
import { fetch as fetchAction } from '#libs/alerting/actions';
import {
  getRecipientWithMemberPaginatedList,
  getThreadCommunicationList,
  getThreadCommunicationListHasNextPage,
  getThreadCommunicationListLoading,
} from './selectors';
import {
  getFormatedFiltersToFetchCommunicationSent,
  getFormatedQueryParamsFromContext,
  getFormatedQueryParamsToFetchRecipientPaginatedList,
} from './utils';
import { Communication, MessageData, DrawerProps, Recipient } from './types';

// TEMPLATES
import {
  emailTemplateComplete,
  emailTemplatesSummaries,
} from '#libs/email-editor/actions';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#libs/email-editor/selectors';
import {
  getResolvedGenericTags,
  getTagCategories,
} from '#libs/notification-rule/selectors';
import {
  fetchResolvedGenericTags as fetchResolvedGenericTagsAction,
  fetchTagList as fetchTagListAction,
} from '#libs/notification-rule/actions';

// MEMBER
import {
  fetchCommunicationsPaginatedMembers,
  fetchMemberBulkById as fetchMemberBulkByIdAction,
} from '#libs/member/actions';
import { getPaginatedMembers } from '#libs/member/selectors';
import {
  MAX_DISPLAY,
  PAGINATION_SIZE_RECIPIENTS,
  REFRESH_THREAD_PAGINATION_SIZE,
} from './constants';

import themeSelectors from '#libs/theme/selectors';

type CommunicationConnectedProps = ConnectedProps<typeof connector> &
  DrawerProps;

export type WithCommunicationDataProps = CommunicationConnectedProps &
  WithHandlers;

type WithHandlers = {
  fetchPageThreadCommunicationList: (
    page: number,
    filters: number[],
    dateStart: number,
    dateEnd: number,
    isRefreshingThread?: boolean,
  ) => void;
  fetchPageInformationRecipientList: (
    communication: Communication,
    page: number,
    memberSelectedCategories: number[],
  ) => void;
  sendCommunication: (
    data: MessageData,
    memberSelectedCategories: number[],
    option: OptionCallback<void> & {
      storeInCallback: (communication: Communication) => boolean;
    },
  ) => void;
  fetchPaginatedAvailableRecipientMemberList: (
    page: number,
    memberSelectedCategories?: number[],
  ) => void;
  resetPaginatedAvailableRecipientMemberList: (options: OptionCallback) => void;
  flagAllUnreadCommunicationsAsRead: () => void;
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
    informationRecipientListCount: state.communicationV2.recipient.count,
    loadingInformationRecipientList: state.communicationV2.recipient.loading,
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
    // TAGS
    resolvedGenericTags: getResolvedGenericTags(state),
    tagCategories: getTagCategories(state),
    theme: themeSelectors.getTheme(state),
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
    fetchTagList: fetchTagListAction,
    fetchUnreadCommunicationAction: fetchAction,
    flagAllUnreadCommunicationsAsReadInContextAction,
    getUnreadAnswersCountAction,
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
          isRefreshingThread?: boolean,
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
          };
          if (isRefreshingThread) {
            params.page_size = REFRESH_THREAD_PAGINATION_SIZE;
          }

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
          return props.fetchCommunicationSentList(
            params,
            !!isRefreshingThread,
            {
              onSuccess,
            },
          );
        },
      fetchPageInformationRecipientList:
        ({
          fetchCommunicationRecipientList,
          fetchMemberBulkById,
          contextMember,
        }) =>
        (
          communication: Communication,
          page: number,
          memberSelectedCategories?: number[],
        ) => {
          const params = {
            ...(contextMember
              ? { member_id__in: [contextMember.id] }
              : getFormatedQueryParamsToFetchRecipientPaginatedList(
                  communication,
                  memberSelectedCategories,
                )),
            page_size: PAGINATION_SIZE_RECIPIENTS,
            page,
            communication_sent: communication.id,
          };
          const onSuccess = (data: Array<Recipient>) => {
            fetchMemberBulkById(data.map((recipient) => recipient.member));
          };
          fetchCommunicationRecipientList(params, { onSuccess });
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
          });
        },
      resetPaginatedAvailableRecipientMemberList:
        (props: CommunicationConnectedProps) => (options: OptionCallback) => {
          props.fetchPaginatedMemberList(
            {
              reset: true,
            },
            options,
          );
        },
      sendCommunication:
        (props: CommunicationConnectedProps) =>
        (
          data: MessageData,
          memberSelectedCategories: number[],
          options: OptionCallback<void> & {
            storeInCallback: (communication: Communication) => boolean;
          },
        ) => {
          const dataWithContext = {
            ...data,
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
          return props.sendCommunicationAction(dataWithContext, options);
        },
      flagAllUnreadCommunicationsAsRead:
        (props: CommunicationConnectedProps) => () => {
          const params = {
            context_identifier: props.contextIdentifier,
            context_object_id: props.contextObjectId,
          };
          props.flagAllUnreadCommunicationsAsReadInContextAction(params, {
            onSuccess: () => {
              props.fetchUnreadCommunicationAction(
                UNREAD_COMMUNICATION.alert_kind,
                1,
              );
              props.getUnreadAnswersCountAction(params);
            },
          });
        },
    }),
  )(WrappedComponent);
}
