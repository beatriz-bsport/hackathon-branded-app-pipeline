import React, { memo } from 'react';

import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import {
  CircularProgress,
  Fab,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useTranslation } from 'react-i18next';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import InboxThreadLookup from '#libs/communication-v2/thread/InboxThreadLookup';

import InboxThreadListRow from '#libs/communication-v2/thread/InboxThreadList/InboxThreadListRow.component';
import {
  CommunicationThread,
  SelectFieldItem,
} from '#libs/communication-v2/types';

const HEIGHT_ITEM = 80;

export type Props = {
  threadList: (CommunicationThread | null)[];
  switchFavoriteStatus: () => void;
  switchMutedStatus: () => void;
  switchDisabledStatus: () => void;
  markAsUnread: () => void;
  selectedThreadId: number;
  setSelectedThreadId: (threadId: number) => void;
  loadMoreItems: () => void;
  searchThread: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filterValue: SelectFieldItem;
  handleFilterChange: (value: SelectFieldItem) => void;
  fetchMemberThreads: () => void;
  fetchSmartlistThreads: () => void;
  fetchOfferThreads: () => void;
  createNewThread: () => void;
  contextSelected: ChatThreadKinds;
  setContextSelected: (context: ChatThreadKinds) => void;
  isListLoading: boolean;
  hasNextPage: boolean;
};

const InboxThreadList: React.FC<Props> = ({
  threadList,
  switchFavoriteStatus,
  switchMutedStatus,
  switchDisabledStatus,
  markAsUnread,
  selectedThreadId,
  setSelectedThreadId,
  loadMoreItems,
  searchThread,
  filterValue,
  handleFilterChange,
  fetchMemberThreads,
  fetchSmartlistThreads,
  fetchOfferThreads,
  createNewThread,
  contextSelected,
  setContextSelected,
  isListLoading,
  hasNextPage,
}) => {
  const { t } = useTranslation('communication');

  const classes = useStyles();

  return (
    <>
      <InboxThreadLookup
        searchThread={searchThread}
        filterValue={filterValue}
        handleFilterChange={handleFilterChange}
        fetchMemberThreads={fetchMemberThreads}
        fetchSmartlistThreads={fetchSmartlistThreads}
        fetchOfferThreads={fetchOfferThreads}
        createNewThread={createNewThread}
        contextSelected={contextSelected}
        setContextSelected={setContextSelected}
      />
      <div
        className={classes.list}
        style={{
          minHeight: threadList.length * HEIGHT_ITEM,
        }}
      >
        <AutoSizer>
          {(dimensions: { height: number; width: number }) => (
            <FixedSizeList
              height={dimensions.height}
              itemCount={threadList.length}
              itemData={threadList}
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
                  markAsUnread={markAsUnread}
                  selectedThreadId={selectedThreadId}
                  setSelectedThreadId={setSelectedThreadId}
                  threadList={threadList}
                />
              )}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
      {hasNextPage && (
        <div className={classes.loading}>
          <Fab
            variant="extended"
            onClick={loadMoreItems}
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
