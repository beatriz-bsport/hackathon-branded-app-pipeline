// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import { fetchPayoutList } from '../../actions';
import {
  getPayoutList,
  getPayoutLoading,
  getPayoutLoadingMore,
  getPayoutNextPage,
  getPayoutError,
} from '../../selectors';
import type { RootState } from '#src/reducers';
import PayoutList from './PayoutList.component';

const mapStateToProps = (state: RootState) => ({
  payouts: getPayoutList(state),
  loading: getPayoutLoading(state),
  loadingMore: getPayoutLoadingMore(state),
  nextPage: getPayoutNextPage(state),
  error: getPayoutError(state),
});

export default connect(mapStateToProps, {
  fetchPayoutList,
})(PayoutList);
