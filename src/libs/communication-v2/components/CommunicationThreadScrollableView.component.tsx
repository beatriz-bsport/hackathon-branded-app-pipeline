import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import useIsVisibleOnScreen from '../../../hooks/useIsVisibleOnScreen';
import CommunicationThreadMessageBubble from './CommunicationThreadMessageBubble.component';

import { ThreadCommunication } from '../types';

type Props = {
  threadCommunicationList: Array<ThreadCommunication>;
  fetchOnEndScroll: () => void;
  isSingleRecipientThread: boolean;
  loadingThreadDataList: boolean;
  showCommunicationInformation: (communication?: ThreadCommunication) => void;
  showEmailTemplate: (title?: string, html?: string) => void;
};

const CommunicationThreadScrollableView = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, currentElement, scrollRef] = useIsVisibleOnScreen<HTMLDivElement>(
    30,
    500,
    props.fetchOnEndScroll,
  );
  const [previousHeight, setPreviousHeight] = useState(0);
  if (scrollRef?.current && previousHeight !== scrollRef.current.scrollHeight) {
    // a change in height happened => set the height so that we keep seing the same messages
    const scrollTop = scrollRef.current.scrollHeight - previousHeight;
    scrollRef.current.scrollTop = scrollTop;
    setPreviousHeight(scrollRef.current.scrollHeight);
  }
  const classes = useStyles();

  return (
    <div ref={scrollRef} className={classes.scrollContainer}>
      <div ref={currentElement}>
        {props.loadingThreadDataList &&
          props.threadCommunicationList?.length > 0 && ( // Means we are loading more data
            <div className={classes.loadingContainer}>
              <CircularProgress />
            </div>
          )}
      </div>
      {props.loadingThreadDataList &&
      props.threadCommunicationList?.length === 0 ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        props.threadCommunicationList?.map(
          (data: ThreadCommunication, index: number) => (
            <CommunicationThreadMessageBubble
              key={data.communication.uuid}
              channel={data.channel}
              communication={data.communication}
              photos={data.photos}
              onShowInformationClick={() =>
                props.showCommunicationInformation(data)
              }
              onShowEmailTemplate={props.showEmailTemplate}
              isSingleRecipientThread={props.isSingleRecipientThread}
              reverse={index % 2 === 0}
            />
          ),
        )
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
    overflowY: 'scroll',
    [theme.breakpoints.down('sm')]: {
      paddingRight: theme.spacing(1.5),
    },
  },
}));

export default CommunicationThreadScrollableView;
