import React, { useCallback, useEffect, useState } from 'react';
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

import {
  getConsentWarning,
  filterCommunicationThread,
} from '#src/libs/communication-v2/utils';

import type {
  Communication,
  DrawerProps,
  MessageData,
} from '#src/libs/communication-v2/types';
import type { OptionCallback } from '#src/state/types';

import {
  CONTEXT_NOTIFICATION,
  CONTEXT_MEMBER,
  PAGINATION_SIZE_RECIPIENTS,
  WRITE_EMAIL,
  REFRESH_THREAD_TIMEOUT,
} from '#src/libs/communication-v2/constants';
import {
  useSMSVerification,
  useTagsAndCategories,
  useTheme,
} from '#src/libs/communication-v2/hooks/useCommunicationsTools.hooks';
import {
  useMessageList,
  FetchMessageListParams,
} from '#src/libs/communication-v2/hooks/useMessageList.hooks';
import { useAvailableRecipients } from '#src/libs/communication-v2/hooks/useAvailableRecipients.hooks';
import {
  SendCommunicationParams,
  useCommunicationActions,
} from '#src/libs/communication-v2/hooks/useCommunicationsActions.hooks';

type NullableTimeout = ReturnType<typeof setTimeout> | null;

export type Props = DrawerProps & WithMobileDialog;

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
  allMemberCategoryList,
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

  const {
    fetchMessages,
    messageList,
    loadingMessageList,
    hasNextMessageListPage,
  } = useMessageList();
  const { fetchAvailableRecipients } = useAvailableRecipients({
    contextIdentifier,
    contextObjectId,
  });
  const { sendCommunication, flagAllUnreadCommunicationsAsRead } =
    useCommunicationActions({
      contextIdentifier,
      contextObjectId,
    });
  const { fetchTags } = useTagsAndCategories();
  const { theme } = useTheme();
  const { smsVerificationProvider } = useSMSVerification();

  const fetchMessageList = useCallback(() => {
    const params: FetchMessageListParams = {
      contextIdentifier,
      contextObjectId,
      page: messagePage,
      filters: communicationListFilters?.filters,
      dateStart: communicationListFilters?.dateStart,
      dateEnd: communicationListFilters?.dateEnd,
    };
    fetchMessages(params);
  }, [
    messagePage,
    communicationListFilters,
    fetchMessages,
    contextObjectId,
    contextIdentifier,
  ]);

  const fetchMoreMessages = useCallback(() => {
    if (hasNextMessageListPage) {
      setMessagePage((current) => current + 1);
    }
  }, [hasNextMessageListPage]);

  const refreshMessageList = useCallback(() => {
    const params: FetchMessageListParams = {
      contextIdentifier,
      contextObjectId,
      page: 1,
      filters: communicationListFilters?.filters,
      dateStart: communicationListFilters?.dateStart,
      dateEnd: communicationListFilters?.dateEnd,
      isRefreshing: true,
    };
    fetchMessages(params);
  }, [
    communicationListFilters,
    fetchMessages,
    contextObjectId,
    contextIdentifier,
  ]);

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
      const params: SendCommunicationParams = {
        data,
        memberSelectedCategories,
        options: {
          ...options,
          storeInCallback,
        },
      };
      sendCommunication(params);
    },
    [communicationListFilters, sendCommunication],
  );

  useEffect(() => {
    scheduleRefreshMessageList();
    return () => {
      if (intervalTimeoutId) {
        clearInterval(intervalTimeoutId);
      }
    };
  }, [scheduleRefreshMessageList, intervalTimeoutId]);

  useEffect(() => {
    fetchTags();
    flagAllUnreadCommunicationsAsRead();
  }, [fetchTags, flagAllUnreadCommunicationsAsRead]);

  useEffect(() => {
    const fetchAvailableRecipientsParams = {
      page: 1,
    };

    fetchMessageList();
    fetchAvailableRecipients(fetchAvailableRecipientsParams);
  }, [
    communicationListFilters,
    messagePage,
    contextObjectId,
    fetchMessageList,
    fetchAvailableRecipients,
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
    !smsVerificationProvider?.isVerified &&
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
          fullScreen={fullScreen}
          hasActiveFilters={
            !!communicationListFilters.dateStart ||
            !!communicationListFilters.dateEnd ||
            !!communicationListFilters.filters.length
          }
          loadingCommunicationMessageDataList={loadingMessageList}
          messageList={messageList}
          paginationSize={PAGINATION_SIZE_RECIPIENTS}
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
              directMember={
                contextIdentifier === CONTEXT_MEMBER && contextMember
              }
              fullScreen={fullScreen}
              pageSize={PAGINATION_SIZE_RECIPIENTS}
              sendCommunication={sendCommunicationCallback}
              setCommunicationKind={setCommunicationKindBeingWritten}
            />
          </Collapse>
        </div>
      )}
    </GenericResponsiveDrawer>
  );
};

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

export default withMobileDialog()(CommunicationDrawer);
