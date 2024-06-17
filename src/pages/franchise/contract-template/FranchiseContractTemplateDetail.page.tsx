import React, { useEffect, useState, useCallback } from 'react';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push as pushAction } from 'connected-react-router';
import { WithTranslation, withTranslation } from 'react-i18next';

import withTitle from '#src/hocs/with-title.hoc';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { openNewWindowToImpersonate } from '#src/utils/windows';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import type { RootState } from '#src/reducers';

import {
  fetchContractList as fetchContractListAction,
  fetchContractTemplateDetail as fetchContractTemplateDetailAction,
  fetchContractTemplateRelatedBillingPlans as fetchContractTemplateRelatedBillingPlansAction,
  deleteContractTemplate as deleteContractTemplateAction,
} from '#src/libs/subscription/actions';
import { retrievePrivatePassTemplate as retrievePrivatePassTemplateAction } from '#src/libs/private-service/actions';
import { retrievePaymentPackTemplate as retrievePaymentPackTemplateAction } from '#src/libs/payment-packs/actions';
import { fetchFranchise as fetchFranchiseAction } from '#src/libs/franchise/actions';

import { getPrivatePassTemplateById as getPrivatePassTemplateByIdSelector } from '#src/libs/private-service/selectors/private-pass';
import { getPaymentPackTemplateById as getPaymentPackTemplateByIdSelector } from '#src/libs/payment-packs/selectors';
import {
  getActiveContractTemplateById,
  getContract as getContractByIdSelector,
  getContractTemplateRelatedSubscriptions,
} from '#src/libs/subscription/selectors';
import {
  getFranchiseCompanyListById as getFranchiseCompanyListByIdSelector,
  getFranchiseCompany as getFranchiseCompanyByIdSelector,
} from '#src/libs/franchise/selectors';

import ContractTemplateDeleteDialog from '#src/libs/subscription/franchise-components/ContractTemplateDeleteDialog.component';
import BottomActionsButtonCustom from '#src/components/button/BottomActionsButtonCustom.component';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import ContractTemplateDetail from '#src/libs/subscription/franchise-components/ContractTemplateDetail.component';
import PaginatedSubscriptionList from '#src/libs/subscription/components/PaginatedSubscriptionList.component';
import { SUBSCRIBED_MEMBER_LIST_PAGE_SIZE } from '#src/libs/subscription/constants';

type Params = {
  selectedContractTemplateId: number;
};

type Props = ConnectedProps<typeof connector> & Params & WithTranslation;

