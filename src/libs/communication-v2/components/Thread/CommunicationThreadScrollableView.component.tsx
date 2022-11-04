import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import useIsVisibleOnScreen from '../../../../hooks/useIsVisibleOnScreen';
import CommunicationThreadMessageBubble from './SingleMessage/CommunicationThreadMessageBubble.component';
import { ThreadCommunication } from '#libs/communication-v2/types';
import { Member } from '#libs/member/types';
import { ResolvedGenericTags } from '#libs/email-editor/types';

type Props = {
  threadCommunicationList: Array<ThreadCommunication>;
  fetchOnEndScroll: () => void;
  oneToOneThreadMember: Member;
  loadingThreadDataList: boolean;
  showCommunicationInformation: (communication?: ThreadCommunication) => void;
  showEmailTemplate: (title?: string, html?: string) => void;
  currentPage: number;
  resolvedGenericTags: ResolvedGenericTags;
  scrollToBottom: boolean;
};

const OFFSET = 5;

const CommunicationThreadScrollableView = (props: Props) => {
  const classes = useStyles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, currentElement, scrollRef] = useIsVisibleOnScreen<HTMLDivElement>(
    OFFSET,
    400,
    props.fetchOnEndScroll,
  );
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollToBottomListener, setScrollToBottomListener] = useState(false);
  const [previousNumberCommunication, setPreviousNumberCommunication] =
    useState((props.threadCommunicationList || []).length);
  if (
    (props.currentPage !== currentPage ||
      (props.currentPage === 1 &&
        props.scrollToBottom === scrollToBottomListener)) &&
    !!scrollRef?.current &&
    (props.threadCommunicationList || []).length &&
    previousScrollHeight !== scrollRef.current.scrollHeight
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
  if (
    props.scrollToBottom !== scrollToBottomListener &&
    !!scrollRef?.current &&
    previousNumberCommunication !==
      (props.threadCommunicationList || []).length &&
    previousScrollHeight !== scrollRef.current.scrollHeight
  ) {
    setScrollToBottomListener(!scrollToBottomListener);
    setPreviousNumberCommunication(
      (props.threadCommunicationList || []).length,
    );
    setPreviousScrollHeight(scrollRef.current.scrollHeight);
    scrollRef.current.scrollTop =
      scrollRef.current.scrollHeight -
      scrollRef.current.getBoundingClientRect().height;
  }
  const sortedThreadList = props.threadCommunicationList ?? [];

  return (
    <div ref={scrollRef} className={classes.scrollContainer}>
      <div ref={currentElement} />
      <div className={classes.loadingMoreContainer}>
        {props.loadingThreadDataList && sortedThreadList.length > 0 ? (
          <CircularProgress />
        ) : (
          <></>
        )}
      </div>
      {props.loadingThreadDataList && sortedThreadList.length === 0 ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        sortedThreadList.map((threadCommunication: ThreadCommunication) => (
          <CommunicationThreadMessageBubble
            key={threadCommunication.communication.uuid}
            threadCommunication={threadCommunication}
            onShowInformationClick={() =>
              props.showCommunicationInformation(threadCommunication)
            }
            onShowEmailTemplate={props.showEmailTemplate}
            oneToOneThreadMember={props.oneToOneThreadMember}
            resolvedGenericTags={props.resolvedGenericTags}
          />
        ))
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
  loadingMoreContainer: {
    zIndex: 100,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    background: `linear-gradient(0deg, #fff0, ${theme.palette.background.paper})`,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    left: theme.spacing(3),
    right: theme.spacing(3),
    flexDirection: 'row',
    display: 'flex',
    position: 'absolute',
  },
  scrollContainer: {
    display: 'flex',
    flex: '1 0 0',
    flexDirection: 'column',
    overflowY: 'scroll',
    [theme.breakpoints.down('sm')]: {
      paddingRight: theme.spacing(1.5),
    },
  },
}));

export default CommunicationThreadScrollableView;
