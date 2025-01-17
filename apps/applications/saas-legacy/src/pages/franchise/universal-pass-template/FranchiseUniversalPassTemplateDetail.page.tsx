import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import Helmet from 'react-helmet';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { parseQueryString } from '#src/http';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import PaginatedConsumerPackList from '#src/libs/consumer-payment-pack/components/PaginatedConsumerPackList.component';
import PaymentPackTemplateCard from '#src/libs/payment-packs/components/PaymentPackTemplateCard.component';
import PaymentPackTemplateDeleteDialog from '#src/libs/payment-packs/components/PaymentPackTemplateDeleteDialog.component';
import PaymentPackTemplateFormDrawer from '#src/libs/payment-packs/components/PaymentPackTemplateForm/PaymentPackTemplateFormDrawer.component';
import PaymentPackTemplateInstanceDeleteDialog from '#src/libs/payment-packs/components/PaymentPackTemplateInstanceDeleteDialog.component';
import PaymentPackTemplateInstanceFormDialog from '#src/libs/payment-packs/components/PaymentPackTemplateInstanceFormDialog.component';

import { TEMPLATE_CONSUMER_PACK_PAGINATION_SIZE } from '#src/libs/payment-packs/constants';

import type { RootState } from '#src/reducers';
import type { OptionCallback } from '#src/state/types';
import type {
  PaymentPackTemplateAPI,
  PaymentPackTemplateInstanceParams,
} from '#src/libs/payment-packs/types';
import type { ConsumerPaymentPackREST } from '#src/libs/consumer-payment-pack/types';

import {
  push as pushAction,
  replace as replaceAction,
} from 'connected-react-router';
import { fetchConsumerPaymentPackList as fetchConsumerPaymentPackListAction } from '#src/libs/consumer-payment-pack/actions';
import { fetchFilteredMembers as fetchFilteredMembersAction } from '#src/libs/member/actions';
import {
  createOrUpdateUniversalPaymentPackTemplate as createOrUpdateUniversalPaymentPackTemplateAction,
  createPaymentPackTemplateInstance as createPaymentPackTemplateInstanceAction,
  deleteUniversalPaymentPackTemplate as deleteUniversalPaymentPackTemplateAction,
  deletePaymentPackTemplateInstance as deletePaymentPackTemplateInstanceAction,
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
  retrieveUniversalPaymentPackTemplate as retrieveUniversalPaymentPackTemplateAction,
} from '#src/libs/payment-packs/actions';
import { openNewWindowToImpersonate } from '#src/utils/windows';

import {
  getPaginatedConsumerPaymentPackList,
  withMember,
  withPaymentPack,
} from '#src/libs/consumer-payment-pack/selectors';
import {
  getAllowedFranchisees,
  getFranchiseCompanies,
} from '#src/libs/franchise/selectors';
import { getUniversalPaymentPackTemplate } from '#src/libs/payment-packs/selectors';

type ParamsProps = { paymentPackTemplateId: number };

type Props = ParamsProps & ConnectedProps<typeof connector>;

