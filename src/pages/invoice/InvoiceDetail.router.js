// @flow
import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  getInvoice,
  withMember,
  withAuthor,
  withPayment,
  withInvoiceItem,
} from '../../libs/invoice/selectors';
import { fetchSpecificInvoice } from '../../libs/invoice/actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import InvoiceDetail from './InvoiceDetail.page';
import DEPRECATEDInvoiceEdit from './DEPRECATEDInvoiceEdit.page';

import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

type Props = {
  uuid: string,
  invoice: ?Invoice,
  fetchInvoice: (uuid: string) => void,
  invoiceLoading: boolean,
};

export class InvoiceDetailRouter extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchInvoice(this.props.uuid);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.uuid !== this.props.uuid && this.props.uuid) {
      this.props.fetchInvoice(this.props.uuid);
    }
  }

  render() {
    if (!this.props.invoice || this.props.invoiceLoading) {
      return <BackofficeLinearProgress />;
    }
    if (this.props.invoice.is_v2) {
      return <InvoiceDetail uuid={this.props.uuid} />;
    }
    return (
      <DEPRECATEDInvoiceEdit
        invoice={this.props.invoice}
        uuid={this.props.uuid}
      />
    );
  }
}

export default compose(
  routerParamsToProps({ uuid: 'uuid' }),
  connect(
    (state, { uuid }) => ({
      invoiceLoading: state.invoice.loadingSpecific,
      invoice: withAuthor(withMember(withInvoiceItem(withPayment(getInvoice))))(
        state,
        uuid,
      ),
    }),
    {
      fetchInvoice: fetchSpecificInvoice,
    },
  ),
)(InvoiceDetailRouter);
