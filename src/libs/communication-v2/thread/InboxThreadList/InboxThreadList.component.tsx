import React, { memo } from 'react';

import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import {
  CircularProgress,
  Fab,
  Typography,
  makeStyles,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useTranslation } from 'react-i18next';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import { OptionCallback } from '../../../../state/types';
import InboxThreadLookup from '#libs/communication-v2/thread/InboxThreadLookup';

import InboxThreadListRow from '#libs/communication-v2/thread/InboxThreadList/InboxThreadListRow.component';
import {
  CommunicationThreadWithUnreadAnswersCount,
  SelectFieldItem,
} from '#libs/communication-v2/types';

const HEIGHT_ITEM = 80;

export type Props = {
  threadList: CommunicationThreadWithUnreadAnswersCount[];
  switchFavoriteStatus: (id: number, options?: OptionCallback) => void;
  switchMutedStatus: (id: number, options?: OptionCallback) => void;
  switchDisabledStatus: (id: number, options?: OptionCallback) => void;
  flagAsUnread: (id: number, options?: OptionCallback) => void;
  selectedThreadId: number;
  handleOnItemClick: (threadId?: number, hasBeenRead?: boolean) => void;
  loadMoreItems: (nextPage?: number, count?: number) => void;
  searchThread: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

  return (
    <>
      <InboxThreadLookup
        searchThread={searchThread}
        filterValue={filterValue}
        handleFilterChange={handleFilterChange}
        handleContextThreadChange={handleContextThreadChange}
        createNewThread={createNewThread}
        contextSelected={contextSelected}
      />
      <div
        className={classes.list}
        style={{
          minHeight: threadsLength * HEIGHT_ITEM,
        }}
      >
        {!isListLoading && !count && (
          <div className={classes.loading}>
            <Fab variant="extended" className={classes.fab} disabled>
              <InfoOutlinedIcon className={classes.icon} color="action" />
              <Typography variant="body1" color="textPrimary">
                {t('thread.noThread')}
              </Typography>
            </Fab>
          </div>
        )}

        <AutoSizer>
          {(dimensions: { height: number; width: number }) => (
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
          )}
        </AutoSizer>
      </div>

      {!!nextPage && (
        <div className={classes.loading}>
          <Fab
            variant="extended"
            onClick={() => loadMoreItems(nextPage, count)}
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
  );
};

const useStyles = makeStyles((theme) => ({
  list: {
    flex: 1,
    height: '100%',
    [theme.breakpoints.down('md')]: {
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
    },
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