const FranchiseUniversalPassTemplateDetail: React.FC<Props> = ({
  allowedFranchisees,
  companies,
  consumerPaymentPacks,
  createOrUpdateUniversalPaymentPackTemplate,
  createPaymentPackTemplateInstance,
  deleteUniversalPaymentPackTemplate,
  deletePaymentPackTemplateInstance,
  fetchConsumerPaymentPackList,
  fetchFilteredMembers,
  fetchPaymentPackBulk,
  paymentPackTemplate,
  paymentPackTemplateId,
  pushRouter,
  replace,
  retrieveUniversalPaymentPackTemplate,
}) => {
  const [isCreateFormOpen, setIsCreateFormOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteTemplateDialogOpen, setIsDeleteTemplateDialogOpen] =
    React.useState(false);
  const [
    companyTemplateInstanceIdToDelete,
    setCompanyTemplateInstanceIdToDelete,
  ] = React.useState<number | null>(null);

  const closeCreateForm = React.useCallback(() => {
    setIsCreateFormOpen(false);
    if (parseQueryString(location.search || '').openTemplateInstanceForm) {
      replace(location.pathname);
    }
  }, [replace]);

  const openCreateForm = React.useCallback(() => setIsCreateFormOpen(true), []);

  React.useEffect(() => {
    retrieveUniversalPaymentPackTemplate(paymentPackTemplateId);
  }, [paymentPackTemplateId, retrieveUniversalPaymentPackTemplate]);

  React.useEffect(() => {
    if (
       
      parseQueryString(location.search || '').openTemplateInstanceForm
    ) {
      openCreateForm();
    }
  }, [openCreateForm]);

  const closeTemplateInstanceDeleteDialog = React.useCallback(
    () => setCompanyTemplateInstanceIdToDelete(null),
    [],
  );

  const openTemplateInstanceDeleteDialog = React.useCallback(
    (id: number) => setCompanyTemplateInstanceIdToDelete(id),
    [],
  );

  const closeEditDialog = React.useCallback(
    () => setIsEditDialogOpen(false),
    [],
  );

  const openEditDialog = React.useCallback(() => setIsEditDialogOpen(true), []);

  const closeTemplateDeleteDialog = React.useCallback(
    () => setIsDeleteTemplateDialogOpen(false),
    [],
  );

  const openTemplateDeleteDialog = React.useCallback(
    () => setIsDeleteTemplateDialogOpen(true),
    [],
  );

  const handleDeleteTemplate = React.useCallback(
    () =>
      deleteUniversalPaymentPackTemplate(paymentPackTemplateId, {
        onSuccess: () => {
          closeTemplateDeleteDialog();
          pushRouter('/f/payment-pack-template');
        },
      }),
    [
      closeTemplateDeleteDialog,
      deleteUniversalPaymentPackTemplate,
      paymentPackTemplateId,
      pushRouter,
    ],
  );

  const handleCreateOrUpdateTemplate = React.useCallback(
    (
      data: PaymentPackTemplateAPI,
      options: OptionCallback<PaymentPackTemplateAPI>,
    ) =>
      createOrUpdateUniversalPaymentPackTemplate(
        { ...data, is_universal_template: true },
        {
          onError: options && options.onError,
          onSuccess: (template: PaymentPackTemplateAPI) => {
            closeEditDialog();
            if (options && options.onSuccess) {
              options.onSuccess(template);
            }
          },
        },
      ),
    [closeEditDialog, createOrUpdateUniversalPaymentPackTemplate],
  );

  const handleDeleteTemplateInstance = React.useCallback(
    (id: number, options: OptionCallback) => {
      deletePaymentPackTemplateInstance(id, {
        onSuccess: (...args) => {
          retrieveUniversalPaymentPackTemplate(paymentPackTemplateId);
          closeTemplateInstanceDeleteDialog();
          if (options && options.onSuccess) options.onSuccess(...args);
        },
        onError: options?.onError,
      });
    },
    [
      closeTemplateInstanceDeleteDialog,
      deletePaymentPackTemplateInstance,
      paymentPackTemplateId,
      retrieveUniversalPaymentPackTemplate,
    ],
  );

  const handleCreateTemplateInstance = React.useCallback(
    (data: PaymentPackTemplateInstanceParams, options: OptionCallback) => {
      createPaymentPackTemplateInstance(
        { ...data, payment_pack_template: paymentPackTemplateId },
        {
          onSuccess: (...args) => {
            retrieveUniversalPaymentPackTemplate(paymentPackTemplateId);
            closeCreateForm();
            options?.onSuccess?.(...args);
          },
          onError: options?.onError,
        },
      );
    },
    [
      closeCreateForm,
      createPaymentPackTemplateInstance,
      paymentPackTemplateId,
      retrieveUniversalPaymentPackTemplate,
    ],
  );

  const fetchConsumerPaymentPackListPage = React.useCallback(
    (page: number, page_size: number) => {
      fetchConsumerPaymentPackList(
        { page, page_size, payment_pack_template: paymentPackTemplateId },
        {
          onSuccess: (consumerPacks: ConsumerPaymentPackREST[]) => {
            fetchPaymentPackBulk(
              consumerPacks.map((consumerPack) => consumerPack.payment_pack),
            );
            fetchFilteredMembers({
              id__in: consumerPacks.map(
                (consumerPack) => consumerPack.member_id,
              ),
            });
          },
        },
      );
    },
    [
      fetchConsumerPaymentPackList,
      fetchFilteredMembers,
      fetchPaymentPackBulk,
      paymentPackTemplateId,
    ],
  );

  const goToConsumerPaymentPackDetail = React.useCallback(
    (companyId: number, memberId: number, consumerPackId: number) => {
      openNewWindowToImpersonate(
        companyId,
        `/member/${memberId}/pass/${consumerPackId}`,
      );
    },
    [],
  );

  if (!paymentPackTemplate) {
    return <LinearProgress />;
  }

  return (
    <>
      <Helmet>
        <title>{paymentPackTemplate?.name || ''}</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <PaymentPackTemplateCard
            isManager
            deletePaymentPackTemplate={openTemplateDeleteDialog}
            editPaymentPackTemplate={openEditDialog}
            onCreatePaymentPackTemplateInstance={openCreateForm}
            // @ts-expect-error
            onDelete={openTemplateInstanceDeleteDialog}
            onDeleteCompany={openTemplateInstanceDeleteDialog}
            paymentPackTemplate={paymentPackTemplate}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Paper>
            {/* @ts-expect-error */}
            <PaginatedConsumerPackList
              allowedFranchisees={allowedFranchisees}
              itemPerPage={TEMPLATE_CONSUMER_PACK_PAGINATION_SIZE}
              items={consumerPaymentPacks.items}
              loading={consumerPaymentPacks.loading}
              nbItems={consumerPaymentPacks.count}
              onClick={(consumerPaymentPack) => {
                goToConsumerPaymentPackDetail(
                  consumerPaymentPack.payment_pack.company,
                  consumerPaymentPack.member_id,
                  consumerPaymentPack.id,
                );
              }}
              onPageRequested={(page: number, pageSize: number) => {
                fetchConsumerPaymentPackListPage(page, pageSize);
              }}
              page={consumerPaymentPacks.page}
            />
          </Paper>
        </Grid>
        <PaymentPackTemplateInstanceFormDialog
          // @ts-expect-error
          companies={companies}
          onClose={closeCreateForm}
          onSubmit={handleCreateTemplateInstance}
          open={isCreateFormOpen}
        />
        <PaymentPackTemplateInstanceDeleteDialog
          companyId={companyTemplateInstanceIdToDelete}
          onClose={closeTemplateInstanceDeleteDialog}
          onSubmit={handleDeleteTemplateInstance}
          open={!!companyTemplateInstanceIdToDelete}
          paymentPackTemplate={paymentPackTemplate}
        />
        {!!isEditDialogOpen && (
          <PaymentPackTemplateFormDrawer
            initial={paymentPackTemplate}
            isUniversal={true}
            onClose={closeEditDialog}
            onSubmit={handleCreateOrUpdateTemplate}
            open={isEditDialogOpen}
          />
        )}
        <PaymentPackTemplateDeleteDialog
          onClose={closeTemplateDeleteDialog}
          onSubmit={handleDeleteTemplate}
          open={isDeleteTemplateDialogOpen}
        />
      </Grid>
    </>
  );
};

