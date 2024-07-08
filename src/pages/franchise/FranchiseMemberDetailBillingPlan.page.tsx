import React from 'react';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { fetchPaymentPackTemplateList as fetchPaymentPackTemplateListAction } from '#src/libs/payment-packs/actions';
import { fetchPrivatePassTemplateList as fetchPrivatePassTemplateListAction } from '#src/libs/private-service/actions';
import { FRANCHISE_BILLING_PLAN_PAGE_DEFAULT_SIZE } from '#src/libs/franchise/constants';
import { makeStyles } from '@material-ui/core/styles';
import { replace } from 'connected-react-router';
import { useTranslation } from 'react-i18next';
import {
  fetchFranchiseUserBillingPlans as fetchFranchiseUserBillingPlansAction,
  fetchCompanyGroupList as fetchCompanyGroupListAction,
  fetchFranchiseUserBillingPlanInvoices as fetchFranchiseUserBillingPlanInvoicesAction,
} from '#src/libs/franchise/actions';
import {
  getAllowedFranchisees,
  getCompanyGroupList,
  getFranchiseCompanies,
  getFranchiseUserBillingPlansList,
} from '#src/libs/franchise/selectors';
import Alert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import FranchiseBillingPlanDetails from '#src/libs/franchise/components/FranchiseBillingPlanDetails.component';
import FranchiseBillingPlanRowItem from '#src/libs/franchise/components/FranchiseBillingPlanRowItem.component';
import FranchiseBillingPlanFiltersSelector from '#src/libs/franchise/components/FranchiseBillingPlanFiltersSelector.component';
import FranchiseMemberPageLayout from '#src/components/franchise/FranchiseMemberPageLayout.component';
import FranchiseMemberSectionLayout from '#src/components/franchise/FranchiseMemberSectionLayout.component';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';
import Paper from '@material-ui/core/Paper';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import type { Company } from '#src/libs/company/types';
import type { Invoice, InvoiceV1Serializer } from '#src/libs/invoice/types';
import type { PaymentPackTemplate } from '#src/libs/payment-packs/types';
import type { PrivatePassTemplate } from '#src/libs/private-service/types';
import type { RootState } from '#src/reducers';
import type {
  FranchiseBillingPlanFilters,
  FranchiseUserBillingPlan,
} from '#src/libs/franchise/types';
import CircularProgress from '@material-ui/core/CircularProgress';

type ParamsProps = {
  selectedBillingPlanId?: number;
  userId: number;
};

type Props = ParamsProps & ConnectedProps<typeof connector>;

