import React, { useCallback, useEffect, useMemo } from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { makeStyles } from '@material-ui/core';

import MaterialUISelectorHandleScroll from './MaterialUISelectorHandleScroll.component';
import {
  resetIncrementalPayouList as resetIncrementalPayouListAction,
  fetchIncrementalPayoutList as fetchIncrementalPayoutListAction,
} from '#libs/payment/actions';

import { getIncrementalPayoutList } from '#libs/payment/selectors';
import { RootState } from '../../reducers';
import { MuiSelectProps } from './MaterialUISelector.component';

type Props = MuiSelectProps<{
  label: string;
  value: string;
}> &
  ConnectedProps<typeof connector> & {
    value: number[];
  };

const MaterialUISelectorPayout: React.FC<Props> = ({
  payoutList,
  isLoading,
  value,
  nextPage,
  fetchIncrementalPayoutList,
  resetIncrementalPayouList,
  ...muiSelectProps
}) => {
  const classes = useStyles();

  useEffect(() => {
    resetIncrementalPayouList();
    fetchIncrementalPayoutList({
      page: 1,
      page_size: 10,
    });
  }, [fetchIncrementalPayoutList, resetIncrementalPayouList]);

  const handleFetch = useCallback(
    (page: number, search: string) => {
      if (!isLoading) {
        fetchIncrementalPayoutList({ search, page, page_size: 10 });
      }
    },
    [fetchIncrementalPayoutList, isLoading],
  );

  const getOptions = useCallback(() => {
    return [...payoutList].map((payout) => ({
      label: payout.readable_identifier,
      value: payout.id,
    }));
  }, [payoutList]);

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

const connector = connect(
  (state: RootState) => ({
    payoutList: getIncrementalPayoutList(state),

    isLoading: state.paymentBackend.incrementalPayout.loading,
    nextPage: state.paymentBackend.incrementalPayout.nextPage,
  }),
  {
    resetIncrementalPayouList: resetIncrementalPayouListAction,
    fetchIncrementalPayoutList: fetchIncrementalPayoutListAction,
  },
);

export default compose<any, Props>(connector)(MaterialUISelectorPayout);
