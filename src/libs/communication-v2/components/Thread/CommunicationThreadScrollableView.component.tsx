import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import useIsVisibleOnScreen from '../../../../hooks/useIsVisibleOnScreen';
import CommunicationThreadMessageBubble from './SingleMessage/CommunicationThreadMessageBubble.component';
import { ThreadCommunication } from '#libs/communication-v2/types';
import { Member } from '#libs/member/types';

type Props = {
  threadCommunicationList: Array<ThreadCommunication>;
  fetchOnEndScroll: () => void;
  oneToOneThreadMember: Member;
  loadingThreadDataList: boolean;
  showCommunicationInformation: (communication?: ThreadCommunication) => void;
  showEmailTemplate: (title?: string, html?: string) => void;
  currentPage: number;
};

const OFFSET = 5;

const CommunicationThreadScrollableView = (props: Props) => {
  const classes = useStyles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, currentElement, scrollRef] = useIsVisibleOnScreen<HTMLDivElement>(
    OFFSET,
    100,
    props.fetchOnEndScroll,
  );
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0);
  if (
    scrollRef?.current &&
    previousScrollHeight !== scrollRef.current.scrollHeight
  ) {
    // a change in height happened => set the height so that we keep seing the same messages
    const scrollTop =
      scrollRef.current.scrollHeight - previousScrollHeight + OFFSET;
    scrollRef.current.scrollTop = scrollTop;
    setPreviousScrollHeight(scrollRef.current.scrollHeight);
  }

  const [currentPage, setCurrentPage] = useState(0);
  if (props.currentPage !== currentPage && !!scrollRef?.current) {
    setCurrentPage(props.currentPage);
    if (props.currentPage === 1) {
      // scroll to bottom
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight -
        scrollRef.current.getBoundingClientRect().height;
    }
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
            channel={threadCommunication.channel}
            communication={threadCommunication.communication}
            photos={threadCommunication.photos}
            onShowInformationClick={() =>
              props.showCommunicationInformation(threadCommunication)
            }
            onShowEmailTemplate={props.showEmailTemplate}
            oneToOneThreadMember={props.oneToOneThreadMember}
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
