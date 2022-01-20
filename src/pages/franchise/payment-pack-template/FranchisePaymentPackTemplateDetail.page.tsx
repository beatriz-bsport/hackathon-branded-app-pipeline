import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { push as pushAction } from 'connected-react-router';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withTranslation, WithTranslation } from 'react-i18next';
import { WithHandlerType } from '../../../utils/types';
import { OptionCallback } from '../../../state/types';
import LinearProgress from '../../../components/navigation/BackofficeLinearProgress.component';
import { parseQueryString } from '../../../http';

import { RootState } from '../../../reducers';

import {
  retrievePaymentPackTemplate as retrievePaymentPackTemplateAction,
  createPaymentPackTemplateInstance as createPaymentPackTemplateInstanceAction,
  deletePaymentPackTemplateInstance as deletePaymentPackTemplateInstanceAction,
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
  createOrUpdatePaymentPackTemplate as createOrUpdatePaymentPackTemplateAction,
  deletePaymentPackTemplate as deletePaymentPackTemplateAction,
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
import PaymentPackTemplateFormDialog from '#libs/payment-packs/components/PaymentPackTemplateFormDialog.component';
import { PaymentPackTemplateAPI } from '#libs/payment-packs/types';
import PaymentPackTemplateDeleteDialog from '#libs/payment-packs/components/PaymentPackTemplateDeleteDialog.component';

type OwnProps = { paymentPackTemplateId: number };

const CONSUMER_PACK_PAGINATION_SIZE = 30;

type Props = OwnProps &
  WithTranslation &
  ConnectedProps<typeof connector> &
  typeof stateHandlersInit &
  WithHandlerType<typeof stateHandlersSetter> &
  WithHandlerType<typeof mapWithHandlers>;

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
            editPaymentPackTemplate={this.props.openEditDialog}
            deletePaymentPackTemplate={this.props.openPaymentPackDeleteDialog}
            onDelete={this.props.openDeleteDialog}
            isManager
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
        {!!this.props.isEditDialogOpen && (
          <PaymentPackTemplateFormDialog
            onSubmit={this.props.createOrUpdatePaymentPackTemplate}
            initial={this.props.paymentPackTemplate}
            onClose={this.props.closeEditDialog}
            open={this.props.isEditDialogOpen}
          />
        )}
        <PaymentPackTemplateDeleteDialog
          open={this.props.isDeletePaymentPackDialogOpen}
          onSubmit={this.props.deletePaymentPackTemplate}
          onClose={this.props.closeDeleteDialog}
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
    pushRouter: pushAction,
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
    createOrUpdatePaymentPackTemplate: createOrUpdatePaymentPackTemplateAction,
    deletePaymentPackTemplate: deletePaymentPackTemplateAction,
  },
);

const stateHandlersInit = {
  createFormOpen: false,
  companyTemplateInstanceIdToDelete: null as number,
  isEditDialogOpen: false,
  isDeletePaymentPackDialogOpen: false,
};
const stateHandlersSetter = {
  openCreateForm: () => () => ({ createFormOpen: true }),
  closeCreateForm: () => () => ({ createFormOpen: false }),
  openDeleteDialog: () => (companyTemplateInstanceIdToDelete: number) => ({
    companyTemplateInstanceIdToDelete,
  }),
  closeEditDialog: () => () => ({
    isEditDialogOpen: false,
  }),
  openEditDialog: () => () => ({
    isEditDialogOpen: true,
  }),
  closeDeleteDialog: () => () => ({
    companyTemplateInstanceIdToDelete: null as number,
  }),
  openPaymentPackDeleteDialog: () => () => ({
    isDeletePaymentPackDialogOpen: true,
  }),
  closePaymentPackDeleteDialog: () => () => ({
    isDeletePaymentPackDialogOpen: false,
  }),
};

type BeforeHandlerProps = ConnectedProps<typeof connector> &
  typeof stateHandlersInit &
  WithHandlerType<typeof stateHandlersSetter> &
  OwnProps;

const mapWithHandlers = {
  deletePaymentPackTemplate:
    ({
      deletePaymentPackTemplate,
      paymentPackTemplateId,
      pushRouter,
      closePaymentPackDeleteDialog,
    }: BeforeHandlerProps) =>
    () =>
      deletePaymentPackTemplate(paymentPackTemplateId, {
        onSuccess: () => {
          closePaymentPackDeleteDialog();
          pushRouter('/f/payment-pack-template');
        },
      }),
  createOrUpdatePaymentPackTemplate:
    ({
      createOrUpdatePaymentPackTemplate,
      closeEditDialog,
    }: BeforeHandlerProps) =>
    (data: any, options: OptionCallback<PaymentPackTemplateAPI>) =>
      createOrUpdatePaymentPackTemplate(data, {
        onError: options && options.onError,
        onSuccess: (template: PaymentPackTemplateAPI) => {
          closeEditDialog();
          if (options && options.onSuccess) {
            options.onSuccess(template);
          }
        },
      }),
  deletePaymentPackTemplateInstance:
    ({
      deletePaymentPackTemplateInstance,
      paymentPackTemplateId,
      retrievePaymentPackTemplate,
      closeDeleteDialog,
    }: BeforeHandlerProps) =>
    (id, options) => {
      deletePaymentPackTemplateInstance(id, {
        onSuccess: (...args) => {
          retrievePaymentPackTemplate(paymentPackTemplateId);
          closeDeleteDialog();
          if (options && options.onSuccess) options.onSuccess(...args);
        },
        onError: options?.onError,
      });
    },
  createPaymentPackTemplateInstance:
    ({
      createPaymentPackTemplateInstance,
      paymentPackTemplateId,
      retrievePaymentPackTemplate,
      closeCreateForm,
    }: BeforeHandlerProps) =>
    (data, options) => {
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
  fetchConsumerPaymentPackList:
    ({
      fetchConsumerPaymentPackList,
      fetchPaymentPackBulk,
      fetchFilteredMembers,
      paymentPackTemplateId: payment_pack_template,
    }: BeforeHandlerProps) =>
    (page: number, page_size: number) => {
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
};

export default compose(
  withTranslation(),
  routerParamsToProps({
    paymentPackTemplateId: 'paymentPackTemplateId:number',
  }),
  withStateHandlers(stateHandlersInit, stateHandlersSetter),
  connector,
  withHandlers(mapWithHandlers),
  withTitle(({ paymentPackTemplate }) =>
    paymentPackTemplate ? paymentPackTemplate.name : '',
  ),
)(FranchisePaymentPackTemplateDetail);
