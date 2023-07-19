import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import uniq from 'lodash/uniq';
import type { Moment as MomentType } from 'moment-timezone';
import { withTranslation, WithTranslation } from 'react-i18next';
import type { OptionCallback } from '../../../../state/types';
import type { RootState } from '../../../../reducers';

// COMMUNICATION
import {
  fetchCommunicationRecipientList as fetchCommunicationRecipientListAction,
  fetchCommunicationSentList as fetchCommunicationSentListAction,
  sendCommunication,
  switchFavoriteStatus as switchFavoriteStatusAction,
  switchMutedStatus as switchMutedStatusAction,
  switchDisabledStatus as switchDisabledStatusAction,
  flagAsUnread as flagAsUnreadAction,
  flagAsRead as flagAsReadAction,
  fetchInboxThreadFromId as fetchInboxThreadFromIdAction,
  getUnreadAnswersCountFromThread as getUnreadAnswersCountFromThreadAction,
} from '#libs/communication-v2/actions';
import {
  getRecipientWithMemberPaginatedList,
  getCommunicationMessageList,
  getCommunicationMessageListHasNextPage,
  getCommunicationMessageListLoading,
  getMemberFromThreadId,
  getThreadsPaginationResults,
} from '#libs/communication-v2/selectors';
import {
  getFormatedFiltersToFetchCommunicationSent,
  getFormatedQueryParamsFromThread,
  getFormatedQueryParamsToFetchRecipientPaginatedList,
  getFiltersToEnableForThread,
} from '#libs/communication-v2/utils';
import type {
  Communication,
  FetchCommunicationParams,
  FilterState,
  MessageData,
  Recipient,
  InboxThreadRouterProps,
  SelectFieldItem,
  MessageParams,
} from '#libs/communication-v2/types';

// TEMPLATES
import {
  emailTemplateComplete,
  emailTemplatesSummaries,
} from '#libs/email-editor/actions';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#libs/email-editor/selectors';

// TAGS
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
  WRITE_EMAIL,
} from '#libs/communication-v2/constants';

// OFFER
import {
  getOfferBookingListWithConsumerPack,
  withStaffModificationHistory,
} from '#libs/booking/selectors';

import { fetchBookingsByOffer as fetchBookingsByOfferAction } from '#libs/booking/actions';
import { fetchByOffer as fetchBookingOptionByOfferAction } from '#libs/waiting-list/actions';
// THEME
import themeSelectors from '#libs/theme/selectors';

type NullableTimeout = ReturnType<typeof setTimeout> | null;

type InboxConnectedProps = InboxThreadRouterProps &
  WithState &
  ConnectedProps<typeof connector>;

type State = {
  messagePage: number;
  filters: number[];
  filterDateStart: number;
  filterDateEnd: number;
  showMessageWriter: boolean;
  communicationKindBeingWritten: number;
  displaySnackbar: boolean;
  scrollMessagesToBottomFlag: boolean;
  timeoutId: NullableTimeout;
  isFilterCollapseOpen: boolean;
  resetSmartlistMembersFetchForCommunication: boolean;
} & FilterState;

type WithState = {
  inboxContainerState: State;
  setInboxContainerState: (inboxState: State, options?: () => void) => void;
};

type WithHandlers = {
  fetchPageMessageList: (isRefreshingThread?: boolean) => void;
  fetchPageInformationRecipientList: (
    communication: Communication,
    page: number,
    memberSelectedCategories: number[],
  ) => void;
  sendCommunication: (
    data: MessageData,
    memberSelectedCategories: number[],
    option: OptionCallback & {
      storeInCallback: (communication: Communication) => boolean;
    },
  ) => void;
  fetchPaginatedAvailableRecipientMemberList: (
    page: number,
    memberSelectedCategories?: number[],
  ) => void;
  resetPaginatedAvailableRecipientMemberList: (options: OptionCallback) => void;
  flagAsReadAndUpdateUnreadCount: () => void;
  fetchObjectFromThread: () => void;
  goToThreadListPage: () => void;
  onCloseSnackbar: () => void;
  handleShowMessageWriter: () => void;
  onShowFilterModal: () => void;
  joinAllFilters: () => number[];
  kindFilterSetter: (values: SelectFieldItem[], options?: () => void) => void;
  recipientFilterSetter: (
    values: SelectFieldItem[],
    options?: () => void,
  ) => void;
  sendParameterFilterSetter: (
    values: SelectFieldItem[],
    options?: () => void,
  ) => void;
  srcOrDstFilterSetter: (
    values: SelectFieldItem[],
    options?: () => void,
  ) => void;
  dateStartSetter: (dateStart: MomentType, options?: () => void) => void;
  dateEndSetter: (dateStart: MomentType, options?: () => void) => void;
  setShowFilterModal: (showFilterModal: boolean, options?: () => void) => void;
  setCommunicationKindBeingWritten: (
    kind: number,
    options?: () => void,
  ) => void;
};