const connector = connect(
  (
    state: RootState,
    { paymentPackTemplateId }: { paymentPackTemplateId: number },
  ) => ({
    allowedFranchisees: getAllowedFranchisees(state),
    paymentPackTemplate: getUniversalPaymentPackTemplate(
      state,
      paymentPackTemplateId,
    ),
    consumerPaymentPacks: {
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
    createOrUpdateUniversalPaymentPackTemplate:
      createOrUpdateUniversalPaymentPackTemplateAction,
    createPaymentPackTemplateInstance: createPaymentPackTemplateInstanceAction,
    deleteUniversalPaymentPackTemplate:
      deleteUniversalPaymentPackTemplateAction,
    deletePaymentPackTemplateInstance: deletePaymentPackTemplateInstanceAction,
    fetchConsumerPaymentPackList: fetchConsumerPaymentPackListAction,
    fetchFilteredMembers: fetchFilteredMembersAction,
    fetchPaymentPackBulk: fetchPaymentPackBulkAction,
    pushRouter: pushAction,
    replace: replaceAction,
    retrieveUniversalPaymentPackTemplate:
      retrieveUniversalPaymentPackTemplateAction,
  },
);

export default compose<Props, ParamsProps>(
  routerParamsToProps({
    paymentPackTemplateId: 'paymentPackTemplateId:number',
  }),
  connector,
  React.memo,
)(FranchiseUniversalPassTemplateDetail);
