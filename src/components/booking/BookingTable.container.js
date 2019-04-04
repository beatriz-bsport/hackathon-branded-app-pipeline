import React from 'react';
import { connect } from 'react-redux';
import BookingTable from './BookingTable.component';
import { paymentPack as paymentPackActions } from '../../actions';

function BookingTableContained(props) {
  return <BookingTable {...props} />;
}

function mapStateToProps(state) {
  return {
    invoices: state.invoice.all,
    paymentPacks: state.paymentPack.all,
    members: state.member.all,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestRefreshPaymentPack() {
      dispatch(paymentPackActions.refreshAllPaymentPack());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookingTableContained);
