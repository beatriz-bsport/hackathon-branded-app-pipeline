import React from 'react';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import { useTranslation } from 'react-i18next';

import omit from 'lodash/omit';
import FilterMenu from '#src/components/button/FilterMenu.component';
import type {
  CompanyGroup,
  FranchiseBillingPlanFilters,
  FranchiseBillingPlanFiltersOpener,
  CompanyOptionTypeBase,
} from '#src/libs/franchise/types';
import type { Company } from '#src/libs/company/types';

type Props = {
  companies: Company[];
  companyGroups: CompanyGroup[];
  emptyLabel: string;
  filters: FranchiseBillingPlanFilters;
  setFilters: (value: FranchiseBillingPlanFilters) => void;
};

/**
 * A filter component used to filter a User's BillingPlans in the Master Account User Profile.
 * The BillingPlans can be filtered on:
 * - Their validity:
 *   - Expired
 *   - Valid
 *   - Paused
 *   - Terminated
 * - The company where the subscription has been made
 * - The company group of the company where the subscription has been made
 * @properties
 * - emptyLabel: The label to display when there is no filter
 * - filter: The filters
 * - setFilters: A setter to set the filters
 * - companies: The list of the companies of the Franchise
 * - companyGroups: The list of the company groups of the Franchise
 *
 */

const FranchiseBillingPlanFiltersSelector: React.FC<Props> = ({
  companies,
  companyGroups,
  emptyLabel,
  filters,
  setFilters,
}) => {
  const { t } = useTranslation(['subscription', 'paymentPack']);

  const [companiesOptions, setCompaniesOptions] = React.useState<
    CompanyOptionTypeBase[]
  >([]);

  const [companyGroupsOptions, setCompanyGroupsOptions] = React.useState<
    CompanyOptionTypeBase[]
  >([]);

  const [open, setOpen] = React.useState<FranchiseBillingPlanFiltersOpener>({});

  const setFiltersValue = React.useCallback(
    (filterDict: FranchiseBillingPlanFilters) => {
      let newFilters = { ...filters };
      for (const [name, value] of Object.entries(filterDict)) {
        if (value === null) {
          newFilters = omit(newFilters, name);
        } else {
          // @ts-expect-error: newFilters[name] and value are of type boolean or number[] depending on the value of name
          newFilters[name as keyof FranchiseBillingPlanFilters] = value;
        }
      }
      setFilters(newFilters);
    },
    [filters, setFilters],
  );

  const setOpenValue = React.useCallback(
    (name: keyof FranchiseBillingPlanFiltersOpener) => {
      setOpen({
        ...open,
        [name]: !open[name],
      });
    },
    [open, setOpen],
  );

  const onOpen = React.useCallback(
    (name: keyof FranchiseBillingPlanFiltersOpener) => () => setOpenValue(name),
    [setOpenValue],
  );

  const onFilterChange = React.useCallback(
    (filterDict: FranchiseBillingPlanFilters) => () =>
      setFiltersValue(filterDict),
    [setFiltersValue],
  );

  const onChangeCompany = React.useCallback(
    (options: CompanyOptionTypeBase[]) => {
      setCompaniesOptions(options);
      setFiltersValue({
        company__in: options.map((option) => parseInt(option.value)),
      });
    },
    [setFiltersValue],
  );

  const onChangeCompanyGroup = React.useCallback(
    (options: CompanyOptionTypeBase[]) => {
      setCompanyGroupsOptions(options);
      setFiltersValue({
        company_group__in: options.map((option) => parseInt(option.value)),
      });
    },
    [setFiltersValue],
  );

  return (
    <FilterMenu
      emptyLabel={emptyLabel}
      menu={[
        {
          openFunction: onOpen('status'),
          label: t('paymentPack:filters.expiration'),
          open: open.status,
          subMenu: [
            {
              onClick: onFilterChange({
                is_valid: true,
                is_canceled: null,
                is_expired: null,
                is_paused: null,
              }),
              onDelete: onFilterChange({ is_valid: null }),
              icon: CheckCircleIcon,
              label: t('subscription:billingPlanStatus.valid'),
              show: filters.is_valid === true,
            },
            {
              onClick: onFilterChange({
                is_paused: true,
                is_canceled: null,
                is_expired: null,
                is_valid: null,
              }),
              onDelete: onFilterChange({ is_paused: null }),
              icon: PauseIcon,
              label: t('subscription:billingPlanStatus.paused'),
              show: filters.is_paused === true,
            },
            {
              onClick: onFilterChange({
                is_canceled: true,
                is_expired: null,
                is_paused: null,
                is_valid: null,
              }),
              onDelete: onFilterChange({ is_canceled: null }),
              icon: StopIcon,
              label: t('subscription:billingPlanStatus.canceled'),
              show: filters.is_canceled === true,
            },
            {
              onClick: onFilterChange({
                is_expired: true,
                is_canceled: null,
                is_paused: null,
                is_valid: null,
              }),
              onDelete: onFilterChange({ is_expired: null }),
              icon: CancelIcon,
              label: t('subscription:billingPlanStatus.expired'),
              show: filters.is_expired === true,
            },
          ],
        },
        {
          openFunction: onOpen('companies'),
          label: t('paymentPack:filters.company'),
          type: 'company',
          open: open.companies,
          onChangeCompany,
          companies: companies || [],
          selectedCompanies: companiesOptions,
        },
        {
          openFunction: onOpen('company_groups'),
          label: t('paymentPack:filters.companyGroup'),
          type: 'company_group',
          open: open.company_groups,
          onChangeCompany: onChangeCompanyGroup,
          companyGroups: companyGroups || [],
          selectedCompanyGroups: companyGroupsOptions,
        },
      ]}
    />
  );
};

export default React.memo(FranchiseBillingPlanFiltersSelector);