const FranchiseMemberDetailBillingPlan: React.FC<Props> = ({
  allowedFranchiseeIds,
  associatedInvoicesCount,
  associatedInvoicesLoading,
  associatedInvoicesPage,
  companies,
  companyGroups,
  fetchCompanyGroupList,
  fetchFranchiseUserBillingPlanInvoices,
  fetchFranchiseUserBillingPlans,
  fetchPaymentPackTemplateList,
  fetchPrivatePassTemplateList,
  replaceRouter,
  selectedBillingPlanId,
  userBillingPlans,
  userBillingPlansCount,
  userBillingPlansLoading,
  userBillingPlansPage,
  userId,
}) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();

  const [filters, setFilters] = React.useState<FranchiseBillingPlanFilters>({});

  const [associatedInvoices, setAssociatedInvoices] = React.useState<
    Invoice[] | null
  >(null);

  const [associatedPass, setAssociatedPass] = React.useState<
    PaymentPackTemplate | PrivatePassTemplate | null
  >(null);

  const selectedBillingPlan = React.useMemo(() => {
    if (selectedBillingPlanId) {
      return userBillingPlans.filter(
        (billingPlan) => billingPlan.id === selectedBillingPlanId,
      )[0];
    }
  }, [selectedBillingPlanId, userBillingPlans]);

  const areDetailsLoaded = React.useMemo(
    () =>
      !userBillingPlansLoading &&
      !!selectedBillingPlan &&
      !!associatedInvoices &&
      !!associatedPass,
    [
      associatedInvoices,
      associatedPass,
      selectedBillingPlan,
      userBillingPlansLoading,
    ],
  );

  const isCompanyAllowed = React.useMemo(
    () =>
      selectedBillingPlan?.company_id &&
      (!allowedFranchiseeIds.length ||
        allowedFranchiseeIds.includes(selectedBillingPlan.company_id)),
    [allowedFranchiseeIds, selectedBillingPlan?.company_id],
  );

  const onSelectBillingPlanHandler = React.useCallback(
    (newSelectedbillingPlanId: number) => () => {
      setAssociatedInvoices(null);
      setAssociatedPass(null);
      replaceRouter(
        `/f/members/${userId}/member/subscription/${newSelectedbillingPlanId}/`,
      );
    },
    [replaceRouter, userId],
  );

  const fetchInvoiceListPageHandler = React.useCallback(
    (page: number) => {
      if (selectedBillingPlanId) {
        fetchFranchiseUserBillingPlanInvoices(
          {
            user_id: userId,
            billing_plan_id: selectedBillingPlanId,
            page: page,
            page_size: FRANCHISE_BILLING_PLAN_PAGE_DEFAULT_SIZE,
          },
          {
            onSuccess: (invoices: InvoiceV1Serializer[]) => {
              setAssociatedInvoices(invoices);
            },
          },
        );
      }
    },
    [fetchFranchiseUserBillingPlanInvoices, selectedBillingPlanId, userId],
  );

  const goToPassTemplate = React.useCallback(() => {
    if (selectedBillingPlan && associatedPass) {
      replaceRouter(
        selectedBillingPlan.payment_pack_template
          ? `/f/payment-pack-template/${associatedPass.id}`
          : `/f/private-pass-template/${associatedPass.id}`,
      );
    }
  }, [associatedPass, replaceRouter, selectedBillingPlan]);

  React.useEffect(() => {
    fetchCompanyGroupList();
  }, [fetchCompanyGroupList]);

  React.useEffect(() => {
    if (selectedBillingPlanId) fetchInvoiceListPageHandler(1);
  }, [fetchInvoiceListPageHandler, selectedBillingPlanId]);

  React.useEffect(() => {
    if (selectedBillingPlanId && selectedBillingPlan?.payment_pack_template)
      fetchPaymentPackTemplateList(
        { id__in: [selectedBillingPlan.payment_pack_template] },
        {
          onSuccess: (paymentPackTemplates: PaymentPackTemplate[]) => {
            setAssociatedPass(paymentPackTemplates[0]);
          },
        },
      );
  }, [
    fetchPaymentPackTemplateList,
    selectedBillingPlan?.payment_pack_template,
    selectedBillingPlanId,
  ]);

  React.useEffect(() => {
    if (selectedBillingPlanId && selectedBillingPlan?.private_pass_template)
      fetchPrivatePassTemplateList(
        { id__in: [selectedBillingPlan.private_pass_template] },
        {
          onSuccess: (privatePassTemplates: PrivatePassTemplate[]) => {
            setAssociatedPass(privatePassTemplates[0]);
          },
        },
      );
  }, [
    fetchPrivatePassTemplateList,
    selectedBillingPlan?.private_pass_template,
    selectedBillingPlanId,
  ]);

  const fetchBillingPlansPage = React.useCallback(
    (page: number) => {
      fetchFranchiseUserBillingPlans({
        user_id: userId,
        page,
        filters: filters,
      });
      replaceRouter(`/f/members/${userId}/member/subscription/`);
    },
    [fetchFranchiseUserBillingPlans, filters, replaceRouter, userId],
  );

  React.useEffect(() => {
    if (filters) fetchBillingPlansPage(1);
  }, [fetchBillingPlansPage, filters]);

  return (
    <FranchiseMemberPageLayout
      leftChildren={
        <FranchiseMemberSectionLayout>
          <Paper>
            <FranchiseBillingPlanFiltersSelector
              companies={companies as Company[]}
              companyGroups={companyGroups}
              emptyLabel={t('filters.all')}
              filters={!userBillingPlansLoading && filters}
              setFilters={setFilters}
            />
            <Divider />
            <PaginatedListBase
              additionalFilters={filters}
              itemPerPage={FRANCHISE_BILLING_PLAN_PAGE_DEFAULT_SIZE}
              items={userBillingPlans}
              listProps={{ disablePadding: true }}
              loading={userBillingPlansLoading}
              nbItems={userBillingPlansCount}
              onPageRequested={fetchBillingPlansPage}
              page={userBillingPlansPage}
              renderItem={(billingPlan: FranchiseUserBillingPlan) => (
                <FranchiseBillingPlanRowItem
                  billingPlan={billingPlan}
                  onClick={onSelectBillingPlanHandler(billingPlan.id)}
                  selected={
                    selectedBillingPlanId &&
                    selectedBillingPlanId === billingPlan.id
                  }
                />
              )}
            />
          </Paper>
        </FranchiseMemberSectionLayout>
      }
      rightChildren={
        <>
          {!!selectedBillingPlanId && !areDetailsLoaded && (
            <div className={classes.loadingContainer}>
              <CircularProgress />
            </div>
          )}
          {!!selectedBillingPlanId && areDetailsLoaded && (
            <FranchiseBillingPlanDetails
              associatedInvoices={associatedInvoices}
              associatedInvoicesCount={associatedInvoicesCount}
              associatedInvoicesLoading={associatedInvoicesLoading}
              associatedInvoicesPage={associatedInvoicesPage}
              associatedPass={associatedPass}
              fetchInvoicesPage={fetchInvoiceListPageHandler}
              goToPassTemplate={goToPassTemplate}
              isCompanyAllowed={isCompanyAllowed}
              selectedBillingPlan={selectedBillingPlan}
            />
          )}
          {!selectedBillingPlanId && (
            <div className={classes.emptyMessageContainer}>
              {/* @ts-expect-error */}
              <Alert color="grey" severity="info">
                {t('franchiseUserProfile.pleaseSelectASubscription')}
              </Alert>{' '}
            </div>
          )}
        </>
      }
    />
  );
};

