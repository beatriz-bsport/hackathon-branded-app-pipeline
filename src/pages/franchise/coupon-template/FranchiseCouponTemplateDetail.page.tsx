import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { push as pushAction } from 'connected-react-router';
import Grid from '@material-ui/core/Grid';
import CouponTemplateCard from '#libs/coupon/components/CouponTemplateCard.component';
import PaginatedDiscountList from '#libs/coupon/components/PaginatedDiscountList.component';
import { WithHandlerType } from '../../../utils/types';
import { OptionCallback } from '../../../state/types';
import { getPaymentPackTemplateList } from '#libs/payment-packs/selectors';
import { fetchPaymentPackTemplateList as fetchPaymentPackTemplateListAction } from '#libs/payment-packs/actions';
import { getPrivatePassTemplateList } from '#libs/private-service/selectors/private-pass';
import { fetchPrivatePassTemplateList as fetchPrivatePassTemplateListAction } from '#libs/private-service/actions';
import { navigateAsCompanyAdmin } from '../../../actions/auth.actions';
import CouponTemplateDeleteDialog from '#libs/coupon/components/CouponTemplateDeleteDialog.component';
import CouponTemplateInstanceFormDialog from '#libs/coupon/components/CouponTemplateInstanceFormDialog.component';
import CouponTemplateInstanceDeleteDialog from '#libs/coupon/components/CouponTemplateInstanceDeleteDialog.component';
import CouponTemplateFormDrawer from '#libs/coupon/components/CouponTemplateFormDrawer.component';
import LinearProgress from '../../../components/navigation/BackofficeLinearProgress.component';
import { parseQueryString } from '../../../http';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

import {
  fetchDiscountList as fetchDiscountListAction,
  retrieveCouponTemplate as retrieveCouponTemplateAction,
  createOrUpdateCouponTemplate as createOrUpdateCouponTemplateAction,
  deleteCouponTemplate as deleteCouponTemplateAction,
  createCouponTemplateInstance as createCouponTemplateInstanceAction,
  deleteCouponTemplateInstance as deleteCouponTemplateInstanceAction,
} from '#libs/coupon/actions';
import { getFranchiseCompanies } from '../../../libs/franchise/selectors';
import { getCouponTemplate } from '#libs/coupon/selectors';
import type {
  CouponTemplateAPI,
  CouponTemplateInstance,
} from '#libs/coupon/types';

import { RootState } from '../../../reducers';

const CONSUMER_PACK_PAGINATION_SIZE = 5;

type OwnProps = { couponTemplateId: number };

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  typeof stateHandlersInit &
  WithHandlerType<typeof stateHandlersSetter>;

export class FranchiseCouponTemplateDetail extends Component<Props> {
  componentDidMount() {
    this.props.retrieveCouponTemplate(this.props.couponTemplateId);
    this.props.fetchPaymentPackTemplateList();
    this.props.fetchPrivatePassTemplateList();
    if (
      // eslint-disable-next-line
      parseQueryString(location.search || '')?.openTemplateInstanceForm
    ) {
      this.props.openCreateInstanceDialog();
    }
  }

  render() {
    if (!this.props.couponTemplate) {
      return <LinearProgress />;
    }
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <CouponTemplateCard
              couponTemplate={this.props.couponTemplate}
              onEditTemplate={this.props.openEditTemplateDialog}
              onDeleteTemplate={this.props.openDeleteTemplateDialog}
              onCreateInstance={this.props.openCreateInstanceDialog}
              onDeleteInstance={this.props.openDeleteInstanceDialog}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <PaginatedDiscountList
              items={this.props.discount.items}
              nbItems={this.props.discount.count}
              loading={this.props.discount.loading}
              page={this.props.discount.page}
              itemPerPage={CONSUMER_PACK_PAGINATION_SIZE}
              onPageRequested={(page: number, pageSize: number) => {
                this.props.fetchDiscountList(page, pageSize);
              }}
              goToInvoice={this.props.goToInvoice}
              goToBillingPlan={this.props.goToBillingPlan}
              companies={this.props.couponTemplate.companies}
            />
          </Grid>
        </Grid>
        {this.props.editTemplateDialogOpen && (
          <CouponTemplateFormDrawer
            open
            onClose={this.props.closeEditTemplateDialog}
            privatePassTemplateList={this.props.privatePassTemplateList || []}
            paymentPackTemplateList={this.props.paymentPackTemplateList || []}
            initial={this.props.couponTemplate}
            onSubmit={this.props.updateCouponTemplate}
          />
        )}
        <CouponTemplateDeleteDialog
          open={this.props.deleteTemplateDialogOpen}
          onSubmit={this.props.deleteCouponTemplate}
          onClose={this.props.closeDeleteTemplateDialog}
        />
        {!this.props.paymentPackTemplateListLoading &&
          !this.props.privatePassTemplateListLoading &&
          this.props.createInstanceDialogOpen && (
            <CouponTemplateInstanceFormDialog
              onClose={this.props.closeCreateInstanceDialog}
              onSubmit={this.props.createCouponTemplateInstance}
              companies={this.props.companies}
              couponTemplate={this.props.couponTemplate}
              paymentPackTemplateList={this.props.paymentPackTemplateList}
              privatePassTemplateList={this.props.privatePassTemplateList}
            />
          )}
        {!!this.props.instanceCompanyIdToDelete && (
          <CouponTemplateInstanceDeleteDialog
            couponTemplate={this.props.couponTemplate}
            companyId={this.props.instanceCompanyIdToDelete}
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
    fetchPaymentPackTemplateList: fetchPaymentPackTemplateListAction,
    fetchPrivatePassTemplateList: fetchPrivatePassTemplateListAction,
    fetchDiscountList: fetchDiscountListAction,
    goToTemplateList: () => pushAction('/f/coupon-template'),
    goToInvoice: (companyId: number, invoiceUuid: string) =>
      navigateAsCompanyAdmin(companyId, `/invoice/${invoiceUuid}`),
    goToBillingPlan: (companyId: number, id: number) =>
      navigateAsCompanyAdmin(companyId, `/subscription/${id}`),
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
      }) =>
      (data: any, options: OptionCallback<CouponTemplateAPI>) => {
        updateCouponTemplate(data, {
          onError: options && options.onError,
          onSuccess: (couponTemplate: CouponTemplateAPI) => {
            closeEditTemplateDialog();
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
    createCouponTemplateInstance:
      ({
        createCouponTemplateInstance,
        couponTemplateId,
        retrieveCouponTemplate,
        closeCreateInstanceDialog,
      }) =>
      (data: any, options: OptionCallback<Array<CouponTemplateInstance>>) => {
        createCouponTemplateInstance(
          { ...data, coupon_template: couponTemplateId },
          {
            onSuccess: (
              couponTemplateInstances: Array<CouponTemplateInstance>,
            ) => {
              retrieveCouponTemplate(couponTemplateId);
              closeCreateInstanceDialog();
              if (options && options.onSuccess)
                options.onSuccess(couponTemplateInstances);
            },
            onError: options?.onError,
          },
        );
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
