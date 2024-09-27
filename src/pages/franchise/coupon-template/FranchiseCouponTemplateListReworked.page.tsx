import React from 'react';
import uniq from 'lodash/uniq';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { push as pushAction } from 'connected-react-router';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CouponTemplateListItem from '#src/libs/coupon/components/CouponTemplateListItem.component';
import { fetchPaymentPackTemplateList as fetchPaymentPackTemplateListAction } from '#src/libs/payment-packs/actions';
import { getPaymentPackTemplateList } from '#src/libs/payment-packs/selectors';
import { fetchPrivatePassTemplateList as fetchPrivatePassTemplateListAction } from '#src/libs/private-service/actions';

import { getPrivatePassTemplateList } from '#src/libs/private-service/selectors/private-pass';
import CouponTemplateFormDrawer from '#src/libs/coupon/components/CouponTemplateFormDrawer.component';
import CouponTemplateDeleteDialog from '#src/libs/coupon/components/CouponTemplateDeleteDialog.component';
import {
  createOrUpdateCouponTemplate as createOrUpdateCouponTemplateAction,
  deleteCouponTemplate as deleteCouponTemplateAction,
  fetchActiveCouponTemplateListPaginated as fetchActiveCouponTemplateListPaginatedAction,
  fetchExpiredActiveCouponTemplateListPaginated as fetchExpiredActiveCouponTemplateListPaginatedAction,
  fetchInActiveCouponTemplateListPaginated as fetchInActiveCouponTemplateListPaginatedAction,
} from '#src/libs/coupon/actions';
import {
  getCouponTemplateData,
  getActiveCouponTemplatePaginated,
  getExpiredActiveCouponTemplatePaginated,
  getInActiveCouponTemplatePaginated,
} from '#src/libs/coupon/selectors';
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
} from '@bsport/common/lib/master-data/buyable-items';
import type {
  CouponTemplateAPI,
  CouponTemplate,
  FetchCouponTemplatePaginatedQueryParams,
} from '#src/libs/coupon/types';
import IsEmptyList from '#src/components/navigation/IsEmptyList.component';
import { buildUrlParams } from '#src/http';
import type { OptionCallback } from '#src/state/types';
import type { RootState } from '#src/reducers';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';

const useStyles = makeStyles((theme) => ({
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
  searchComponent: {
    paddingBottom: theme.spacing(2),
  },
}));

type Props = ConnectedProps<typeof connector>;

