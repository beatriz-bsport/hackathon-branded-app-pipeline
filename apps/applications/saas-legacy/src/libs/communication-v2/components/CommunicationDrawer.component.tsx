import React, { useCallback, useEffect, useState } from 'react';
import { compose } from 'recompose';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  withMobileDialog,
  WithMobileDialog,
  makeStyles,
} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import Slide, { SlideProps } from '@material-ui/core/Slide';
import Alert from '@material-ui/lab/Alert';
import { KeyboardArrowDown, Send } from '@material-ui/icons';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_SMS,
} from '@bsport/common/lib/master-data/communication-kind.js';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import CommunicationHeader from '#src/libs/communication-v2/components/CommunicationHeader.component';
import CommunicationFilterContainer from '#src/libs/communication-v2/components/Filter/CommunicationFilterContainer.component';
import CommunicationMessageListContainer from '#src/libs/communication-v2/components/MessageList/CommunicationMessageListContainer.component';
import CommunicationSendMessageContainer from '#src/libs/communication-v2/components/MessageSender/CommunicationSendMessageContainer.component';
import withCommunicationData, {
  WithCommunicationDataProps,
} from '#src/libs/communication-v2/communication-drawer-hoc';

import {
  getConsentWarning,
  filterCommunicationThread,
} from '#src/libs/communication-v2/utils';

import {
  DrawerProps,
  Communication,
  MessageData,
} from '#src/libs/communication-v2/types';
import { OptionCallback } from '#src/state/types';

import {
  CONTEXT_NOTIFICATION,
  CONTEXT_MEMBER,
  PAGINATION_SIZE_RECIPIENTS,
  WRITE_EMAIL,
  REFRESH_THREAD_TIMEOUT,
} from '#src/libs/communication-v2/constants';
import { getCommunicationSMSProviderVerificationState } from '#src/libs/communication-v2/selectors';
import type { RootState } from '#src/reducers';

type NullableTimeout = ReturnType<typeof setTimeout> | null;

export type Props = WithCommunicationDataProps &
  WithMobileDialog &
  ConnectedProps<typeof connector>;

export type CommunicationListFilters = {
  filters: number[];
  dateStart: number | null;
  dateEnd: number | null;
};

