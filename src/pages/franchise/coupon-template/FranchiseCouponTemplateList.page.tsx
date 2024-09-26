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
import CouponTemplateListItem from '#src/libs/coupon/components/CouponTemplateListItem.component';
import { getPaymentPackTemplateList } from '#src/libs/payment-packs/selectors';
import { getPrivatePassTemplateList } from '#src/libs/private-service/selectors/private-pass';
import CouponTemplateFormDrawer from '#src/libs/coupon/components/CouponTemplateFormDrawer.component';
import CouponTemplateDeleteDialog from '#src/libs/coupon/components/CouponTemplateDeleteDialog.component';
import {
  fetchCouponTemplateList as fetchCouponTemplateListAction,
  createOrUpdateCouponTemplate as createOrUpdateCouponTemplateAction,
  deleteCouponTemplate as deleteCouponTemplateAction,
} from '#src/libs/coupon/actions';
import {
  getCouponTemplateData,
  getActiveCouponTemplates,
  getInactiveCouponTemplates,
} from '#src/libs/coupon/selectors';
import type { CouponTemplateAPI } from '#src/libs/coupon/types';
import IsEmptyList from '../../../components/navigation/IsEmptyList.component';
import { buildUrlParams } from '../../../http';
import { WithHandlerType } from '../../../utils/types';
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

// @ts-expect-error
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

// @ts-expect-error
type Props = ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation &
  StateHandlerType;

export class FranchiseCouponTemplateList extends Component<Props> {
  componentDidMount() {
    this.props.fetchCouponTemplateList();
  }

  render() {
    const { t, classes } = this.props;
    return (
      <div>
        {this.props.loading && <LinearProgress />}
        <IsEmptyList
          button={t('couponTemplate.actions.create')}
          hideEmptyText={
            this.props.loading ||
            !!(this.props.activeCouponTemplates || []).length ||
            !!(this.props.inactiveCouponTemplates || []).length
          }
          onCreate={this.props.openCreateDialog}
          onCreateLabel={t('couponTemplate.actions.create')}
          text={t('couponTemplate.isEmptyExplain')}
        />
        <div className={classes.container}>
          {(this.props.activeCouponTemplates || []).length ? (
            <>
              <Typography variant="h4">{t('list.activeCoupons')}</Typography>
              <Divider className={classes.divider} />
              <Paper>
                {/* @ts-expect-error */}
                {(this.props.activeCouponTemplates || []).map((ct) => (
                  <CouponTemplateListItem
                    key={ct.id}
                    couponTemplate={ct}
                    onClick={this.props.goToTemplateDetail}
                    onDelete={this.props.openDeleteDialog}
                    onEdit={this.props.openEditDialog}
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
                {/* @ts-expect-error */}
                {(this.props.inactiveCouponTemplates || []).map((ct) => (
                  <CouponTemplateListItem
                    key={ct.id}
                    couponTemplate={ct}
                    onClick={this.props.goToTemplateDetail}
                    onDelete={this.props.openDeleteDialog}
                    onEdit={this.props.openEditDialog}
                  />
                ))}
              </Paper>
            </div>
          ) : null}
        </div>
        {!!this.props.createModalOpen && (
          // @ts-expect-error
          <CouponTemplateFormDrawer
            open
            onClose={this.props.closeCreateDialog}
            onSubmit={this.props.createOrUpdateCouponTemplate}
            paymentPackTemplateList={this.props.paymentPackTemplateList || []}
            privatePassTemplateList={this.props.privatePassTemplateList || []}
          />
        )}
        {!!this.props.couponTemplateToEdit && (
          // @ts-expect-error
          <CouponTemplateFormDrawer
            open
            initial={this.props.couponTemplateToEdit}
            onClose={this.props.closeEditDialog}
            onSubmit={this.props.createOrUpdateCouponTemplate}
            paymentPackTemplateList={this.props.paymentPackTemplateList || []}
            privatePassTemplateList={this.props.privatePassTemplateList || []}
          />
        )}
        <CouponTemplateDeleteDialog
          onClose={this.props.closeDeleteDialog}
          onSubmit={this.props.deleteCouponTemplate}
          open={!!this.props.couponTemplateIdToDelete}
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
    goToTemplateDetail: (id: number, params: any = {}) =>
      pushAction(`/f/coupon-template/${id}/${buildUrlParams(params)}`),
  },
);

const withStateHandlersInit = {
  createModalOpen: false,
  couponTemplateToEdit: null as any,
  couponTemplateIdToDelete: null as any,
};

// @ts-expect-error
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
        createModalOpen,
        closeCreateDialog,
        closeEditDialog,
        goToTemplateDetail,
      }) =>
      (data: any, options: OptionCallback<CouponTemplateAPI>) =>
        createOrUpdateCouponTemplate(data, {
          onError: options && options.onError,
          onSuccess: (couponTemplate: CouponTemplateAPI) => {
            if (createModalOpen) {
              goToTemplateDetail(couponTemplate.id, {
                openTemplateInstanceForm: true,
              });
            } else {
              goToTemplateDetail(couponTemplate.id);
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
