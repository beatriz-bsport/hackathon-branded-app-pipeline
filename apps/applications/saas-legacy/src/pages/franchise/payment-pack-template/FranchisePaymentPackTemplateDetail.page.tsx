import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import {
  push as pushAction,
  replace as replaceAction,
} from 'connected-react-router';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withTranslation, WithTranslation } from 'react-i18next';
import { fetchFilteredMembers as fetchFilteredMembersAction } from '#src/libs/member/actions';
import PaymentPackTemplateCard from '#src/libs/payment-packs/components/PaymentPackTemplateCard.component';
import { fetchConsumerPaymentPackList as fetchConsumerPaymentPackListAction } from '#src/libs/consumer-payment-pack/actions';
import {
  getPaginatedConsumerPaymentPackList,
  withPaymentPack,
  withMember,
} from '#src/libs/consumer-payment-pack/selectors';
import PaginatedConsumerPackList from '#src/libs/consumer-payment-pack/components/PaginatedConsumerPackList.component';
import PaymentPackTemplateInstanceFormDialog from '#src/libs/payment-packs/components/PaymentPackTemplateInstanceFormDialog.component';
import PaymentPackTemplateInstanceDeleteDialog from '#src/libs/payment-packs/components/PaymentPackTemplateInstanceDeleteDialog.component';
import PaymentPackTemplateFormDrawer from '#src/libs/payment-packs/components/PaymentPackTemplateForm/PaymentPackTemplateFormDrawer.component';
import {
  PaymentPackTemplateAPI,
  PaymentPackTemplateInstanceParams,
} from '#src/libs/payment-packs/types';
import PaymentPackTemplateDeleteDialog from '#src/libs/payment-packs/components/PaymentPackTemplateDeleteDialog.component';
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
import {
  getFranchiseCompanies,
  getAllowedFranchisees,
} from '../../../libs/franchise/selectors';
import { getPaymentPackTemplate } from '../../../libs/payment-packs/selectors';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import withTitle from '../../../hocs/with-title.hoc';

import { openNewWindowToImpersonate } from '#src/utils/windows';
import { TEMPLATE_CONSUMER_PACK_PAGINATION_SIZE } from '#src/libs/payment-packs/constants';

type OwnProps = { paymentPackTemplateId: number };

type Props = OwnProps &
  WithTranslation &
  ConnectedProps<typeof connector> &
  typeof stateHandlersInit &
  WithHandlerType<typeof stateHandlersSetter> &
  WithHandlerType<typeof mapWithHandlers>;

export class FranchisePaymentPackTemplateDetail extends Component<Props> {
  componentDidMount() {
    this.props.retrievePaymentPackTemplate(this.props.paymentPackTemplateId);

    if (parseQueryString(location.search || '').openTemplateInstanceForm) {
      this.props.openCreateForm();
    }
  }

  goToConsumerPaymentPackDetail = (
    companyId: number,
    memberId: number,
    consumerPackId: number,
  ) => {
    openNewWindowToImpersonate(
      companyId,
      `/member/${memberId}/pass/${consumerPackId}`,
    );
  };

  handleCloseCreateForm = () => {
    this.props.closeCreateForm();
    if (parseQueryString(location.search || '').openTemplateInstanceForm) {
      this.props.replace(location.pathname);
    }
  };

  handleCreatePaymentPackTemplateInstance = (
    data: PaymentPackTemplateInstanceParams,
    options: OptionCallback,
  ) => {
    this.props.createPaymentPackTemplateInstance(
      { ...data, payment_pack_template: this.props.paymentPackTemplateId },
      {
        onSuccess: (...args) => {
          this.props.retrievePaymentPackTemplate(
            this.props.paymentPackTemplateId,
          );
          this.handleCloseCreateForm();
          if (options && options.onSuccess) options.onSuccess(...args);
        },
        onError: options?.onError,
      },
    );
  };

  render() {
    if (!this.props.paymentPackTemplate) {
      return <LinearProgress />;
    }
    return (
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <PaymentPackTemplateCard
            isManager
            deletePaymentPackTemplate={this.props.openPaymentPackDeleteDialog}
            editPaymentPackTemplate={this.props.openEditDialog}
            onCreatePaymentPackTemplateInstance={this.props.openCreateForm}
            // @ts-expect-error
            onDelete={this.props.openDeleteDialog}
            onDeleteCompany={this.props.openDeleteDialog}
            paymentPackTemplate={this.props.paymentPackTemplate}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Paper>
            {/* @ts-expect-error */}
            <PaginatedConsumerPackList
              allowedFranchisees={this.props.allowedFranchisees}
              itemPerPage={TEMPLATE_CONSUMER_PACK_PAGINATION_SIZE}
              items={this.props.consumerPaymentPack.items}
              loading={this.props.consumerPaymentPack.loading}
              nbItems={this.props.consumerPaymentPack.count}
              onClick={(cpp: any) => {
                this.goToConsumerPaymentPackDetail(
                  cpp.payment_pack.company,
                  cpp.member_id,
                  cpp.id,
                );
              }}
              onPageRequested={(page: number, pageSize: number) => {
                this.props.fetchConsumerPaymentPackList(page, pageSize);
              }}
              page={this.props.consumerPaymentPack.page}
            />
          </Paper>
        </Grid>
        <PaymentPackTemplateInstanceFormDialog
          // @ts-expect-error
          companies={this.props.companies}
          onClose={this.handleCloseCreateForm}
          onSubmit={this.handleCreatePaymentPackTemplateInstance}
          open={this.props.createFormOpen}
        />
        <PaymentPackTemplateInstanceDeleteDialog
          companyId={this.props.companyTemplateInstanceIdToDelete}
          onClose={this.props.closeDeleteDialog}
          onSubmit={this.props.deletePaymentPackTemplateInstance}
          open={!!this.props.companyTemplateInstanceIdToDelete}
          paymentPackTemplate={this.props.paymentPackTemplate}
        />
        {!!this.props.isEditDialogOpen && (
          <PaymentPackTemplateFormDrawer
            initial={this.props.paymentPackTemplate}
            onClose={this.props.closeEditDialog}
            onSubmit={this.props.createOrUpdatePaymentPackTemplate}
            open={this.props.isEditDialogOpen}
          />
        )}
        <PaymentPackTemplateDeleteDialog
          onClose={this.props.closePaymentPackTemplateDeleteDialog}
          onSubmit={this.props.deletePaymentPackTemplate}
          open={this.props.isDeletePaymentPackDialogOpen}
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
    allowedFranchisees: getAllowedFranchisees(state),
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
    replace: replaceAction,
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
  closePaymentPackTemplateDeleteDialog: () => () => ({
    isDeletePaymentPackDialogOpen: false,
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
        },
        onBackgroundSuccess: () => {
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
    // @ts-expect-error
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
