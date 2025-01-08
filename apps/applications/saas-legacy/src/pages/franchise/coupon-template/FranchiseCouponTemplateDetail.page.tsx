import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import {
  push as pushAction,
  replace as replaceAction,
} from 'connected-react-router';
import Grid from '@material-ui/core/Grid';
import CouponTemplateCard from '#src/libs/coupon/components/CouponTemplateCard.component';
import PaginatedDiscountList from '#src/libs/coupon/components/PaginatedDiscountList.component';
import { getPaymentPackTemplateList } from '#src/libs/payment-packs/selectors';
import { fetchPaymentPackTemplateBulk as fetchPaymentPackTemplateBulkAction } from '#src/libs/payment-packs/actions';
import { fetchPrivatePassTemplateBulk as fetchPrivatePassTemplateBulkAction } from '#src/libs/private-service/actions';
import { getPrivatePassTemplateList } from '#src/libs/private-service/selectors/private-pass';

import CouponTemplateDeleteDialog from '#src/libs/coupon/components/CouponTemplateDeleteDialog.component';
import CouponTemplateInstanceFormDialog from '#src/libs/coupon/components/CouponTemplateInstanceFormDialog.component';
import CouponTemplateInstanceDeleteDialog from '#src/libs/coupon/components/CouponTemplateInstanceDeleteDialog.component';
import CouponTemplateFormDrawer from '#src/libs/coupon/components/CouponTemplateFormDrawer.component';
import {
  fetchDiscountList as fetchDiscountListAction,
  retrieveCouponTemplate as retrieveCouponTemplateAction,
  createOrUpdateCouponTemplate as createOrUpdateCouponTemplateAction,
  deleteCouponTemplate as deleteCouponTemplateAction,
  createCouponTemplateInstance as createCouponTemplateInstanceAction,
  deleteCouponTemplateInstance as deleteCouponTemplateInstanceAction,
} from '#src/libs/coupon/actions';
import { getCouponTemplate } from '#src/libs/coupon/selectors';
import type {
  CouponTemplateAPI,
  CouponTemplateInstance,
} from '#src/libs/coupon/types';
import LinearProgress from '../../../components/navigation/BackofficeLinearProgress.component';
import { parseQueryString } from '../../../http';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

import {
  getFranchiseCompanies,
  getAllowedFranchisees,
} from '../../../libs/franchise/selectors';
import { openNewWindowToImpersonate } from '#src/utils/windows';
import { OptionCallback } from '../../../state/types';
import { WithHandlerType } from '../../../utils/types';

import { RootState } from '../../../reducers';
import { Company } from '#src/libs/company/types';

const CONSUMER_PACK_PAGINATION_SIZE = 5;
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
} from '@bsport/common/master-data/buyable-items.js';

type OwnProps = { couponTemplateId: number };

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  typeof stateHandlersInit &
  WithHandlerType<typeof stateHandlersSetter> & {
    fetchCouponRelatedObjects: (couponTemplate?: CouponTemplateAPI) => void;
  };

export class FranchiseCouponTemplateDetail extends Component<Props> {
  componentDidMount() {
    this.props.retrieveCouponTemplate(this.props.couponTemplateId, {
      onSuccess: this.props.fetchCouponRelatedObjects,
    });

    if (
      // eslint-disable-next-line
      parseQueryString(location.search || '')?.openTemplateInstanceForm
    ) {
      this.props.openCreateInstanceDialog();
    }
  }

  goToInvoice = (companyId: number, invoiceUuid: string) => {
    openNewWindowToImpersonate(companyId, `/invoice/${invoiceUuid}`);
  };

  goToBillingPlan = (companyId: number, id: number) => {
    openNewWindowToImpersonate(companyId, `/subscription/${id}`);
  };

  handleCloseCreateForm = () => {
    this.props.closeCreateInstanceDialog();
    if (parseQueryString(location.search || '').openTemplateInstanceForm) {
      this.props.replace(location.pathname);
    }
  };

  handleCreateCouponTemplateInstance = (
    data: { companies: Company[] },
    options: OptionCallback<Array<CouponTemplateInstance>>,
  ) => {
    this.props.createCouponTemplateInstance(
      { ...data, coupon_template: this.props.couponTemplateId },
      {
        // @ts-expect-error
        onSuccess: (couponTemplateInstances: Array<CouponTemplateInstance>) => {
          this.props.retrieveCouponTemplate(this.props.couponTemplateId, {
            onSuccess: this.props.fetchCouponRelatedObjects,
          });
          this.handleCloseCreateForm();
          if (options && options.onSuccess)
            options.onSuccess(couponTemplateInstances);
        },
        onError: options?.onError,
      },
    );
  };

