import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import type { FranchiseUserBillingPlan } from '#src/libs/franchise/types';
import FranchiseMemberSectionLayout from '#src/components/franchise/FranchiseMemberSectionLayout.component';
import Button from '@material-ui/core/Button';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';
import { FRANCHISE_BILLING_PLAN_PAGE_DEFAULT_SIZE } from '#src/libs/franchise/constants';
import type { Invoice } from '#src/libs/invoice/types';
import Paper from '@material-ui/core/Paper';
import FranchiseBillingPlanAssociatedPass from './FranchiseBillingPlanAssociatedPass.component';
import ArrowForward from '@material-ui/icons/ArrowForward';
import { openNewWindowToImpersonate } from '#src/utils/windows';
import InvoiceListItem from '#src/libs/invoice/InvoiceListItem.component';
import type { PaymentPackTemplate } from '#src/libs/payment-packs/types';
import type { PrivatePassTemplate } from '#src/libs/private-service/types';

type Props = {
  associatedInvoices: Invoice[];
  associatedInvoicesCount: number;
  associatedInvoicesLoading: boolean;
  associatedInvoicesPage: number;
  associatedPass: PaymentPackTemplate | PrivatePassTemplate;
  fetchInvoicesPage: (page: number) => void;
  goToPassTemplate: () => void;
  isCompanyAllowed: boolean;
  selectedBillingPlan: FranchiseUserBillingPlan;
};

const FranchiseBillingPlanDetails: React.FC<Props> = ({
  associatedInvoices,
  associatedInvoicesCount,
  associatedInvoicesLoading,
  associatedInvoicesPage,
  associatedPass,
  fetchInvoicesPage,
  goToPassTemplate,
  isCompanyAllowed,
  selectedBillingPlan,
}) => {
  const { t } = useTranslation(['subscription', 'franchise']);
  const classes = useStyles();

  const onPageRequestHandler = React.useCallback(
    (page: number) => fetchInvoicesPage(page),
    [fetchInvoicesPage],
  );

  const goToSubscriptionInCompany = React.useCallback(() => {
    if (selectedBillingPlan.company_id && selectedBillingPlan.id) {
      openNewWindowToImpersonate(
        selectedBillingPlan.company_id,
        `/subscription/${selectedBillingPlan.id}`,
      );
    }
  }, [selectedBillingPlan.company_id, selectedBillingPlan.id]);

  const goToInvoiceInCompany = React.useCallback(
    (invoiceUuid: string) => {
      if (selectedBillingPlan.company_id) {
        openNewWindowToImpersonate(
          selectedBillingPlan.company_id,
          `/invoice/${invoiceUuid}/`,
        );
      }
    },
    [selectedBillingPlan.company_id],
  );

  return (
    <div className={classes.container}>
      <Button
        color="primary"
        disabled={!isCompanyAllowed}
        onClick={isCompanyAllowed && goToSubscriptionInCompany}
        startIcon={<ArrowForward />}
        variant="contained"
      >
        {t('franchise:userProfile.goToMemberProfile', {
          purchasing_studio: selectedBillingPlan.company_name,
        })}
      </Button>
      <FranchiseMemberSectionLayout
        title={t('subscription:franchiseUserProfile.associatedInvoices')}
      >
        {
          <Paper>
            <PaginatedListBase
              itemPerPage={FRANCHISE_BILLING_PLAN_PAGE_DEFAULT_SIZE}
              items={associatedInvoices}
              listProps={{ disablePadding: true }}
              loading={associatedInvoicesLoading}
              nbItems={associatedInvoicesCount}
              onPageRequested={onPageRequestHandler}
              page={associatedInvoicesPage}
              renderItem={(associatedInvoice: Invoice) => (
                <InvoiceListItem
                  disabled={!isCompanyAllowed}
                  invoice={associatedInvoice}
                  onClick={isCompanyAllowed && goToInvoiceInCompany}
                />
              )}
            ></PaginatedListBase>
          </Paper>
        }
      </FranchiseMemberSectionLayout>
      <FranchiseMemberSectionLayout
        title={
          selectedBillingPlan.payment_pack_template
            ? t('subscription:contract.paymentPack')
            : t('subscription:contract.privatePass')
        }
      >
        {
          <Paper>
            <FranchiseBillingPlanAssociatedPass
              goToPassTemplate={goToPassTemplate}
              passTemplate={associatedPass}
            />
          </Paper>
        }
      </FranchiseMemberSectionLayout>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

export default React.memo(FranchiseBillingPlanDetails);