export type WithInboxThreadDataProps = InboxConnectedProps &
  WithHandlers &
  WithTranslation;

const connector = connect(
  (
    state: RootState,
    { selectedThreadId, contextSelected }: InboxThreadRouterProps,
  ) => ({
    // INBOX THREADS
    threadsById: state.communicationV2.inboxThread.byId,
    count: getThreadsPaginationResults(state, contextSelected)?.count,
    isThreadLoading: state.communicationV2.inboxThread.currentThread.loading,
    // MESSAGES
    messageList: getCommunicationMessageList(state),
    loadingMessageList: getCommunicationMessageListLoading(state),
    messageListHasNextPage: getCommunicationMessageListHasNextPage(state),
    // RECIPIENTS
    recipientList: getRecipientWithMemberPaginatedList(state),
    recipientListCount: state.communicationV2.recipient.count,
    loadingInformationRecipientList: state.communicationV2.recipient.loading,
    // TEMPLATES
    emailTemplateDetailList: getEmailTemplatesDetail(state),
    loadingEmailTemplateDetailList: state.emailTemplate.detail.loading,
    emailTemplateSummaryList: getAllEmailTemplatesSummaries(state),
    loadingEmailTemplateSummaryList: state.emailTemplate.loading,
    // MEMBERS
    contextMember: getMemberFromThreadId(state, selectedThreadId),
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
    // THEME
    theme: themeSelectors.getTheme(state),
    // OFFER BOOKINGS
    bookings: withStaffModificationHistory(getOfferBookingListWithConsumerPack)(
      state,
    ),
    bookingOptionsPending: state.waitingList.option.items,
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
    switchFavoriteStatus: switchFavoriteStatusAction,
    switchMutedStatus: switchMutedStatusAction,
    switchDisabledStatus: switchDisabledStatusAction,
    flagAsRead: flagAsReadAction,
    flagAsUnread: flagAsUnreadAction,
    fetchInboxThreadFromId: fetchInboxThreadFromIdAction,
    getUnreadAnswersCountFromThread: getUnreadAnswersCountFromThreadAction,
    goToThreadList: () => push(`/inbox/thread/`),
    goToDetailPage: (id: number) => push(`/inbox/thread/${id}/detail/`),
    fetchBookingsByOffer: fetchBookingsByOfferAction,
    fetchBookingOptionByOffer: fetchBookingOptionByOfferAction,
  },
);

export default function withInboxThreadData(
  WrappedComponent: React.ComponentType,
) {
  return compose(
    connector,
    withState('inboxContainerState', 'setInboxContainerState', {
      messagePage: 1,
      showMessageWriter: false,
      displaySnackbar: false,
      scrollMessagesToBottomFlag: false,
      communicationKindBeingWritten: WRITE_EMAIL,
      timeoutId: null,
      resetSmartlistMembersFetchForCommunication: true,
      // --- Filtering ---
      showFilterModal: false,
      filters: [],
      filterDateStart: null,
      filterDateEnd: null,
      dateStart: null,
      dateEnd: null,
      kindFilterValues: [],
      recipientFilterValues: [],
      sendParameterFilterValues: [],
      srcOrDstFilterValues: [],
      allPreviousFilters: {
        filters: [],
        dateStart: null,
        dateEnd: null,
      },
    }),
    withHandlers({
      fetchPageMessageList:
        (props: InboxConnectedProps) => (isRefreshingThread?: boolean) => {
          const params: FetchCommunicationParams = !!props.thread && {
            page: props.inboxContainerState.messagePage,
            ...getFormatedFiltersToFetchCommunicationSent(
              props.inboxContainerState.filters,
              props.inboxContainerState.filterDateStart,
              props.inboxContainerState.filterDateEnd,
            ),
            communication_thread: props.thread.id,
          };

          if (isRefreshingThread && params) {
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

          return (
            !!props.thread &&
            props.fetchCommunicationSentList(params, !!isRefreshingThread, {
              onSuccess,
            })
          );
        },
      fetchPageInformationRecipientList:
        (props: InboxConnectedProps) =>
        (
          communication: Communication,
          page: number,
          memberSelectedCategories?: number[],
        ) => {
          const recipientParams = props.contextMember
            ? { member_id__in: [props.contextMember.id] }
            : getFormatedQueryParamsToFetchRecipientPaginatedList(
                communication,
                memberSelectedCategories,
              );

          const params = {
            ...recipientParams,
            page_size: PAGINATION_SIZE_RECIPIENTS,
            page,
            communication_sent: communication.id,
          };

          const onSuccess = (data: Array<Recipient>) => {
            props.fetchMemberBulkById(
              data.map((recipient) => recipient.member),
            );
          };

          props.fetchCommunicationRecipientList(params, { onSuccess });
        },
      fetchPaginatedAvailableRecipientMemberList:
        (props: InboxConnectedProps) =>
        (page: number, memberSelectedCategories?: number[]) => {
          const contextFormatedQueryParams =
            props.thread &&
            getFormatedQueryParamsFromThread(
              props.thread.related_object_kind,
              props.thread.related_object_id,
              memberSelectedCategories || [],
            );

          return props.fetchPaginatedMemberList({
            ...contextFormatedQueryParams,
            page_size: PAGINATION_SIZE_RECIPIENTS,
            page,
            ignore_ids: true,
          });
        },
      resetPaginatedAvailableRecipientMemberList:
        (props: InboxConnectedProps) => (options: OptionCallback) => {
          props.fetchPaginatedMemberList(
            {
              reset: true,
            },
            options,
          );
        },
      sendCommunication:
        (props: InboxConnectedProps) =>
        (
          data: MessageData,
          memberSelectedCategories: number[],
          options: OptionCallback & {
            storeInCallback: (communication: Communication) => boolean;
          },
        ): void => {
          const member_filters = getFormatedQueryParamsFromThread(
            props.thread.related_object_kind,
            props.thread.related_object_id,
            memberSelectedCategories || [],
          );

          const dataWithContext: MessageParams = {
            ...data,
            member_filters: {
              ...member_filters,
            },
          };

          return props.sendCommunicationAction(dataWithContext, options);
        },
      flagAsReadAndUpdateUnreadCount:
        ({
          selectedThreadId,
          flagAsRead,
          thread,
          getUnreadAnswersCountFromThread,
        }) =>
        () => {
          if (thread) {
            if (thread.last_communication_has_been_read === false) {
              flagAsRead(selectedThreadId, {
                onSuccess: () =>
                  getUnreadAnswersCountFromThread(selectedThreadId),
              });
            }
          }
        },
      goToThreadListPage: (props: InboxConnectedProps) => () => {
        props.goToThreadList();
      },
      onCloseSnackbar: (props: InboxConnectedProps) => () => {
        props.setInboxContainerState({
          ...props.inboxContainerState,
          displaySnackbar: false,
        });
      },
      handleShowMessageWriter: (props: InboxConnectedProps) => () => {
        if (props.inboxContainerState.showMessageWriter) {
          props.setInboxContainerState({
            ...props.inboxContainerState,
            showMessageWriter: false,
          });
        } else {
          props.setInboxContainerState({
            ...props.inboxContainerState,
            showMessageWriter: true,
            showFilterModal: false,
          });
        }
      },
      onShowFilterModal: (props: InboxConnectedProps) => () => {
        if (props.inboxContainerState.showFilterModal) {
          props.setInboxContainerState({
            ...props.inboxContainerState,
            showFilterModal: false,
          });
        } else {
          props.setInboxContainerState({
            ...props.inboxContainerState,
            showFilterModal: true,
            showMessageWriter: false,
          });
        }
      },
      joinAllFilters: (props: InboxConnectedProps) => () => {
        const filtersNumbers: number[] = [];
        const {
          hasKindFilter,
          hasSrcOrDstFilter,
          hasRecipientFilter,
          hasSendParameterFilter,
        } = getFiltersToEnableForThread(props.thread.related_object_kind);
        if (
          hasKindFilter &&
          props.inboxContainerState.kindFilterValues.length
        ) {
          props.inboxContainerState.kindFilterValues.forEach(
            (item: SelectFieldItem) => filtersNumbers.push(item.value),
          );
        }
        if (
          hasRecipientFilter &&
          props.inboxContainerState.recipientFilterValues.length
        ) {
          props.inboxContainerState.recipientFilterValues.forEach(
            (item: SelectFieldItem) => filtersNumbers.push(item.value),
          );
        }
        if (
          hasSendParameterFilter &&
          props.inboxContainerState.sendParameterFilterValues.length
        ) {
          props.inboxContainerState.sendParameterFilterValues.forEach(
            (item: SelectFieldItem) => filtersNumbers.push(item.value),
          );
        }

        if (
          hasSrcOrDstFilter &&
          props.inboxContainerState.srcOrDstFilterValues.length
        ) {
          props.inboxContainerState.srcOrDstFilterValues.forEach(
            (item: SelectFieldItem) => filtersNumbers.push(item.value),
          );
        }

        props.setInboxContainerState({
          ...props.inboxContainerState,
          showFilterModal: false,
          allPreviousFilters: {
            filters: filtersNumbers,
            dateStart: props.inboxContainerState.dateStart?.unix() ?? null,
            dateEnd: props.inboxContainerState.dateEnd?.unix() ?? null,
          },
        });

        return filtersNumbers;
      },
      // --- Filter Setters ---
      kindFilterSetter:
        (props: InboxConnectedProps) =>
        (values: SelectFieldItem[], options?: () => void) => {
          props.setInboxContainerState(
            {
              ...props.inboxContainerState,
              kindFilterValues: values,
            },
            options,
          );
        },
      recipientFilterSetter:
        (props: InboxConnectedProps) =>
        (values: SelectFieldItem[], options?: () => void) => {
          props.setInboxContainerState(
            {
              ...props.inboxContainerState,
              recipientFilterValues: values,
            },
            options,
          );
        },
      sendParameterFilterSetter:
        (props: InboxConnectedProps) =>
        (values: SelectFieldItem[], options?: () => void) => {
          props.setInboxContainerState(
            {
              ...props.inboxContainerState,
              sendParameterFilterValues: values,
            },
            options,
          );
        },
      srcOrDstFilterSetter:
        (props: InboxConnectedProps) =>
        (values: SelectFieldItem[], options?: () => void) => {
          props.setInboxContainerState(
            {
              ...props.inboxContainerState,
              srcOrDstFilterValues: values,
            },
            options,
          );
        },
      dateStartSetter:
        (props: InboxConnectedProps) =>
        (dateStart: MomentType, options?: () => void) => {
          props.setInboxContainerState(
            {
              ...props.inboxContainerState,
              dateStart,
            },
            options,
          );
        },
      dateEndSetter:
        (props: InboxConnectedProps) =>
        (dateEnd: MomentType, options?: () => void) => {
          props.setInboxContainerState(
            {
              ...props.inboxContainerState,
              dateEnd,
            },
            options,
          );
        },
      setShowFilterModal:
        (props: InboxConnectedProps) =>
        (showFilterModal: boolean, options?: () => void) => {
          props.setInboxContainerState(
            {
              ...props.inboxContainerState,
              showFilterModal,
            },
            options,
          );
        },
      setCommunicationKindBeingWritten:
        (props: InboxConnectedProps) =>
        (kind: number, options?: () => void) => {
          props.setInboxContainerState(
            {
              ...props.inboxContainerState,
              communicationKindBeingWritten: kind,
            },
            options,
          );
        },
    }),
    withTranslation('communication'),
  )(WrappedComponent);
}