  render() {
    if (!this.props.couponTemplate) {
      return <LinearProgress />;
    }
    return (
      <>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <CouponTemplateCard
              couponTemplate={this.props.couponTemplate}
              onCreateInstance={this.props.openCreateInstanceDialog}
              onDeleteInstance={this.props.openDeleteInstanceDialog}
              onDeleteTemplate={this.props.openDeleteTemplateDialog}
              onEditTemplate={this.props.openEditTemplateDialog}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <PaginatedDiscountList
              allowedFranchisees={this.props.allowedFranchisees}
              // @ts-expect-error
              companies={this.props.couponTemplate.companies}
              goToBillingPlan={this.goToBillingPlan}
              goToInvoice={this.goToInvoice}
              itemPerPage={CONSUMER_PACK_PAGINATION_SIZE}
              items={this.props.discount.items}
              loading={this.props.discount.loading}
              nbItems={this.props.discount.count}
              onPageRequested={(page: number, pageSize: number) => {
                // @ts-expect-error
                this.props.fetchDiscountList(page, pageSize);
              }}
              page={this.props.discount.page}
            />
          </Grid>
        </Grid>
        {this.props.editTemplateDialogOpen && (
          <CouponTemplateFormDrawer
            open
            fetchPaymentPackTemplateBulk={
              this.props.fetchPaymentPackTemplateBulk
            }
            fetchPrivatePassTemplateBulk={
              this.props.fetchPrivatePassTemplateBulk
            }
            initial={this.props.couponTemplate}
            onClose={this.props.closeEditTemplateDialog}
            onSubmit={this.props.updateCouponTemplate}
            paymentPackTemplateList={this.props.paymentPackTemplateList || []}
            privatePassTemplateList={this.props.privatePassTemplateList || []}
          />
        )}
        <CouponTemplateDeleteDialog
          onClose={this.props.closeDeleteTemplateDialog}
          // @ts-expect-error
          onSubmit={this.props.deleteCouponTemplate}
          open={this.props.deleteTemplateDialogOpen}
        />
        {!this.props.paymentPackTemplateListLoading &&
          !this.props.privatePassTemplateListLoading &&
          this.props.createInstanceDialogOpen && (
            <CouponTemplateInstanceFormDialog
              // @ts-expect-error
              companies={this.props.companies}
              couponTemplate={this.props.couponTemplate}
              onClose={this.handleCloseCreateForm}
              // @ts-expect-error
              onSubmit={this.handleCreateCouponTemplateInstance}
              paymentPackTemplateList={this.props.paymentPackTemplateList || []}
              privatePassTemplateList={this.props.privatePassTemplateList || []}
            />
          )}
        {!!this.props.instanceCompanyIdToDelete && (
          <CouponTemplateInstanceDeleteDialog
            companyId={this.props.instanceCompanyIdToDelete}
            couponTemplate={this.props.couponTemplate}
            onClose={this.props.closeDeleteInstanceDialog}
            onSubmit={this.props.deleteCouponTemplateInstance}
          />
        )}
      </>
    );
  }
}

const connector = connect(
  (state: RootState, { couponTemplateId }: { couponTemplateId: number }) => ({
    allowedFranchisees: getAllowedFranchisees(state),
    couponTemplate: getCouponTemplate(state, couponTemplateId),
    privatePassTemplateList: getPrivatePassTemplateList(state),
    paymentPackTemplateList: getPaymentPackTemplateList(state),
    paymentPackTemplateListLoading:
      state.paymentPack.paymentPackTemplate.loading,
    privatePassTemplateListLoading:
      state.privateService.privatePassTemplate.loading,
    companies: getFranchiseCompanies(state),
    discount: {
      count: state.coupon.discount.count,
      loading: state.coupon.discount.loading,
      page: state.coupon.discount.page,
      items: state.coupon.discount.items,
    },
  }),
  {
    retrieveCouponTemplate: retrieveCouponTemplateAction,
    updateCouponTemplate: createOrUpdateCouponTemplateAction,
    deleteCouponTemplate: deleteCouponTemplateAction,
    createCouponTemplateInstance: createCouponTemplateInstanceAction,
    deleteCouponTemplateInstance: deleteCouponTemplateInstanceAction,
    fetchPaymentPackTemplateBulk: fetchPaymentPackTemplateBulkAction,
    fetchPrivatePassTemplateBulk: fetchPrivatePassTemplateBulkAction,
    fetchDiscountList: fetchDiscountListAction,
    goToTemplateList: () => pushAction('/f/coupon-template'),
    replace: replaceAction,
  },
);

