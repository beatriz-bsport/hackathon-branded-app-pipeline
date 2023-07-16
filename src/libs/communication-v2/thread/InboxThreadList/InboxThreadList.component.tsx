import React, { memo, useCallback, useRef } from 'react';

import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useTranslation } from 'react-i18next';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import type { OptionCallback } from '../../../../state/types';
import InboxThreadLookup from '#libs/communication-v2/thread/InboxThreadLookup';

import InboxThreadListRow from '#libs/communication-v2/thread/InboxThreadList/InboxThreadListRow.component';
import type {
  CommunicationThread,
  CommunicationThreadWithUnreadAnswersCount,
  SelectFieldItem,
} from '#libs/communication-v2/types';

const HEIGHT_ITEM = 80;
const APP_BAR_HEIGHT = 64;

export type Props = {
  threadList: CommunicationThreadWithUnreadAnswersCount[];
  switchFavoriteStatus: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  switchMutedStatus: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  switchDisabledStatus: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  flagAsUnread: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  selectedThreadId: number;
  handleOnItemClick: (threadId?: number, hasBeenRead?: boolean) => void;
  loadMoreItems: (nextPage?: number, count?: number) => void;
  searchThread: (search: string) => void;
  filterValue: SelectFieldItem;
  handleFilterChange: (value: SelectFieldItem) => void;
  handleContextThreadChange: (context: ChatThreadKinds) => void;
  createNewThread: () => void;
  contextSelected: ChatThreadKinds;
  isListLoading: boolean;
  nextPage?: number;
  count?: number;
};

const InboxThreadList: React.FC<Props> = ({
  threadList,
  switchFavoriteStatus,
  switchMutedStatus,
  switchDisabledStatus,
  flagAsUnread,
  selectedThreadId,
  handleOnItemClick,
  loadMoreItems,
  searchThread,
  filterValue,
  handleFilterChange,
  handleContextThreadChange,
  createNewThread,
  contextSelected,
  isListLoading,
  nextPage,
  count,
}) => {
  const { t } = useTranslation('communication');

  const classes = useStyles();

  const threadsLength = threadList?.length;

  const ref = useRef(null);

  // Size of the component InboxThreadLookup on the screen
  const lookupHeight = ref?.current?.getBoundingClientRect()?.height;

  // Maximum height available for the thread list
  const maxHeight = `calc(100vh - ${lookupHeight}px - ${APP_BAR_HEIGHT}px)`;

  // Minimum height of the thread list, necessary to the autosizer
  const minHeight = threadList.length * HEIGHT_ITEM;

  const handleLoadMoreItems = useCallback(
    () => loadMoreItems(nextPage, count),
    [count, loadMoreItems, nextPage],
  );

  return (
    <div className={classes.listContainer}>
      <div ref={ref}>
        <InboxThreadLookup
          searchThread={searchThread}
          filterValue={filterValue}
          handleFilterChange={handleFilterChange}
          handleContextThreadChange={handleContextThreadChange}
          createNewThread={createNewThread}
          contextSelected={contextSelected}
        />
      </div>
      <div
        className={classes.list}
        style={{
          maxHeight,
        }}
      >
        {!isListLoading && !count && (
          <div className={classes.loading}>
            <Fab variant="extended" className={classes.fab} disabled>
              <InfoOutlinedIcon className={classes.icon} color="action" />
              <Typography variant="body1" color="textPrimary">
                {t('thread.noThread.list')}
              </Typography>
            </Fab>
          </div>
        )}

        <div
          className={classes.autoSizer}
          style={{
            minHeight,
          }}
        >
          <AutoSizer>
            {(dimensions: { height: number; width: number }) => (
              <>
                <FixedSizeList
                  height={dimensions.height}
                  itemCount={threadsLength}
                  itemSize={HEIGHT_ITEM}
                  width={dimensions.width}
                >
                  {(props: { index: number; style: React.CSSProperties }) => (
                    <InboxThreadListRow
                      index={props.index}
                      style={props.style}
                      switchFavoriteStatus={switchFavoriteStatus}
                      switchMutedStatus={switchMutedStatus}
                      switchDisabledStatus={switchDisabledStatus}
                      flagAsUnread={flagAsUnread}
                      selectedThreadId={selectedThreadId}
                      handleOnItemClick={handleOnItemClick}
                      threadList={threadList}
                    />
                  )}
                </FixedSizeList>

                {!!nextPage && (
                  <div
                    className={classes.loading}
                    style={{ width: dimensions.width }}
                  >
                    <Fab
                      variant="extended"
                      onClick={handleLoadMoreItems}
                      className={classes.fab}
                    >
                      {isListLoading ? (
                        <CircularProgress className={classes.icon} size={30} />
                      ) : (
                        <ExpandMoreIcon className={classes.icon} />
                      )}
                      <Typography variant="subtitle1">
                        {t('thread.loadMoreThreads')}
                      </Typography>
                    </Fab>
                  </div>
                )}
              </>
            )}
          </AutoSizer>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  listContainer: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    overflow: 'visible',
    [theme.breakpoints.up('lg')]: {
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
  },
  list: {
    flex: 4,
    [theme.breakpoints.down('md')]: {
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
    },
    overflowY: 'auto',
    // Safari, Chrom, Opera : hide scrollbar
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    // Ie and Edge : hide scrollbar
    '-ms-overflow-style': 'none',
    // Firefox : hide scrollbar
    scrollbarWidth: 'none',
  },
  autoSizer: {
    flex: 1,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
  },
  fab: {
    textTransform: 'none',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

export default memo(InboxThreadList);
