import React from 'react';
import { connect } from 'react-redux';
import BookingTable from './BookingTable.component';

function BookingTableContained(props) {
  return <BookingTable {...props} />;
}

function mapStateToProps(state) {
  return {
    paymentPacks: state.paymentPack.all,
    members: state.member.all,
  };
}

export default connect(mapStateToProps)(BookingTableContained);
