// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import {
  getAllMembers,
  getIncrementalSearchedMembers,
} from '#libs/member/selectors';
import {
  resetTncrementalSearch as resetTncrementalSearchAction,
  incrementalSearch as incrementalSearchAction,
  fetchMemberBulk as fetchMemberBulkAction,
} from '../../libs/member/actions';
import { RootState } from '../../reducers';
import { MuiSelectProps } from './MaterialUISelector.component';
import MaterialUISelectorConsumers from './MaterialUISelectorConsumers.component';

export type MaterialUISelectorConsumersProps = MuiSelectProps<{
  label: string;
  value: string;
}> &
  ConnectedProps<typeof connector> & {
    value: number[];
  } & {
    kind: 'user' | 'email';
  };

const connector = connect(
  (state: RootState) => ({
    members: getIncrementalSearchedMembers(state),
    defaultMember: getAllMembers(state),
    isLoading: state.member.search.incremental.loading,
    nextPage: state.member.search.incremental.nextPage,
  }),
  {
    resetTncrementalSearch: resetTncrementalSearchAction,
    incrementalSearch: incrementalSearchAction,
    fetchMemberBulk: fetchMemberBulkAction,
  },
);

export default compose<any, MaterialUISelectorConsumersProps>(connector)(
  MaterialUISelectorConsumers,
);
