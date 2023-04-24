// @ts-nocheck
import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { push as pushAction } from 'connected-react-router';
import {
  WithStyles,
  createStyles,
  withStyles,
  Theme,
  LinearProgress,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { WithHandlerType } from '../../../utils/types';
import { buildUrlParams } from '../../../http';
import CouponTemplateListItem from '#libs/coupon/components/CouponTemplateListItem.component';
import { getPaymentPackTemplateList } from '#libs/payment-packs/selectors';
import { fetchPaymentPackTemplateList as fetchPaymentPackTemplateListAction } from '#libs/payment-packs/actions';
import { getPrivatePassTemplateList } from '#libs/private-service/selectors/private-pass';
import { fetchPrivatePassTemplateList as fetchPrivatePassTemplateListAction } from '#libs/private-service/actions';
import CouponTemplateFormDrawer from '#libs/coupon/components/CouponTemplateFormDrawer.component';
import CouponTemplateDeleteDialog from '#libs/coupon/components/CouponTemplateDeleteDialog.component';
import IsEmptyList from '../../../components/navigation/IsEmptyList.component';
import {
  fetchCouponTemplateList as fetchCouponTemplateListAction,
  createOrUpdateCouponTemplate as createOrUpdateCouponTemplateAction,
  deleteCouponTemplate as deleteCouponTemplateAction,
} from '#libs/coupon/actions';
import {
  getCouponTemplateData,
  getActiveCouponTemplates,
  getInactiveCouponTemplates,
} from '#libs/coupon/selectors';
import type { CouponTemplateAPI } from '#libs/coupon/types';
import type { OptionCallback } from '../../../state/types';
import { RootState } from '../../../reducers';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      paddingBottom: '20vh',
    },
    divider: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(1),
    },
    title: {
      marginTop: theme.spacing(3),
    },
    inactiveCouponContainer: {
      marginTop: theme.spacing(5),
    },
  });

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type Props = ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation &
  StateHandlerType;

export class FranchiseCouponTemplateList extends Component<Props> {
  componentDidMount() {
    this.props.fetchCouponTemplateList();
    this.props.fetchPaymentPackTemplateList();
    this.props.fetchPrivatePassTemplateList();
  }

