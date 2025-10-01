import React, { memo, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import type { CommunicationMessage } from '#src/libs/communication-v2/types';
import CommunicationMessageBubble from '#src/libs/communication-v2/components/MessageList/SingleMessage/CommunicationMessageBubble.component';
import useIsVisibleOnScreen from '#src/hooks/useIsVisibleOnScreen';
import { useMessageList } from '#src/libs/communication-v2/hooks/useMessageList.hooks';

type Props = {
  fetchOnEndScroll: () => void;
  showCommunicationInformation: (communication: CommunicationMessage) => void;
  showEmailTemplate: (title: string, html: string) => void;
  currentPage: number;
  scrollToBottomFlag: boolean;
  hasActiveFilters: boolean;
};

const OFFSET = 5;

const CommunicationMessageScrollableView = (props: Props) => {
  const { loadingMessageList, messageList } = useMessageList();
  const messageListLength = (messageList || []).length;
  const [_, currentElement, scrollRef] = useIsVisibleOnScreen<HTMLDivElement>(
    OFFSET,
    400,
    props.fetchOnEndScroll,
  );
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollToBottomListener, setScrollToBottomListener] = useState(false);
  const [previousNumberCommunication, setPreviousNumberCommunication] =
    useState(messageListLength);

  const pageHasChanged = props.currentPage !== currentPage;
  const needToScrollToBottom =
    props.scrollToBottomFlag !== scrollToBottomListener;
  const listIsEmpty = messageListLength === 0;
  const listCountHasChanged = previousNumberCommunication !== messageListLength;
  const scrollHeightHasChanged =
    !!scrollRef?.current &&
    previousScrollHeight !== scrollRef.current.scrollHeight; // means that the content has changed

  const { t } = useTranslation('communication');
  const classes = useStyles();

  if (
    (pageHasChanged || (props.currentPage === 1 && !needToScrollToBottom)) &&
    !listIsEmpty &&
    scrollHeightHasChanged
  ) {
    setCurrentPage(props.currentPage);
    if (props.currentPage === 1) {
      // When refreshing thread (on filter), go to bottom
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight -
        scrollRef.current.getBoundingClientRect().height;
    } else {
      // When fetching more communication (added on top -> try to keep same position in the scroll view)
      const scrollTop =
        scrollRef.current.scrollHeight - previousScrollHeight + OFFSET;
      scrollRef.current.scrollTop = scrollTop;
    }
    setPreviousScrollHeight(scrollRef.current.scrollHeight);
  }
  // When a new communication has been sent and is displayed at the bottom -> go to bottom
  if (needToScrollToBottom && listCountHasChanged && scrollHeightHasChanged) {
    setScrollToBottomListener(!scrollToBottomListener);
    setPreviousNumberCommunication(messageListLength);
    setPreviousScrollHeight(scrollRef.current.scrollHeight);
    scrollRef.current.scrollTop =
      scrollRef.current.scrollHeight -
      scrollRef.current.getBoundingClientRect().height;
  }
  const sortedMessageList: CommunicationMessage[] = messageList || [];

  return (
    <div ref={scrollRef} className={classes.scrollContainer}>
      <div ref={currentElement} />
      {loadingMessageList && sortedMessageList.length === 0 ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        sortedMessageList.map((threadCommunication: CommunicationMessage) => (
          <CommunicationMessageBubble
            key={threadCommunication.communication.uuid}
            communicationMessage={threadCommunication}
            onShowEmailTemplate={props.showEmailTemplate}
            onShowInformationClick={props?.showCommunicationInformation}
          />
        ))
      )}
      {!loadingMessageList && sortedMessageList.length === 0 && (
        <Typography className={classes.emptyLabel} variant="subtitle1">
          {props.hasActiveFilters
            ? t('thread.emptyThread.becauseOfFilters')
            : t('thread.emptyThread.becauseNeverUsed')}
        </Typography>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  loadingContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
  },
  scrollContainer: {
    display: 'flex',
    flex: '1 0 0',
    flexDirection: 'column',
    overflowY: 'auto',
    [theme.breakpoints.down('sm')]: {
      paddingRight: theme.spacing(1.5),
    },
  },
  emptyLabel: {
    display: 'flex',
    flex: 1,
    width: '100%',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default memo(CommunicationMessageScrollableView);