const FranchiseCouponTemplateListReworked: React.FC<Props> = ({
  activeCouponTemplatesListPaginated,
  couponTemplateData,
  createOrUpdateCouponTemplate,
  deleteCouponTemplate,
  expiredActiveCouponTemplatesListPaginated,
  fetchActiveCouponTemplateListPaginated,
  fetchExpiredActiveCouponTemplateListPaginated,
  fetchInActiveCouponTemplateListPaginated,
  fetchPaymentPackTemplateList,
  fetchPrivatePassTemplateList,
  goToTemplateDetail,
  inactiveCouponTemplatesListPaginated,
  paymentPackTemplateList,
  privatePassTemplateList,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('coupon');

  const fetchCouponsRelatedObjects = React.useCallback(
    (couponTemplates: CouponTemplateAPI[]) => {
      const relatedObjectsIds = (couponTemplates || []).reduce(
        (acc, couponTemplate) => {
          if (
            ![BUYABLE_ITEM_PASS, BUYABLE_ITEM_PRIVATE_PASS].includes(
              couponTemplate.applies_to,
            ) ||
            !couponTemplate.only_on_objects?.length
          ) {
            return acc;
          }

          if (
            couponTemplate.applies_to === BUYABLE_ITEM_PASS &&
            !!couponTemplate.only_on_objects?.length
          ) {
            acc.paymentpackTemplateIds.push(couponTemplate.only_on_objects);
            return acc;
          }

          if (
            couponTemplate.applies_to === BUYABLE_ITEM_PRIVATE_PASS &&
            !!couponTemplate.only_on_objects?.length
          ) {
            acc.privatePassTemplateIds.push(couponTemplate.only_on_objects);
            return acc;
          }

          return acc;
        },
        { paymentpackTemplateIds: [], privatePassTemplateIds: [] },
      );

      const uniqpaymentPackTemplateIds = uniq(
        relatedObjectsIds.paymentpackTemplateIds,
      );

      const uniqprivatePassTemplateIds = uniq(
        relatedObjectsIds.privatePassTemplateIds,
      );
      !!uniqpaymentPackTemplateIds?.length &&
        fetchPaymentPackTemplateList({
          id__in: uniqpaymentPackTemplateIds,
        });

      !!uniqprivatePassTemplateIds?.length &&
        fetchPrivatePassTemplateList({
          id__in: uniqprivatePassTemplateIds,
        });
    },
    [fetchPaymentPackTemplateList, fetchPrivatePassTemplateList],
  );

  const handleFetchActiveCouponTemplateListPaginated = React.useCallback(
    (params: FetchCouponTemplatePaginatedQueryParams) => {
      fetchActiveCouponTemplateListPaginated(params, {
        onSuccess: (couponTemplatesPaginated) =>
          fetchCouponsRelatedObjects(couponTemplatesPaginated.results),
      });
    },
    [fetchActiveCouponTemplateListPaginated, fetchCouponsRelatedObjects],
  );

  const handleFetchExpiredActiveCouponTemplateListPaginated = React.useCallback(
    (params: FetchCouponTemplatePaginatedQueryParams) => {
      fetchExpiredActiveCouponTemplateListPaginated(params, {
        onSuccess: (couponTemplatesPaginated) =>
          fetchCouponsRelatedObjects(couponTemplatesPaginated.results),
      });
    },
    [fetchExpiredActiveCouponTemplateListPaginated, fetchCouponsRelatedObjects],
  );

  const handleFetchInActiveCouponTemplateListPaginated = React.useCallback(
    (params: FetchCouponTemplatePaginatedQueryParams) => {
      fetchInActiveCouponTemplateListPaginated(params, {
        onSuccess: (couponTemplatesPaginated) =>
          fetchCouponsRelatedObjects(couponTemplatesPaginated.results),
      });
    },
    [fetchInActiveCouponTemplateListPaginated, fetchCouponsRelatedObjects],
  );

  const handlePageInitialization = React.useCallback(() => {
    handleFetchActiveCouponTemplateListPaginated({ page: 1 });
    handleFetchExpiredActiveCouponTemplateListPaginated({ page: 1 });
    handleFetchInActiveCouponTemplateListPaginated({ page: 1 });
  }, [
    handleFetchActiveCouponTemplateListPaginated,
    handleFetchExpiredActiveCouponTemplateListPaginated,
    handleFetchInActiveCouponTemplateListPaginated,
  ]);

  // CDM
  React.useEffect(() => {
    handlePageInitialization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [couponTemplateForEdit, setCouponTemplateForEdit] =
    React.useState<CouponTemplate | null>(null);

  const [openCreationDrawer, setOpenCreationDialog] = React.useState(false);

  const [couponTemplateTemplateIdToDelete, setcouponTemplateIdToDelete] =
    React.useState<number | null>(null);

  const handleSetCouponTemplateForEdit = React.useCallback(
    (couponTemplateId: number) => {
      couponTemplateId &&
        couponTemplateData?.[couponTemplateId] &&
        setCouponTemplateForEdit(couponTemplateData[couponTemplateId]);
    },
    [couponTemplateData],
  );

  const handleResetCouponTemplateForEdit = React.useCallback(() => {
    setCouponTemplateForEdit(null);
  }, []);

  const handleOpenCreationDialog = React.useCallback(
    () => setOpenCreationDialog(true),
    [],
  );
  const handleCloseCreationDialog = React.useCallback(
    () => setOpenCreationDialog(false),
    [],
  );

  const handleOpenDeletionDialog = React.useCallback(
    (couponTemplateId: number) => setcouponTemplateIdToDelete(couponTemplateId),
    [],
  );
  const handleCloseDeletionDialog = React.useCallback(
    () => setcouponTemplateIdToDelete(null),
    [],
  );

  const handleDeleteCouponTemplate = React.useCallback(
    () =>
      !!couponTemplateTemplateIdToDelete &&
      deleteCouponTemplate(couponTemplateTemplateIdToDelete, {
        onSuccess: () => {
          handleCloseDeletionDialog();
          handlePageInitialization();
        },
      }),
    [
      couponTemplateTemplateIdToDelete,
      deleteCouponTemplate,
      handlePageInitialization,
      handleCloseDeletionDialog,
    ],
  );
  // TODO : Type data payload
  const handleCreateOrUpdateSubmit = React.useCallback(
    (data: any, options: OptionCallback<CouponTemplateAPI>) => {
      createOrUpdateCouponTemplate(data, {
        onError: options && options.onError,
        onSuccess: (couponTemplate: CouponTemplateAPI) => {
          if (openCreationDrawer) {
            goToTemplateDetail(couponTemplate.id, {
              openTemplateInstanceForm: true,
            });
          } else {
            goToTemplateDetail(couponTemplate.id);
          }
          handleCloseCreationDialog();
          handleResetCouponTemplateForEdit();
          handlePageInitialization();
          if (options && options.onSuccess) {
            options.onSuccess(couponTemplate);
          }
        },
      });
    },
    [
      createOrUpdateCouponTemplate,
      goToTemplateDetail,
      handleCloseCreationDialog,
      handleResetCouponTemplateForEdit,
      openCreationDrawer,
      handlePageInitialization,
    ],
  );

  const noExistingCoupons =
    !activeCouponTemplatesListPaginated.loading &&
    !expiredActiveCouponTemplatesListPaginated.loading &&
    !inactiveCouponTemplatesListPaginated.loading &&
    !activeCouponTemplatesListPaginated.count &&
    !expiredActiveCouponTemplatesListPaginated.count &&
    !inactiveCouponTemplatesListPaginated.count;
  return (
    <div>
      <IsEmptyList
        button={t('couponTemplate.actions.create')}
        hideEmptyText={!noExistingCoupons}
        onCreate={handleOpenCreationDialog}
        onCreateLabel={t('couponTemplate.actions.create')}
        text={t('couponTemplate.isEmptyExplain')}
      />

      <div className={classes.container}>
        <Typography variant="h4">{t('list.activeCoupons')}</Typography>
        <Divider className={classes.divider} />
        <Paper>
          <PaginatedListBase
            itemPerPage={50}
            items={activeCouponTemplatesListPaginated.coupons}
            listProps={{ disablePadding: true }}
            loading={activeCouponTemplatesListPaginated.loading}
            nbItems={activeCouponTemplatesListPaginated.count}
            onPageRequested={handleFetchActiveCouponTemplateListPaginated}
            page={activeCouponTemplatesListPaginated.page}
            renderItem={(couponTemplate: CouponTemplate) => (
              <CouponTemplateListItem
                key={couponTemplate.id}
                couponTemplate={couponTemplate}
                onClick={goToTemplateDetail}
                onDelete={handleOpenDeletionDialog}
                onEdit={handleSetCouponTemplateForEdit}
              />
            )}
          />
        </Paper>

        <Typography className={classes.title} variant="h4">
          {t('list.expiredActiveCoupons')}
        </Typography>
        <Divider className={classes.divider} />
        <Paper>
          <PaginatedListBase
            itemPerPage={50}
            items={expiredActiveCouponTemplatesListPaginated.coupons}
            listProps={{ disablePadding: true }}
            loading={expiredActiveCouponTemplatesListPaginated.loading}
            nbItems={expiredActiveCouponTemplatesListPaginated.count}
            onPageRequested={
              handleFetchExpiredActiveCouponTemplateListPaginated
            }
            page={expiredActiveCouponTemplatesListPaginated.page}
            renderItem={(couponTemplate: CouponTemplate) => (
              <CouponTemplateListItem
                key={couponTemplate.id}
                couponTemplate={couponTemplate}
                onClick={goToTemplateDetail}
                onDelete={handleOpenDeletionDialog}
                onEdit={handleSetCouponTemplateForEdit}
              />
            )}
          />
        </Paper>

        <Typography className={classes.title} variant="h4">
          {t('list.inactiveCoupons')}
        </Typography>
        <Divider className={classes.divider} />
        <Paper>
          <PaginatedListBase
            itemPerPage={50}
            items={inactiveCouponTemplatesListPaginated.coupons}
            listProps={{ disablePadding: true }}
            loading={inactiveCouponTemplatesListPaginated.loading}
            nbItems={inactiveCouponTemplatesListPaginated.count}
            onPageRequested={handleFetchInActiveCouponTemplateListPaginated}
            page={inactiveCouponTemplatesListPaginated.page}
            renderItem={(couponTemplate: CouponTemplate) => (
              <CouponTemplateListItem
                key={couponTemplate.id}
                couponTemplate={couponTemplate}
                onClick={goToTemplateDetail}
                onDelete={handleOpenDeletionDialog}
                onEdit={handleSetCouponTemplateForEdit}
              />
            )}
          />
        </Paper>
      </div>
      {!!openCreationDrawer && (
        <CouponTemplateFormDrawer
          open
          onClose={handleCloseCreationDialog}
          onSubmit={handleCreateOrUpdateSubmit}
          paymentPackTemplateList={paymentPackTemplateList || []}
          privatePassTemplateList={privatePassTemplateList || []}
        />
      )}
      {!!couponTemplateForEdit && (
        <CouponTemplateFormDrawer
          open
          initial={couponTemplateForEdit}
          onClose={handleResetCouponTemplateForEdit}
          onSubmit={handleCreateOrUpdateSubmit}
          paymentPackTemplateList={paymentPackTemplateList || []}
          privatePassTemplateList={privatePassTemplateList || []}
        />
      )}
      <CouponTemplateDeleteDialog
        onClose={handleCloseDeletionDialog}
        onSubmit={handleDeleteCouponTemplate}
        open={!!couponTemplateTemplateIdToDelete}
      />
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    activeCouponTemplatesListPaginated: getActiveCouponTemplatePaginated(state),
    expiredActiveCouponTemplatesListPaginated:
      getExpiredActiveCouponTemplatePaginated(state),
    inactiveCouponTemplatesListPaginated:
      getInActiveCouponTemplatePaginated(state),
    couponTemplateData: getCouponTemplateData(state),
    privatePassTemplateList: getPrivatePassTemplateList(state),
    paymentPackTemplateList: getPaymentPackTemplateList(state),
  }),
  {
    fetchActiveCouponTemplateListPaginated:
      fetchActiveCouponTemplateListPaginatedAction,
    fetchExpiredActiveCouponTemplateListPaginated:
      fetchExpiredActiveCouponTemplateListPaginatedAction,
    fetchInActiveCouponTemplateListPaginated:
      fetchInActiveCouponTemplateListPaginatedAction,
    createOrUpdateCouponTemplate: createOrUpdateCouponTemplateAction,
    deleteCouponTemplate: deleteCouponTemplateAction,
    goToTemplateDetail: (
      id: number,
      urlParams: { openTemplateInstanceForm: boolean } | {} = {},
    ) => pushAction(`/f/coupon-template/${id}/${buildUrlParams(urlParams)}`),

    fetchPaymentPackTemplateList: fetchPaymentPackTemplateListAction,
    fetchPrivatePassTemplateList: fetchPrivatePassTemplateListAction,
  },
);

export default connector(React.memo(FranchiseCouponTemplateListReworked));
