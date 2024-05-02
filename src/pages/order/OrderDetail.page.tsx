// @ts-nocheck
import React, { Component } from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withTranslation } from 'react-i18next';
import type { RootState } from '../../reducers';
import { WithHandlerType } from '../../utils/types';

import { getInvoice } from '#libs/invoice/selectors';
import type { Invoice } from '#libs/invoice/types';
import withTitle from '../../hocs/with-title.hoc';

import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#libs/email-editor/selectors';

import { getOrder, withMember } from '#libs/order/selectors';

import { fetchMember } from '#libs/member/actions';
import { fetchOrder, patchOrder } from '#libs/order/actions';
import { fetchByQueryInvoice as fetchByQueryInvoiceAction } from '#libs/invoice/actions';
import OrderDetailComponent from '#libs/order/components/OrderDetail.component';
import { refreshNewOrderAlerting } from '#libs/order/actions';
import { sendCommunication } from '#libs/communication/actions';
import {
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '#libs/email-editor/actions';

import { showVaccinationStatus } from '#libs/custom-form/selectors';

type OwnProps = {
  orderId: string;
};

type OrderDetailConnectedProps = ConnectedProps<typeof connector>;

type Props = OwnProps &
  OrderDetailConnectedProps &
  WithHandlerType<typeof mapWithHandlers>;

type WithStateProps = { setRelatedInvoice: (uuid: string) => void };

export class OrderDetail extends Component<Props> {
  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { orderId } = this.props;
    this.props.fetchOrder(this.props.orderId, {
      onSuccess: (order) => {
        this.props.fetchMember(order.member);
      },
    });
    this.props.fetchByQueryInvoice({ order: orderId });
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.orderId !== this.props.orderId) {
      this.fetchData();
    }
  }

  render() {
    const { order, invoice, goToMember, onInvoiceClick } = this.props;
    if (!order) {
      return <LinearProgress />;
    }
    return (
      <div>
        <OrderDetailComponent
          companyCountry={this.props.companyCountry}
          emailDetailLoading={this.props.emailDetailLoading}
          emailDetails={this.props.email_templates_details}
          emailListLoading={this.props.emailListLoading}
          emails={this.props.email_templates_list}
          getEmailDetail={this.props.fetchEmailTemplateDetail}
          getEmails={this.props.fetchEmailTemplatesSummaries}
          goToMember={goToMember}
          invoice={invoice}
          onInvoiceClick={onInvoiceClick}
          order={order}
          sendCommunication={this.props.sendCommunication}
          showVaccinationStatus={this.props.showVaccinationStatus}
          updateOrderState={(state) =>
            this.props.patchOrder(
              order.id,
              { state },
              {
                onSuccess: () => this.props.refreshNewOrderAlerting(),
              },
            )
          }
        />
      </div>
    );
  }
}

const connector = connect(
  (
    state: RootState,
    { orderId, relatedInvoice }: { orderId: string; relatedInvoice: string },
  ) => ({
    order: withMember(getOrder)(state, orderId),
    invoice: getInvoice(state, relatedInvoice),
    email_templates_list: getAllEmailTemplatesSummaries(state),
    email_templates_details: getEmailTemplatesDetail(state),
    emailListLoading: state.emailTemplate.loading,
    emailDetailLoading: state.emailTemplate.detail.loading,
    showVaccinationStatus: showVaccinationStatus(state),
    companyCountry: state.theme.theme.locale.split('_')[1],
  }),
  {
    fetchByQueryInvoice: fetchByQueryInvoiceAction,
    sendCommunication,
    fetchEmailTemplateDetail: (id: number) => emailTemplateDetail(id),
    fetchEmailTemplatesSummaries,
    fetchMember,
    fetchOrder,
    patchOrder,
    refreshNewOrderAlerting,
    goToMember: (id: number) => push(`/member/${id}/`),
    onInvoiceClick: (uuid: string) => push(`/invoice/${uuid}`),
  },
);

const mapWithHandlers = {
  fetchByQueryInvoice:
    ({
      fetchByQueryInvoice,
      setRelatedInvoice,
    }: OrderDetailConnectedProps & WithStateProps) =>
    (params: { order: string }) => {
      fetchByQueryInvoice(params, {
        onSuccess: (inv: Invoice) => setRelatedInvoice(inv.uuid),
      });
    },
};

export default compose(
  routerParamsToProps({ id: 'orderId' }),
  withState('relatedInvoice', 'setRelatedInvoice', null),
  connector,
  withHandlers(mapWithHandlers),
  withTranslation(),
  withTitle(({ t }) => t('titles:order.orderDetail')),
)(OrderDetail);