const FranchiseContractTemplateDetail: React.FC<Props> = ({
  selectedContractTemplateId,
  selectedContractTemplateState,
  contractTemplate,
  billingPlans,
  getFranchiseCompanyById,
  getPrivatePassTemplateById,
  getPaymentPackTemplateById,
  getFranchiseCompanyListById,
  deleteContractTemplate,
  getContractById,
  push,
  fetchFranchise,
  fetchContractList,
  fetchContractTemplateDetail,
  fetchContractTemplateRelatedBillingPlans,
  retrievePrivatePassTemplate,
  retrievePaymentPackTemplate,
  t,
}) => {
  const classes = useStyles();

  const [isRedirectLoading, setIsRedirectLoading] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchFranchise();
  }, [fetchFranchise]);

  useEffect(() => {
    fetchContractTemplateDetail(selectedContractTemplateId);
  }, [selectedContractTemplateId, fetchContractTemplateDetail]);

  const { children_contracts, private_pass_template, payment_pack_template } =
    contractTemplate || {};

  useEffect(() => {
    children_contracts && fetchContractList({ id__in: children_contracts });
  }, [fetchContractList, children_contracts]);

  useEffect(() => {
    private_pass_template && retrievePrivatePassTemplate(private_pass_template);
    payment_pack_template && retrievePaymentPackTemplate(payment_pack_template);
  }, [
    retrievePrivatePassTemplate,
    retrievePaymentPackTemplate,
    private_pass_template,
    payment_pack_template,
  ]);

  const fetchContractTemplateRelatedBillingPlansHandler = useCallback(
    (page: number) => {
      selectedContractTemplateId &&
        fetchContractTemplateRelatedBillingPlans(selectedContractTemplateId, {
          page,
        });
    },
    [selectedContractTemplateId, fetchContractTemplateRelatedBillingPlans],
  );

  const onPaymentPackTemplateClick = useCallback(
    (id: number) => {
      push(`/f/payment-pack-template/${id}`);
    },
    [push],
  );

  const onPrivatePassTemplateClick = useCallback(
    (id: number) => {
      push(`/f/private-pass-template/${id}`);
    },
    [push],
  );

  const handleDeleteContractTemplate = useCallback((): void => {
    setIsDeleteDialogOpen(false);
    deleteContractTemplate(selectedContractTemplateId, {
      onSuccess: () => {
        push('/f/subscription/contract-template');
      },
    });
  }, [deleteContractTemplate, selectedContractTemplateId, push]);

  const goToSubscription = useCallback(
    (billingPlanId: number, companyId: number): void => {
      setIsRedirectLoading(true);
      openNewWindowToImpersonate(companyId, `/subscription/${billingPlanId}`);
      setIsRedirectLoading(false);
    },
    [],
  );

  const handleOpenDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  if (selectedContractTemplateState.loading) {
    return <LinearProgress />;
  }

  return (
    <div className={classes.pageContainer}>
      <div>
        <Grid container alignItems="stretch" spacing={3}>
          <Grid className={classes.detailContainer} md={6} xs={12}>
            <ContractTemplateDetail
              contractTemplate={contractTemplate}
              getFranchiseCompanyListById={getFranchiseCompanyListById}
              getPaymentPackTemplateById={getPaymentPackTemplateById}
              getPrivatePassTemplateById={getPrivatePassTemplateById}
              onPaymentPackTemplateClick={onPaymentPackTemplateClick}
              onPrivatePassTemplateClick={onPrivatePassTemplateClick}
            />
          </Grid>
          <Grid md={6} xs={12}>
            <div className={classes.membersContainer}>
              <Typography className={classes.title} variant="h6">
                {t('associatedSubscriptions')}
              </Typography>
              <Paper>
                <PaginatedSubscriptionList
                  getContractById={getContractById}
                  getFranchiseCompanyById={getFranchiseCompanyById}
                  itemPerPage={SUBSCRIBED_MEMBER_LIST_PAGE_SIZE}
                  items={billingPlans.items}
                  loading={billingPlans.loading}
                  nbItems={billingPlans.count}
                  onClick={!isRedirectLoading && goToSubscription}
                  onPageRequested={
                    fetchContractTemplateRelatedBillingPlansHandler
                  }
                  page={billingPlans.page}
                />
              </Paper>
            </div>
          </Grid>
        </Grid>
      </div>
      <div className={classes.buttonDrawer}>
        <BottomActionsButtonCustom
          onDelete={handleOpenDeleteDialog}
          onEdit={() => {}}
        />
        <ContractTemplateDeleteDialog
          onClose={handleCloseDeleteDialog}
          onSubmit={handleDeleteContractTemplate}
          open={isDeleteDialogOpen}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (
  state: RootState,
  { selectedContractTemplateId }: { selectedContractTemplateId: number },
) => ({
  selectedContractTemplateState: {
    loading: state.subscription.contractTemplate?.detail.loading,
    error: state.subscription.contractTemplate?.detail.error,
  },
  contractTemplate: getActiveContractTemplateById(
    state,
    selectedContractTemplateId,
  ),
  billingPlans: {
    items: getContractTemplateRelatedSubscriptions(state),
    loading: state.subscription.contractTemplate?.billingPlans.loading,
    count: state.subscription.contractTemplate?.billingPlans.count,
    page: state.subscription.contractTemplate?.billingPlans.page,
  },
  getFranchiseCompanyById: (id: number) =>
    getFranchiseCompanyByIdSelector(id)(state),
  // @ts-expect-error
  getContractById: (id: number) => getContractByIdSelector(state, id),
  getPrivatePassTemplateById: (id: number) =>
    getPrivatePassTemplateByIdSelector(state, id),
  getPaymentPackTemplateById: (id: number) =>
    getPaymentPackTemplateByIdSelector(state, id),
  getFranchiseCompanyListById: (id__in: number[]) =>
    getFranchiseCompanyListByIdSelector(state, id__in),
});

const mapDispatchToProps = {
  fetchContractTemplateDetail: fetchContractTemplateDetailAction,
  fetchContractTemplateRelatedBillingPlans:
    fetchContractTemplateRelatedBillingPlansAction,
  retrievePrivatePassTemplate: retrievePrivatePassTemplateAction,
  retrievePaymentPackTemplate: retrievePaymentPackTemplateAction,
  deleteContractTemplate: deleteContractTemplateAction,
  fetchFranchise: fetchFranchiseAction,
  fetchContractList: fetchContractListAction,
  push: pushAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    padding: theme.spacing(1.5),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  membersContainer: {
    marginLeft: theme.spacing(3),
  },
  buttonDrawer: {
    marginBottom: theme.spacing(3),
  },
}));

export default compose(
  routerParamsToProps({
    selectedContractTemplateId: 'selectedContractTemplateId:number',
  }),
  connector,
  withTranslation('subscription'),
  withTitle(({ t }) =>
    t('navigation:franchiseMenu.products.contractTemplates'),
  ),
)(FranchiseContractTemplateDetail);
