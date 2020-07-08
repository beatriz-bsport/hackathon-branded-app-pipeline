// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { goBack, push as pushRouter } from 'connected-react-router';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import Grow from '@material-ui/core/Grow';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import PersonIcon from '@material-ui/icons/Person';
import CreditMemberBadge from '../../libs/member/components/CreditMemberBadge.component';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  createOrUpdateInvoice,
  revertInvoice,
  fetchSpecificInvoice,
  returnPayment,
  updatePaymentMethod,
  fetchPaymentList,
  fetchInvoiceItemList,
  finalizeInvoice,
} from '../../libs/invoice/actions';
import {
  getInvoice,
  withMember,
  withAuthor,
  withPayment,
  withInvoiceItem,
  getBuyableItem,
} from '../../libs/invoice/selectors';
import { fetchCompanyRoles } from '../../libs/role/actions';
import withTitle from '../../hocs/with-title.hoc';
import { formatAsDate } from '../../datetime';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { fetchMember } from '../../libs/member/actions';
import { fetchShopItemAsManager as fetchShopItems } from '../../libs/shop/actions/shopitem';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';
import { getPermissions } from '../../libs/role/selectors';

import { fetchPrivatePassList } from '../../libs/private-service/actions';

import type { Invoice } from '../../api/types';
import type { Member } from '../../libs/member/types';
import type { Permission } from '../../libs/role/types';

import InvoiceForm from '../../libs/invoice/components/InvoiceForm.component';
import RevertInvoiceDialog from '../../libs/invoice/dialog/RevertInvoiceDialog.component';

type Props = {
  updatingInvoice: boolean,
  uuid: string,

  classes: Object,

  isReturningPayment: boolean,
  returnPayment: (paymentId: string, invoiceId: string) => void,

  invoice: Invoice,
  member: Member,
  permission: Permission,

  goBack: () => void,
  fetchInvoice: (uuid: string, options: OptionCallback) => void,
  fetchShopItems: () => void,
  fetchAllPaymentPacks: () => void,
  goToMemberPage: (id: number) => void,
  finalizeInvoice: (uuid: string, options: OptionCallback) => void,
  fetchMember: (id: number) => void,
  updatePaymentMethod: (uuid: number, payment_method: number) => void,
  goToSubscription: (id: number) => void,
  updateInvoice: (invoiceData: InvoiceData) => void,
  revertInvoice: (uuid: string) => void,

  fetchCompanyRoles: () => void,

  fetchPaymentList: (params: *) => void,
  fetchInvoiceItemList: (params: *) => void,
  availableBuyableItems: { [buyable_item_identifier: number]: Array<any> },
};

type State = {
  revertDialogOpen: boolean,
};

export class InvoiceFormPage extends Component<Props, State> {
  state = {
    revertDialogOpen: false,
  };

  fetchData = () => {
    if (this.props.uuid) {
      this.props.fetchPaymentList({
        invoice__uuid: this.props.uuid,
        page_size: 100,
      });
      this.props.fetchInvoiceItemList({
        invoice__uuid: this.props.uuid,
        page_size: 100,
      });
      this.props.fetchInvoice(this.props.uuid, {
        onSuccess: (invoice) => {
          this.props.fetchMember(invoice.member);
        },
      });
    }
  };

  componentDidMount() {
    this.props.fetchShopItems();
    this.props.fetchAllPaymentPacks();
    this.fetchData();
    this.props.fetchCompanyRoles();
  }

  componentDidUpdate(prevProps: Props) {
    const { props } = this;
    if (prevProps.uuid !== props.uuid && props.uuid) {
      this.fetchData();
    }
  }

  updateInvoice = (invoiceData: InvoiceData) => {
    this.props.updateInvoice(
      { uuid: this.props.uuid, ...invoiceData },
      true,
      () => this.props.goToMemberPage(this.props.member.id),
    );
  };

  render() {
    const { invoice, goToMemberPage, updatingInvoice } = this.props;

    if (!invoice || !invoice.member) {
      return <LinearProgress />;
    }

    return (
      <div>
        <InvoiceForm
          updatePaymentMethod={this.props.updatePaymentMethod}
          onSubmit={this.updateInvoice}
          onCancel={this.props.goBack}
          paymentItemList={this.props.invoice.payments}
          invoiceItemList={this.props.invoice.invoice_items}
          goToSubscription={this.props.goToSubscription}
          isReturningPayment={this.props.isReturningPayment}
          processing={updatingInvoice}
          member={invoice.member}
          availableBuyableItems={this.props.availableBuyableItems}
          invoice={invoice}
          returnPayment={(payment) =>
            this.props.returnPayment(payment, this.props.uuid)
          }
          revertInvoice={() => this.setState({ revertDialogOpen: true })}
          goToMemberPage={
            this.props.permission.member.retrieve &&
            (() => goToMemberPage(invoice.member.id))
          }
          finalizeInvoice={(options) =>
            this.props.finalizeInvoice(this.props.uuid, options)
          }
        />
        {this.props.permission.member.retrieve && (
          <div className={this.props.classes.navigationButton}>
            <Grow in={this.props.invoice && this.props.invoice.member}>
              <CreditMemberBadge
                credit={this.props.invoice.member.credit_account_balance}
              >
                <Fab
                  variant="contained"
                  color="secondary"
                  onClick={this.props.goToMemberPage}
                >
                  <PersonIcon />
                  <Hidden xsDown>
                    <span className={this.props.classes.rightText}>
                      {this.props.invoice.member.name}
                    </span>
                  </Hidden>
                </Fab>
              </CreditMemberBadge>
            </Grow>
          </div>
        )}

        <RevertInvoiceDialog
          open={this.state.revertDialogOpen}
          hasSubscription={!!invoice.plannedinvoice}
          onSubmit={() => {
            this.props.revertInvoice(this.props.uuid, {
              onSuccess: this.fetchData,
            });
            this.setState({ revertDialogOpen: false });
          }}
          onClose={() => this.setState({ revertDialogOpen: false })}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  navigationButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(4),
  },
  rightText: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withTranslation(),
  withStyles(styles),
  withRouter,
  routerParamsToProps({ id: 'uuid' }),
  connect(
    (state, { uuid }) => ({
      invoiceLoading: state.invoice.loadingSpecific,
      memberLoading: state.member.loading,
      invoice: withAuthor(withMember(withInvoiceItem(withPayment(getInvoice))))(
        state,
        uuid,
      ),
      updatingInvoice: state.invoice.createOrUpdatePending,
      permission: getPermissions(state),
      isReturningPayment: state.invoice.returnPayment.loading,
      availableBuyableItems: getBuyableItem(state),
    }),
    {
      fetchPaymentList,
      fetchInvoiceItemList,
      fetchMember,
      fetchShopItems,
      fetchCompanyRoles,
      fetchAllPaymentPacks,
      fetchPrivatePassList,
      goBack,
      goToMemberPage: (id) => pushRouter(`/member/${id}/`),
      goToSubscription: (id) => pushRouter(`/subscription/${id}/`),
      updateInvoice: createOrUpdateInvoice,
      revertInvoice,
      finalizeInvoice,
      fetchInvoice: fetchSpecificInvoice,
      returnPayment,
      updatePaymentMethod,
    },
  ),
  withTitle(
    ({ t, uuid, invoice }) =>
      `${t('titles:invoice.invoiceEdit')} - ${
        uuid ? uuid.slice(0, 8).toUpperCase() : ''
      } - ${invoice && invoice.date ? formatAsDate(invoice.date) : ''}`,
  ),
)(InvoiceFormPage);
