import React, { useCallback, useEffect, useMemo } from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { makeStyles } from '@material-ui/core';

import MaterialUISelectorHandleScroll from './MaterialUISelectorHandleScroll.component';

import {
  resetTncrementalSearch as resetTncrementalSearchAction,
  incrementalSearch as incrementalSearchAction,
} from '../../libs/member/actions';
import { getIncrementalSearchedMembers } from '#libs/member/selectors';
import { RootState } from '../../reducers';
import { MuiSelectProps } from './MaterialUISelector.component';

type Props = MuiSelectProps<{
  label: string;
  value: string;
}> &
  ConnectedProps<typeof connector> & {
    value: number[];
  };

const MaterialUISelectorMembers: React.FC<Props> = ({
  members,
  resetTncrementalSearch,
  incrementalSearch,
  isLoading,
  value,
  nextPage,
  ...muiSelectProps
}) => {
  const classes = useStyles();

  useEffect(() => {
    resetTncrementalSearch();
    incrementalSearch('', 1);
  }, [resetTncrementalSearch, incrementalSearch]);

  const handleFetch = useCallback(
    (page: number, search: string) => {
      if (!isLoading) {
        incrementalSearch(search, page);
      }
    },
    [incrementalSearch, isLoading],
  );

  const getOptions = useCallback(() => {
    return [...members].map((member) => ({
      label: member.name,
      value: member.id,
    }));
  }, [members]);

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
    members: getIncrementalSearchedMembers(state),
    isLoading: state.member.search.incremental.loading,
    nextPage: state.member.search.incremental.nextPage,
  }),
  {
    resetTncrementalSearch: resetTncrementalSearchAction,
    incrementalSearch: incrementalSearchAction,
  },
);

export default compose<any, Props>(connector)(MaterialUISelectorMembers);
