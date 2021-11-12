import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withTranslation, WithTranslation } from 'react-i18next';
import LinearProgress from '../../../components/navigation/BackofficeLinearProgress.component';
import { parseQueryString } from '../../../http';

import { RootState } from '../../../reducers';

import {
  retrievePaymentPackTemplate as retrievePaymentPackTemplateAction,
  createPaymentPackTemplateInstance as createPaymentPackTemplateInstanceAction,
  deletePaymentPackTemplateInstance as deletePaymentPackTemplateInstanceAction,
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
} from '../../../libs/payment-packs/actions';
import { getFranchiseCompanies } from '../../../libs/franchise/selectors';
import { getPaymentPackTemplate } from '../../../libs/payment-packs/selectors';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import withTitle from '../../../hocs/with-title.hoc';
import { fetchFilteredMembers as fetchFilteredMembersAction } from '../../../libs/member/actions';
import PaymentPackTemplateCard from '../../../libs/payment-packs/components/PaymentPackTemplateCard.component';
import { fetchConsumerPaymentPackList as fetchConsumerPaymentPackListAction } from '../../../libs/consumer-payment-pack/actions';
import {
  getPaginatedConsumerPaymentPackList,
  withPaymentPack,
  withMember,
} from '../../../libs/consumer-payment-pack/selectors';

import PaginatedConsumerPackList from '../../../libs/consumer-payment-pack/components/PaginatedConsumerPackList.component';
import PaymentPackTemplateInstanceFormDialog from '../../../libs/payment-packs/components/PaymentPackTemplateInstanceFormDialog.component';
import PaymentPackTemplateInstanceDeleteDialog from '../../../libs/payment-packs/components/PaymentPackTemplateInstanceDeleteDialog.component';
import { navigateAsCompanyAdmin } from '../../../actions/auth.actions';

type OwnProps = { paymentPackTemplateId: number };

const CONSUMER_PACK_PAGINATION_SIZE = 30;

type Props = OwnProps & ConnectedProps<typeof connector> & WithTranslation;

export class FranchisePaymentPackTemplateDetail extends Component<Props> {
  componentDidMount() {
    this.props.retrievePaymentPackTemplate(this.props.paymentPackTemplateId);

    if (
      // eslint-disable-next-line
      parseQueryString(location.search || '').openTemplateInstanceForm
    ) {
      this.props.openCreateForm();
    }
  }

  render() {
    if (!this.props.paymentPackTemplate) {
      return <LinearProgress />;
    }
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <PaymentPackTemplateCard
            paymentPackTemplate={this.props.paymentPackTemplate}
            onCreatePaymentPackTemplateInstance={this.props.openCreateForm}
            onDeleteCompany={this.props.openDeleteDialog}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <PaginatedConsumerPackList
              items={this.props.consumerPaymentPack.items}
              onClick={(cpp: any) => {
                this.props.goToConsumerPaymentPackDetail(
                  cpp.payment_pack.company,
                  cpp.member_id,
                  cpp.id,
                );
              }}
              nbItems={this.props.consumerPaymentPack.count}
              loading={this.props.consumerPaymentPack.loading}
              page={this.props.consumerPaymentPack.page}
              itemPerPage={CONSUMER_PACK_PAGINATION_SIZE}
              onPageRequested={(page: number, pageSize: number) => {
                this.props.fetchConsumerPaymentPackList(page, pageSize);
              }}
            />
          </Paper>
        </Grid>
        <PaymentPackTemplateInstanceFormDialog
          open={this.props.createFormOpen}
          onClose={this.props.closeCreateForm}
          onSubmit={this.props.createPaymentPackTemplateInstance}
          companies={this.props.companies}
        />
        <PaymentPackTemplateInstanceDeleteDialog
          open={!!this.props.companyTemplateInstanceIdToDelete}
          paymentPackTemplate={this.props.paymentPackTemplate}
          companyId={this.props.companyTemplateInstanceIdToDelete}
          onClose={this.props.closeDeleteDialog}
          onSubmit={this.props.deletePaymentPackTemplateInstance}
        />
      </Grid>
    );
  }
}

