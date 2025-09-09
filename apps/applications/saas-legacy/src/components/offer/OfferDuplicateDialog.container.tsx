// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import { createOffers } from '#src/libs/offer/actions';
import OfferDuplicateDialog from './OfferDuplicateDialog.component';

// Simple container that just connects Redux actions
export default connect(null, {
  createOffers,
})(OfferDuplicateDialog);
