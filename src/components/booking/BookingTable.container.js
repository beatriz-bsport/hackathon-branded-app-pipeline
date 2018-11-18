import React from 'react';
import { connect } from 'react-redux';
import BookingTable from './BookingTable.component';

function BookingTableContained(props) {
  return (
    <BookingTable
      {...props}
    />
  );
}

function mapStateToProps(state) {
  return {
    invoices: state.invoice.all,
    paymentPacks: state.paymentPack.all,
  };
}

export default connect(mapStateToProps)(BookingTableContained);