export const CommunicationDrawer: React.FC<Props> = ({
  contextObjectId,
  propToListenToReloadRecipients,
  fullScreen,
  contextIdentifier,
  contextMember,
  contextTitle,
  openDrawer,
  onDrawerClose,
  fetchPageInformationRecipientList,
  informationRecipientList,
  informationRecipientListCount,
  loadingInformationRecipientList,
  loadingMessageList,
  messageList,
  emailTemplateDetailList,
  emailTemplateSummaryList,
  fetchEmailDetail,
  loadingRecipientsModalMemberList,
  loadingEmailTemplateDetailList,
  loadingEmailTemplateSummaryList,
  recipientsModalMemberList,
  resolvedGenericTags,
  theme,
  tagCategories,
  fetchPaginatedAvailableRecipientMemberList,
  fetchResolvedGenericTags,
  fetchTagList,
  flagAllUnreadCommunicationsAsRead,
  fetchPageMessageList,
  messageListHasNextPage,
  sendCommunication,
  allMemberCategoryList,
  countAvailableRecipientsTotal,
  countAvailableRecipientsWithEmail,
  countAvailableRecipientsWithPhone,
  fetchEmailSummaryList,
  resetPaginatedAvailableRecipientMemberList,
  communicationSMSProviderVerificationState,
}: Props) => {
  const [messagePage, setMessagePage] = useState(1);
  const [communicationListFilters, setCommunicationListFilters] =
    useState<CommunicationListFilters>({
      filters: [],
      dateStart: null,
      dateEnd: null,
    });
  const [showMessageWritter, setShowMessageWritter] = useState(false);
  const [communicationKindBeingWritten, setCommunicationKindBeingWritten] =
    useState(WRITE_EMAIL);
  const [displaySnackbar, setDisplaySnackbar] = useState(false);
  const [scrollToBottomFlag, setScrollToBottomFlag] = useState(false);
  const [intervalTimeoutId, setIntervalTimeoutId] =
    useState<NullableTimeout>(null);

  const fetchMessageList = useCallback(() => {
    fetchPageMessageList(
      messagePage,
      communicationListFilters?.filters,
      communicationListFilters?.dateStart,
      communicationListFilters?.dateEnd,
    );
  }, [messagePage, communicationListFilters, fetchPageMessageList]);

  const fetchMoreMessages = useCallback(() => {
    if (messageListHasNextPage) {
      setMessagePage((current) => current + 1);
    }
  }, [messageListHasNextPage]);

  const refreshMessageList = useCallback(() => {
    fetchPageMessageList(
      1,
      communicationListFilters.filters,
      communicationListFilters.dateStart,
      communicationListFilters.dateEnd,
      true,
    );
  }, [communicationListFilters, fetchPageMessageList]);

  const scheduleRefreshMessageList = useCallback(
    (forceRefresh?: boolean) => {
      if (!intervalTimeoutId || forceRefresh) {
        const intervalId = setInterval(() => {
          refreshMessageList();
        }, REFRESH_THREAD_TIMEOUT * 1000);
        setIntervalTimeoutId(intervalId);
      }
    },
    [refreshMessageList, intervalTimeoutId],
  );
  const { t } = useTranslation('communication');
  const classes = useStyles();

  const handleFilterChange = useCallback(
    ({
      filters,
      dateStart,
      dateEnd,
    }: {
      filters: number[];
      dateStart: number;
      dateEnd: number;
    }) => {
      clearTimeout(intervalTimeoutId);
      setMessagePage(1);
      setIntervalTimeoutId(null);
      setCommunicationListFilters(() => {
        const newCommunicationListFilters: CommunicationListFilters = {
          filters,
          dateStart,
          dateEnd,
        };
        return newCommunicationListFilters;
      });
    },
    [intervalTimeoutId],
  );

  const onCloseSnackbar = useCallback(() => {
    setDisplaySnackbar(displaySnackbar);
  }, [displaySnackbar]);

  const onShowMessageWriter = useCallback(() => {
    setShowMessageWritter((current) => !current);
  }, []);

  const sendCommunicationCallback = useCallback(
    (
      data: MessageData,
      memberSelectedCategories: number[],
      options: OptionCallback<void>,
    ) => {
      const storeInCallback = (communicationResponse: Communication) => {
        const filtersTmp = {
          numberFilters: communicationListFilters.filters,
          dateStartFilter: communicationListFilters.dateStart,
          dateEndFilter: communicationListFilters.dateEnd,
        };
        const filterOutNewCommunication = filterCommunicationThread(
          communicationResponse,
          filtersTmp,
        );
        if (filterOutNewCommunication) {
          setDisplaySnackbar(true);
        } else {
          setScrollToBottomFlag((current) => !current);
        }
        return filterOutNewCommunication;
      };
      sendCommunication(data, memberSelectedCategories, {
        ...options,
        storeInCallback,
      });
    },
    [communicationListFilters, sendCommunication],
  );

  useEffect(() => {
    fetchPaginatedAvailableRecipientMemberList(1);
    fetchMessageList();
    fetchResolvedGenericTags();
    fetchTagList();
    flagAllUnreadCommunicationsAsRead();
  }, [
    fetchMessageList,
    flagAllUnreadCommunicationsAsRead,
    fetchPaginatedAvailableRecipientMemberList,
    fetchResolvedGenericTags,
    fetchTagList,
  ]);

  useEffect(() => {
    scheduleRefreshMessageList();
    return () => {
      if (intervalTimeoutId) {
        clearInterval(intervalTimeoutId);
      }
    };
  }, [scheduleRefreshMessageList, intervalTimeoutId]);

  useEffect(() => {
    fetchMessageList();
    fetchPaginatedAvailableRecipientMemberList(1);
  }, [
    messagePage,
    contextObjectId,
    fetchMessageList,
    fetchPaginatedAvailableRecipientMemberList,
  ]);

  useEffect(() => {
    refreshMessageList();
  }, [communicationListFilters, refreshMessageList]);

  useEffect(() => {
    fetchPaginatedAvailableRecipientMemberList(1);
  }, [
    fetchPaginatedAvailableRecipientMemberList,
    propToListenToReloadRecipients,
  ]);

  const SlideTransition = (props: SlideProps) => (
    <Slide {...props} direction="left" />
  );

  const consentWarning =
    contextMember &&
    getConsentWarning(contextMember, communicationKindBeingWritten, t);
  const showMailProviderWarningContent: boolean =
    showMessageWritter &&
    communicationKindBeingWritten === COMMUNICATION_KIND_EMAIL &&
    !theme.is_two_way_email_activated;

  const showCommunicationSmsProviderNotVerifiedWarning =
    !communicationSMSProviderVerificationState.isVerified &&
    communicationKindBeingWritten === COMMUNICATION_KIND_SMS;

  return (
    <GenericResponsiveDrawer
      flexContent
      withoutHeaderContainer
      withoutPadding
      mobileMinWidth="350px"
      onClose={onDrawerClose}
      open={openDrawer}
    >
      <CommunicationHeader
        contextAvatar={contextMember?.photo}
        contextTitle={contextMember?.name || contextTitle}
        onDrawerClose={onDrawerClose}
      />
      <CommunicationFilterContainer
        contextIdentifier={contextIdentifier}
        handleFilters={handleFilterChange}
      />
      <div className={classes.messageListContainer}>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={5000}
          className={classes.snackbar}
          onClose={onCloseSnackbar}
          open={displaySnackbar}
          TransitionComponent={SlideTransition}
        >
          <Alert className={classes.snackbarContent} severity="info">
            {t('messageList.filterOutCommunicationSent')}
          </Alert>
        </Snackbar>
        <CommunicationMessageListContainer
          allMemberCategoryList={allMemberCategoryList}
          consentWarning={consentWarning}
          contextMember={contextMember}
          currentPage={messagePage}
          fetchMoreCommunicationMessages={fetchMoreMessages}
          fetchRecipientPaginatedList={fetchPageInformationRecipientList}
          fullScreen={fullScreen}
          hasActiveFilters={
            !!communicationListFilters.dateStart ||
            !!communicationListFilters.dateEnd ||
            !!communicationListFilters.filters.length
          }
          loadingCommunicationMessageDataList={loadingMessageList}
          loadingRecipientList={loadingInformationRecipientList}
          messageList={messageList}
          paginationSize={PAGINATION_SIZE_RECIPIENTS}
          recipientList={informationRecipientList}
          recipientListCount={informationRecipientListCount}
          resolvedGenericTags={resolvedGenericTags}
          scrollToBottomFlag={scrollToBottomFlag}
          showCommunicationSmsProviderNotVerifiedWarning={
            showCommunicationSmsProviderNotVerifiedWarning
          }
          showMailProviderWarningContent={showMailProviderWarningContent}
        />
      </div>
      {contextIdentifier !== CONTEXT_NOTIFICATION && (
        <div
          className={clsx(classes.sendMessageContainer, {
            [classes.sendMessageContainerWithIntercom]:
              !!theme && !theme.hide_intercom,
          })}
        >
          {showMessageWritter ? (
            <ButtonBase
              disableRipple
              disableTouchRipple
              onClick={onShowMessageWriter}
            >
              <KeyboardArrowDown className={classes.buttonIconClose} />
            </ButtonBase>
          ) : (
            <div className={classes.buttonMessageWriterContainer}>
              <ButtonBase
                disableRipple
                disableTouchRipple
                className={classes.buttonMessageWriter}
                onClick={onShowMessageWriter}
              >
                <Send fontSize="small" />
                <Typography className={classes.buttonText} variant="subtitle1">
                  {t('sendMessage.writeCommunication')}
                </Typography>
              </ButtonBase>
            </div>
          )}
          <Collapse in={showMessageWritter} timeout={500}>
            <CommunicationSendMessageContainer
              allMemberCategoryList={allMemberCategoryList}
              communicationKind={communicationKindBeingWritten}
              contextIdentifier={contextIdentifier}
              contextObjectId={contextObjectId}
              countAvailableRecipientsTotal={countAvailableRecipientsTotal}
              countAvailableRecipientsWithEmail={
                countAvailableRecipientsWithEmail
              }
              countAvailableRecipientsWithPhone={
                countAvailableRecipientsWithPhone
              }
              directMember={
                contextIdentifier === CONTEXT_MEMBER && contextMember
              }
              emailTemplateDetailList={emailTemplateDetailList}
              emailTemplateSummaryList={emailTemplateSummaryList}
              fetchEmailSummaryList={fetchEmailSummaryList}
              fetchPaginatedAvailableRecipientMemberList={
                fetchPaginatedAvailableRecipientMemberList
              }
              fullScreen={fullScreen}
              getEmailDetail={fetchEmailDetail}
              loadingPaginatedMemberList={loadingRecipientsModalMemberList}
              loadingTemplateDetailList={loadingEmailTemplateDetailList}
              loadingTemplateSummaryList={loadingEmailTemplateSummaryList}
              pageSize={PAGINATION_SIZE_RECIPIENTS}
              paginatedMemberList={recipientsModalMemberList}
              resetPaginatedAvailableRecipientMemberList={
                resetPaginatedAvailableRecipientMemberList
              }
              resolvedGenericTags={resolvedGenericTags}
              sendCommunication={sendCommunicationCallback}
              setCommunicationKind={setCommunicationKindBeingWritten}
              tagCategories={tagCategories}
            />
          </Collapse>
        </div>
      )}
    </GenericResponsiveDrawer>
  );
};

