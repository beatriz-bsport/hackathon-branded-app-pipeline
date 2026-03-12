// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import { fetchPayoutBalanceTransactions } from '../../actions';
import {
  getPayoutBalanceTransactions,
  getPayoutBalanceTransactionsLoading,
  getPayoutBalanceTransactionsLoadingMore,
  getPayoutBalanceTransactionsNextPage,
  getPayoutBalanceTransactionsError,
} from '../../selectors';
import type { RootState } from '#src/reducers';
import type { Payout } from '../../types';
import PayoutListItem from './PayoutListItem.component';

type OwnProps = {
  payout: Payout;
  isMobile: boolean;
  isOpen: boolean;
  timezoneName: string;
  tooglePayoutOpen: (id: number) => void;
};

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  balanceTransactions: getPayoutBalanceTransactions(state, ownProps.payout.id),
  balanceTransactionLoading: getPayoutBalanceTransactionsLoading(
    state,
    ownProps.payout.id,
  ),
  balanceTransactionLoadingMore: getPayoutBalanceTransactionsLoadingMore(
    state,
    ownProps.payout.id,
  ),
  balanceTransactionNextPage: getPayoutBalanceTransactionsNextPage(
    state,
    ownProps.payout.id,
  ),
  balanceTransactionError: getPayoutBalanceTransactionsError(
    state,
    ownProps.payout.id,
  ),
});

export default connect(mapStateToProps, {
  fetchPayoutBalanceTransactions,
})(PayoutListItem);
