import React, { useCallback, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import uniqBy from 'lodash/uniqBy';

import MaterialUISelectorHandleScroll from './MaterialUISelectorHandleScroll.component';
import { MaterialUISelectorConsumersProps } from './MaterialUISelectorConsumers.container';

const MaterialUISelectorConsumers: React.FC<
  MaterialUISelectorConsumersProps
> = ({
  members,
  resetTncrementalSearch,
  incrementalSearch,
  fetchMemberBulk,
  defaultMember,
  isLoading,
  value,
  nextPage,
  kind = 'user',
  ...muiSelectProps
}) => {
  const classes = useStyles();

  useEffect(() => {
    resetTncrementalSearch();
    incrementalSearch('', 1);
    if (value?.length > 0) {
      fetchMemberBulk({
        consumer_id__in: value,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTncrementalSearch, incrementalSearch, fetchMemberBulk]);

  const handleFetch = useCallback(
    (page: number, search: string) => {
      if (!isLoading) {
        incrementalSearch(search, page);
      }
    },
    [incrementalSearch, isLoading],
  );

  const getOptions = useCallback(() => {
    return uniqBy([...defaultMember, ...members], 'id').map((member) => ({
      label: kind === 'user' ? member.name : member.email,
      value: member.consumer,
    }));
  }, [defaultMember, members, kind]);

  const values = useMemo(
    () =>
      value?.map((val) => getOptions().find((option) => option.value === val)),
    [getOptions, value],
  );

  return (
    <div className={classes.container}>
      <MaterialUISelectorHandleScroll
        options={getOptions()}
        fetch={handleFetch}
        isLoading={isLoading}
        value={values}
        nextPage={nextPage}
        {...muiSelectProps}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
  },
}));

export default MaterialUISelectorConsumers;