const stateHandlersInit = {
  createInstanceDialogOpen: false,
  instanceCompanyIdToDelete: null as number,
  editTemplateDialogOpen: false,
  deleteTemplateDialogOpen: false,
};
const stateHandlersSetter = {
  openCreateInstanceDialog: () => () => ({ createInstanceDialogOpen: true }),
  closeCreateInstanceDialog: () => () => ({ createInstanceDialogOpen: false }),
  openDeleteInstanceDialog: () => (instanceCompanyIdToDelete: number) => ({
    instanceCompanyIdToDelete,
  }),
  closeDeleteInstanceDialog: () => () => ({
    instanceCompanyIdToDelete: null as number,
  }),
  openEditTemplateDialog: () => () => ({
    editTemplateDialogOpen: true,
  }),
  closeEditTemplateDialog: () => () => ({
    editTemplateDialogOpen: false,
  }),
  openDeleteTemplateDialog: () => () => ({
    deleteTemplateDialogOpen: true,
  }),
  closeDeleteTemplateDialog: () => () => ({
    deleteTemplateDialogOpen: false,
  }),
};

export default compose(
  routerParamsToProps({
    couponTemplateId: 'couponTemplateId:number',
  }),
  withStateHandlers(stateHandlersInit, stateHandlersSetter),
  connector,
  withHandlers({
    fetchCouponRelatedObjects:
      ({ fetchPaymentPackTemplateBulk, fetchPrivatePassTemplateBulk }) =>
      (couponTemplate: CouponTemplateAPI) => {
        if (
          ![BUYABLE_ITEM_PASS, BUYABLE_ITEM_PRIVATE_PASS].includes(
            couponTemplate.applies_to,
          ) ||
          !couponTemplate.only_on_objects?.length
        ) {
          return;
        }

        if (
          couponTemplate.applies_to === BUYABLE_ITEM_PASS &&
          !!couponTemplate.only_on_objects?.length
        ) {
          return fetchPaymentPackTemplateBulk({
            id__in: couponTemplate.only_on_objects,
          });
        }

        if (
          couponTemplate.applies_to === BUYABLE_ITEM_PRIVATE_PASS &&
          !!couponTemplate.only_on_objects?.length
        ) {
          return fetchPrivatePassTemplateBulk({
            id__in: couponTemplate.only_on_objects,
          });
        }
      },
    deleteCouponTemplate:
      ({
        deleteCouponTemplate,
        closeDeleteTemplateDialog,
        goToTemplateList,
        couponTemplateId,
      }) =>
      () => {
        deleteCouponTemplate(couponTemplateId, {
          onSuccess: () => {
            closeDeleteTemplateDialog();
            goToTemplateList();
          },
        });
      },
    updateCouponTemplate:
      ({
        updateCouponTemplate,
        closeEditTemplateDialog,
        openCreateInstanceDialog,
        fetchCouponRelatedObjects,
      }) =>
      (data: any, options: OptionCallback<CouponTemplateAPI>) => {
        updateCouponTemplate(data, {
          onError: options && options.onError,
          onSuccess: (couponTemplate: CouponTemplateAPI) => {
            closeEditTemplateDialog();
            fetchCouponRelatedObjects(couponTemplate);
            if (
              !couponTemplate.coupon_template_instances.filter(
                (i) => !i.disabled,
              ).length
            )
              openCreateInstanceDialog();
            if (options && options.onSuccess) {
              options.onSuccess(couponTemplate);
            }
          },
        });
      },
    deleteCouponTemplateInstance:
      ({
        deleteCouponTemplateInstance,
        closeDeleteInstanceDialog,
        couponTemplateId,
        retrieveCouponTemplate,
      }) =>
      (id: number, options: OptionCallback) => {
        deleteCouponTemplateInstance(id, {
          onSuccess: () => {
            retrieveCouponTemplate(couponTemplateId);
            closeDeleteInstanceDialog();
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: options?.onError,
        });
      },
    fetchDiscountList:
      ({ fetchDiscountList, couponTemplateId }) =>
      (page: number, page_size: number) => {
        fetchDiscountList(
          {
            page,
            page_size,
            coupon_template: couponTemplateId,
          },
          {},
        );
      },
  }),
)(FranchiseCouponTemplateDetail);
