// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import {
  resetIncrementalPayouList as resetIncrementalPayouListAction,
  fetchIncrementalPayoutList as fetchIncrementalPayoutListAction,
  fetchPayoutListLegacy as fetchPayoutListLegacyAction,
} from '#src/libs/payment/actions';

import {
  getIncrementalPayoutList,
  getPayoutLegacyList,
} from '#src/libs/payment/selectors';
import { RootState } from '../../reducers';
import MaterialUISelectorPayout from './MaterialUISelectorPayout.component';
import { MuiSelectProps } from './MaterialUISelector.component';

export type MaterialUISelectorPayoutProps = MuiSelectProps<{
  label: string;
  value: string;
}> &
  ConnectedProps<typeof connector> & {
    value: number[];
  };

const connector = connect(
  (state: RootState) => ({
    payoutList: getIncrementalPayoutList(state),

    isLoading: state.paymentBackend.incrementalPayout.loading,
    nextPage: state.paymentBackend.incrementalPayout.nextPage,
    defaultPayout: getPayoutLegacyList(state),
  }),
  {
    resetIncrementalPayouList: resetIncrementalPayouListAction,
    fetchIncrementalPayoutList: fetchIncrementalPayoutListAction,
    fetchPayoutListLegacy: fetchPayoutListLegacyAction,
  },
);

export default compose<any, MaterialUISelectorPayoutProps>(connector)(
  MaterialUISelectorPayout,
);
