// @ts-nocheck
import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
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
  scrollToBottomFlag: boolean;
  hasActiveFilters: boolean;
};

const OFFSET = 5;

const CommunicationThreadScrollableView = (props: Props) => {
  const { t } = useTranslation('communication');
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

  const pageHasChanged = props.currentPage !== currentPage;
  const needToScrollToBottom =
    props.scrollToBottomFlag !== scrollToBottomListener;
  const listIsEmpty = !(props.threadCommunicationList || []).length;
  const listCountHasChanged =
    previousNumberCommunication !==
    (props.threadCommunicationList || []).length;
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
      {!props.loadingThreadDataList && sortedThreadList.length === 0 && (
        <Typography variant="subtitle1" className={classes.emptyLabel}>
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

export default CommunicationThreadScrollableView;