const connector = connect(
  (
    state: RootState,
    { paymentPackTemplateId }: { paymentPackTemplateId: number },
  ) => ({
    paymentPackTemplate: getPaymentPackTemplate(state, paymentPackTemplateId),
    consumerPaymentPack: {
      count: state.consumerPaymentPack.basePaginationState.count,
      loading: state.consumerPaymentPack.basePaginationState.loading,
      page: state.consumerPaymentPack.basePaginationState.page,
      items: withMember(withPaymentPack(getPaginatedConsumerPaymentPackList))(
        state,
      ),
    },
    companies: getFranchiseCompanies(state),
  }),
  {
    goToConsumerPaymentPackDetail: (companyId, memberId, consumerPackId) =>
      navigateAsCompanyAdmin(
        companyId,
        `/member/${memberId}/pass/${consumerPackId}`,
      ),
    retrievePaymentPackTemplate: retrievePaymentPackTemplateAction,
    createPaymentPackTemplateInstance: createPaymentPackTemplateInstanceAction,
    deletePaymentPackTemplateInstance: deletePaymentPackTemplateInstanceAction,
    fetchConsumerPaymentPackList: fetchConsumerPaymentPackListAction,
    fetchPaymentPackBulk: fetchPaymentPackBulkAction,
    fetchFilteredMembers: fetchFilteredMembersAction,
  },
);

export default compose(
  withTranslation(),
  routerParamsToProps({
    paymentPackTemplateId: 'paymentPackTemplateId:number',
  }),
  withStateHandlers(
    {
      createFormOpen: false,
      companyTemplateInstanceIdToDelete: null,
    },
    {
      openCreateForm: () => () => ({ createFormOpen: true }),
      closeCreateForm: () => () => ({ createFormOpen: false }),
      openDeleteDialog: () => (companyTemplateInstanceIdToDelete) => ({
        companyTemplateInstanceIdToDelete,
      }),
      closeDeleteDialog: () => () => ({
        companyTemplateInstanceIdToDelete: null,
      }),
    },
  ),
  connector,
  withHandlers({
    deletePaymentPackTemplateInstance: ({
      deletePaymentPackTemplateInstance,
      paymentPackTemplateId,
      retrievePaymentPackTemplate,
      closeDeleteDialog,
    }) => (id, options) => {
      deletePaymentPackTemplateInstance(id, {
        onSuccess: (...args) => {
          retrievePaymentPackTemplate(paymentPackTemplateId);
          closeDeleteDialog();
          if (options && options.onSuccess) options.onSuccess(...args);
        },
        onError: options?.onError,
      });
    },
    createPaymentPackTemplateInstance: ({
      createPaymentPackTemplateInstance,
      paymentPackTemplateId,
      retrievePaymentPackTemplate,
      closeCreateForm,
    }) => (data, options) => {
      createPaymentPackTemplateInstance(
        { ...data, payment_pack_template: paymentPackTemplateId },
        {
          onSuccess: (...args) => {
            retrievePaymentPackTemplate(paymentPackTemplateId);
            closeCreateForm();
            if (options && options.onSuccess) options.onSuccess(...args);
          },
          onError: options?.onError,
        },
      );
    },
    fetchConsumerPaymentPackList: ({
      fetchConsumerPaymentPackList,
      fetchPaymentPackBulk,
      fetchFilteredMembers,
      paymentPackTemplateId: payment_pack_template,
    }) => (page: number, page_size: number) => {
      fetchConsumerPaymentPackList(
        { page, page_size, payment_pack_template },
        {
          onSuccess: (consumerPackList) => {
            fetchPaymentPackBulk(
              consumerPackList.map((cpp) => cpp.payment_pack),
            );
            fetchFilteredMembers({
              id__in: consumerPackList.map((b: any) => b.member_id),
            });
          },
        },
      );
    },
  }),
  withTitle(({ paymentPackTemplate }) =>
    paymentPackTemplate ? paymentPackTemplate.name : '',
  ),
)(FranchisePaymentPackTemplateDetail);