  render() {
    const { t, classes } = this.props;
    return (
      <div>
        {this.props.loading && <LinearProgress />}
        <IsEmptyList
          text={t('couponTemplate.isEmptyExplain')}
          button={t('couponTemplate.actions.create')}
          onCreate={this.props.openCreateDialog}
          onCreateLabel={t('couponTemplate.actions.create')}
          hideEmptyText={
            this.props.loading ||
            !!(this.props.activeCouponTemplates || []).length ||
            !!(this.props.inactiveCouponTemplates || []).length
          }
        />
        <div className={classes.container}>
          {(this.props.activeCouponTemplates || []).length ? (
            <>
              <Typography variant="h4">{t('list.activeCoupons')}</Typography>
              <Divider className={classes.divider} />
              <Paper>
                {(this.props.activeCouponTemplates || []).map((ct) => (
                  <CouponTemplateListItem
                    couponTemplate={ct}
                    key={ct.id}
                    onClick={this.props.goToTemplateDetail}
                    onEdit={this.props.openEditDialog}
                    onDelete={this.props.openDeleteDialog}
                  />
                ))}
              </Paper>
            </>
          ) : null}
          {(this.props.inactiveCouponTemplates || []).length ? (
            <div className={classes.inactiveCouponContainer}>
              <Typography variant="h4">{t('list.inactiveCoupons')}</Typography>
              <Divider className={classes.divider} />
              <Paper>
                {(this.props.inactiveCouponTemplates || []).map((ct) => (
                  <CouponTemplateListItem
                    couponTemplate={ct}
                    key={ct.id}
                    onClick={this.props.goToTemplateDetail}
                    onEdit={this.props.openEditDialog}
                    onDelete={this.props.openDeleteDialog}
                  />
                ))}
              </Paper>
            </div>
          ) : null}
        </div>
        {!!this.props.createModalOpen && (
          <CouponTemplateFormDrawer
            open
            onClose={this.props.closeCreateDialog}
            privatePassTemplateList={this.props.privatePassTemplateList || []}
            paymentPackTemplateList={this.props.paymentPackTemplateList || []}
            onSubmit={this.props.createOrUpdateCouponTemplate}
          />
        )}
        {!!this.props.couponTemplateToEdit && (
          <CouponTemplateFormDrawer
            open
            onClose={this.props.closeEditDialog}
            privatePassTemplateList={this.props.privatePassTemplateList || []}
            paymentPackTemplateList={this.props.paymentPackTemplateList || []}
            initial={this.props.couponTemplateToEdit}
            onSubmit={this.props.createOrUpdateCouponTemplate}
          />
        )}
        <CouponTemplateDeleteDialog
          open={!!this.props.couponTemplateIdToDelete}
          onSubmit={this.props.deleteCouponTemplate}
          onClose={this.props.closeDeleteDialog}
        />
      </div>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    loading: state.coupon.couponTemplate.loading,
    couponTemplateData: getCouponTemplateData(state),
    activeCouponTemplates: getActiveCouponTemplates(state),
    inactiveCouponTemplates: getInactiveCouponTemplates(state),
    privatePassTemplateList: getPrivatePassTemplateList(state),
    paymentPackTemplateList: getPaymentPackTemplateList(state),
  }),
  {
    fetchCouponTemplateList: fetchCouponTemplateListAction,
    createOrUpdateCouponTemplate: createOrUpdateCouponTemplateAction,
    deleteCouponTemplate: deleteCouponTemplateAction,
    fetchPaymentPackTemplateList: fetchPaymentPackTemplateListAction,
    fetchPrivatePassTemplateList: fetchPrivatePassTemplateListAction,
    goToTemplateDetail: (id: number, params: any = {}) =>
      pushAction(`/f/coupon-template/${id}/${buildUrlParams(params)}`),
  },
);

const withStateHandlersInit = {
  createModalOpen: false,
  couponTemplateToEdit: null as any,
  couponTemplateIdToDelete: null as any,
};

const withStateHandlersSetter = {
  openCreateDialog: () => () => ({ createModalOpen: true }),
  closeCreateDialog: () => () => ({ createModalOpen: false }),
  openDeleteDialog: () => (id: number) => ({ couponTemplateIdToDelete: id }),
  closeDeleteDialog: () => () => ({ couponTemplateIdToDelete: null as any }),
  openEditDialog:
    (_: any, { couponTemplateData }: Props) =>
    (id: number) => ({
      couponTemplateToEdit: couponTemplateData[id],
    }),
  closeEditDialog: () => () => ({ couponTemplateToEdit: null as any }),
};

export default compose(
  connector,
  withStyles(styles),
  withTranslation('coupon'),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers({
    deleteCouponTemplate:
      ({
        deleteCouponTemplate,
        couponTemplateIdToDelete,
        closeDeleteDialog,
        fetchCouponTemplateList,
      }) =>
      () => {
        deleteCouponTemplate(couponTemplateIdToDelete, {
          onSuccess: () => {
            fetchCouponTemplateList();
            closeDeleteDialog();
          },
        });
      },
    createOrUpdateCouponTemplate:
      ({
        createOrUpdateCouponTemplate,
        closeCreateDialog,
        closeEditDialog,
        goToTemplateDetail,
      }) =>
      (data: any, options: OptionCallback<CouponTemplateAPI>) =>
        createOrUpdateCouponTemplate(data, {
          onError: options && options.onError,
          onSuccess: (couponTemplate: CouponTemplateAPI) => {
            if (
              !couponTemplate.coupon_template_instances.filter(
                (i) => !i.disabled,
              ).length
            ) {
              goToTemplateDetail(couponTemplate.id, {
                openTemplateInstanceForm: true,
              });
            }
            closeCreateDialog();
            closeEditDialog();
            if (options && options.onSuccess) {
              options.onSuccess(couponTemplate);
            }
          },
        }),
  }),
)(FranchiseCouponTemplateList);