const useStyles = makeStyles((theme) => ({
  emptyMessageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const connector = connect(
  (state: RootState) => ({
    allowedFranchiseeIds: getAllowedFranchisees(state),
    associatedInvoicesCount:
      state.franchise.userProfile.billingPlans.invoices.count,
    associatedInvoicesLoading:
      state.franchise.userProfile.billingPlans.invoices.loading,
    associatedInvoicesPage:
      state.franchise.userProfile.billingPlans.invoices.page,
    companies: getFranchiseCompanies(state),
    companyGroups: getCompanyGroupList(state),
    userBillingPlans: getFranchiseUserBillingPlansList(state),
    userBillingPlansCount: state.franchise.userProfile.billingPlans.count,
    userBillingPlansLoading: state.franchise.userProfile.billingPlans.loading,
    userBillingPlansPage: state.franchise.userProfile.billingPlans.page,
  }),
  {
    fetchCompanyGroupList: fetchCompanyGroupListAction,
    fetchFranchiseUserBillingPlanInvoices:
      fetchFranchiseUserBillingPlanInvoicesAction,
    fetchFranchiseUserBillingPlans: fetchFranchiseUserBillingPlansAction,
    fetchPaymentPackTemplateList: fetchPaymentPackTemplateListAction,
    fetchPrivatePassTemplateList: fetchPrivatePassTemplateListAction,
    replaceRouter: replace,
  },
);

export default compose<Props, {}>(
  React.memo,
  routerParamsToProps({
    selectedBillingPlanId: 'selectedBillingPlanId:number',
    userId: 'userId:number',
  }),
  connector,
)(FranchiseMemberDetailBillingPlan);
