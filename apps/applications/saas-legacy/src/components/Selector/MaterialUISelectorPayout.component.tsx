import React, { useCallback, useEffect, useMemo } from 'react';

import { makeStyles } from '@material-ui/core';
import uniqBy from 'lodash/uniqBy';

import MaterialUISelectorHandleScroll from './MaterialUISelectorHandleScroll.component';
import { MaterialUISelectorPayoutProps } from './MaterialUISelectorPayout.container';

const MaterialUISelectorPayout: React.FC<MaterialUISelectorPayoutProps> = ({
  payoutList,
  isLoading,
  value,
  nextPage,
  defaultPayout,
  fetchIncrementalPayoutList,
  resetIncrementalPayouList,
  fetchPayoutListLegacy,
  ...muiSelectProps
}) => {
  const classes = useStyles();

  useEffect(() => {
    resetIncrementalPayouList();
    fetchIncrementalPayoutList({
      page: 1,
      page_size: 10,
    });
    if (value?.length > 0) {
      fetchPayoutListLegacy({
        page_size: 300,
        id__in: value,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fetchIncrementalPayoutList,
    resetIncrementalPayouList,
    fetchPayoutListLegacy,
  ]);

  const handleFetch = useCallback(
    (page: number, search: string) => {
      if (!isLoading) {
        fetchIncrementalPayoutList({ search, page, page_size: 10 });
      }
    },
    [fetchIncrementalPayoutList, isLoading],
  );

  const getOptions = useCallback(() => {
    return uniqBy([...defaultPayout, ...payoutList], 'id').map((payout) => ({
      label: payout.readable_identifier,
      value: payout.id,
    }));
  }, [payoutList, defaultPayout]);

  const values = useMemo(
    () =>
      value?.map((val) => getOptions().find((option) => option.value === val)),
    [getOptions, value],
  );

  return (
    <div className={classes.container}>
      {/* @ts-expect-error */}
      <MaterialUISelectorHandleScroll
        fetch={handleFetch}
        isLoading={isLoading}
        nextPage={nextPage}
        options={getOptions()}
        value={values}
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

export default MaterialUISelectorPayout;
