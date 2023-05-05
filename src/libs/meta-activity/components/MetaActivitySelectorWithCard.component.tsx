// @ts-nocheck
import React, { ChangeEvent, useCallback, useState } from 'react';

import Fuse, { FuseOptions } from 'fuse.js';
import { Theme, makeStyles } from '@material-ui/core';

import MetaActivityListItem from './MetaActivityListItem.component';
import FuzeSearch from '#components/FuzeSearch.component';
import VirtualizeListAutoSize from '#components/VirtualizeList/VirtualizeListAutoSize.component';
import { MetaActivity } from '../types';
import MetaActivitySelectorWithCardSkeleton from './MetaActivitySelectorWithCardSkeleton.component';

type Props = {
  metaActivities: MetaActivity[];
  placeholder: string;
  isLoading: boolean;
  onChange: (value?: MetaActivity) => void;
};

type VirtualizedRowProps = {
  metaActivity: MetaActivity;
  onChange: () => void;
};

const VirtualizedRow = React.memo((props: VirtualizedRowProps) => {
  const { metaActivity, onChange } = props;
  return (
    <MetaActivityListItem metaActivity={metaActivity} onClick={onChange} />
  );
});

const MetaActivitySelectorWithCard = (props: Props) => {
  const { metaActivities, placeholder, isLoading, onChange } = props;
  const [searchText, setSearchText] = useState('');
  const [fuzzySearchActivities, setFuzzySearchActivities] = useState(null);
  const classes = useStyles();

  const virtualizedListItemsCount =
    fuzzySearchActivities?.length ?? metaActivities?.length;

  const changeSearch = useCallback(
    (fuse: Fuse<MetaActivity, FuseOptions<MetaActivity>>) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') {
          setSearchText(event.target.value);
          return setFuzzySearchActivities(metaActivities);
        }

        setSearchText(event.target.value);
        return setFuzzySearchActivities(
          (fuse.search(event.target.value) || []) as MetaActivity[],
        );
      },
    [metaActivities],
  );

  const clearSearch = useCallback(() => {
    setSearchText('');
    return setFuzzySearchActivities(metaActivities);
  }, [metaActivities]);

  const renderRow = useCallback(
    (index: number) => {
      const metaActivity = fuzzySearchActivities
        ? fuzzySearchActivities[index]
        : metaActivities[index];
      const handleOnChange = () => onChange(metaActivity);
      return (
        <VirtualizedRow metaActivity={metaActivity} onChange={handleOnChange} />
      );
    },
    [fuzzySearchActivities, metaActivities, onChange],
  );

  if (isLoading) {
    return <MetaActivitySelectorWithCardSkeleton />;
  }

  return (
    <div className={classes.main}>
      <div className={classes.container}>
        <FuzeSearch
          variant="outlined"
          searchText={searchText}
          clearSearch={clearSearch}
          changeSearch={changeSearch}
          searchFields={['name']}
          items={metaActivities}
          placeholder={placeholder}
          className={classes.search}
        />

        <div className={classes.virtualListContainer}>
          <VirtualizeListAutoSize
            itemCount={virtualizedListItemsCount}
            itemSize={76}
            renderRow={renderRow}
          />
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  search: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  container: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    height: '100%',
  },
  main: {
    height: '100%',
    marginTop: theme.spacing(2),
  },
  virtualListContainer: {
    flex: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default MetaActivitySelectorWithCard;