const connector = connect(
  (state: RootState) => ({
    communicationSMSProviderVerificationState:
      getCommunicationSMSProviderVerificationState(state),
  }),
  null,
);
const useStyles = makeStyles((theme) => ({
  buttonMessageWriter: {
    width: '100%',
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.spacing(3),
    borderColor: theme.palette.divider,
    borderWidth: '1px',
    borderStyle: 'solid',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  buttonMessageWriterContainer: {
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingBottom: theme.spacing(0.5),
    },
    color: theme.palette.grey[600],
  },
  buttonText: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  buttonIconClose: {
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(-1.5),
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: theme.spacing(1.5),
    color: theme.palette.background.default,
    backgroundColor: theme.palette.secondary.main,
  },
  sendMessageContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  sendMessageContainerWithIntercom: {
    [theme.breakpoints.down('md')]: {
      // generic responsive drawer full screen
      paddingBottom: theme.spacing(11),
    },
  },
  snackbar: {
    position: 'absolute',
    top: theme.spacing(1),
    width: 'fit-content',
  },
  snackbarContent: {
    boxShadow: '1px 2px 15px lightblue',
  },
  messageListContainer: {
    position: 'relative',
    display: 'flex',
    flex: 1,
  },
}));

export default compose<any, DrawerProps>(
  withMobileDialog(),
  connector,
  withCommunicationData,
)(CommunicationDrawer);
