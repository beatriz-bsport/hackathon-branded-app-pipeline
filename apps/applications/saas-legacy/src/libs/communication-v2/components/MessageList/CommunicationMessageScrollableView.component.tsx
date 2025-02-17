import React, { memo, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import type { CommunicationMessage } from '#src/libs/communication-v2/types';
import type { Member } from '#src/libs/member/types';
import CommunicationMessageBubble from '#src/libs/communication-v2/components/MessageList/SingleMessage/CommunicationMessageBubble.component';
import useIsVisibleOnScreen from '#src/hooks/useIsVisibleOnScreen';

type Props = {
  messageList: Array<CommunicationMessage>;
  fetchOnEndScroll: () => void;
  oneToOneMessageMember: Member;
  loadingCommunicationMessageDataList: boolean;
  showCommunicationInformation: (communication?: CommunicationMessage) => void;
  showEmailTemplate: (title?: string, html?: string) => void;
  currentPage: number;
  scrollToBottomFlag: boolean;
  hasActiveFilters: boolean;
};

const OFFSET = 5;

const CommunicationMessageScrollableView = (props: Props) => {
  const { t } = useTranslation('communication');
  const classes = useStyles();

  const [_, currentElement, scrollRef] = useIsVisibleOnScreen<HTMLDivElement>(
    OFFSET,
    400,
    props.fetchOnEndScroll,
  );
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollToBottomListener, setScrollToBottomListener] = useState(false);
  const [previousNumberCommunication, setPreviousNumberCommunication] =
    useState((props.messageList ?? []).length);

  const pageHasChanged = props.currentPage !== currentPage;
  const needToScrollToBottom =
    props.scrollToBottomFlag !== scrollToBottomListener;
  const listIsEmpty = !(props.messageList ?? []).length;
  const listCountHasChanged =
    previousNumberCommunication !== (props.messageList ?? []).length;
  const scrollHeightHasChanged =
    !!scrollRef?.current &&
    previousScrollHeight !== scrollRef.current.scrollHeight; // means that the content has changed

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
    setPreviousNumberCommunication((props.messageList ?? []).length);
    setPreviousScrollHeight(scrollRef.current.scrollHeight);
    scrollRef.current.scrollTop =
      scrollRef.current.scrollHeight -
      scrollRef.current.getBoundingClientRect().height;
  }
  const sortedMessageList = props.messageList ?? [];

  return (
    <div ref={scrollRef} className={classes.scrollContainer}>
      <div ref={currentElement} />
      {props.loadingCommunicationMessageDataList &&
      sortedMessageList.length === 0 ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        sortedMessageList.map((threadCommunication: CommunicationMessage) => (
          <CommunicationMessageBubble
            key={threadCommunication.communication.uuid}
            communicationMessage={threadCommunication}
            oneToOneMessageMember={props.oneToOneMessageMember}
            onShowEmailTemplate={props.showEmailTemplate}
            onShowInformationClick={() =>
              props.showCommunicationInformation(threadCommunication)
            }
          />
        ))
      )}
      {!props.loadingCommunicationMessageDataList &&
        sortedMessageList.length === 0 && (
          <Typography className={classes.emptyLabel} variant="subtitle1">
            {t(
              `thread.emptyThread.${
                props.hasActiveFilters ? 'becauseOfFilters' : 'becauseNeverUsed'
              }`,
            )}
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
