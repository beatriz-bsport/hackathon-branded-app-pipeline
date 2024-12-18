import React from 'react';

import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CheckSharpIcon from '@material-ui/icons/CheckSharp';
import { useTranslation } from 'react-i18next';

import omit from 'lodash/omit';
import FilterMenu from '#src/components/button/FilterMenu.component';
import type {
  CompanyGroup,
  FranchisePassFilters,
  FranchisePassFiltersOpener,
  CompanyOptionTypeBase,
} from '#src/libs/franchise/types';
import type { Company } from '#src/libs/company/types';

type Props = {
  emptyLabel: string;
  filters: FranchisePassFilters;
  setFilters: (value: FranchisePassFilters) => void;
  companies: Company[];
  companyGroups: CompanyGroup[];
};

/**
 * A generic filter component used to filter a User's ConsumerPaymentPacks or PrivateConsumerPasses in the Master Account User Profile.
 * The ConsumerPaymentPacks or PrivateConsumerPasses can be filtered on:
 * - Their validity:
 *   - Expired
 *   - Active
 *   - Valid
 * - Their invoice's status:
 *   - Cancelled invoices
 *   - Valid invoices
 * - Their credits:
 *   - With credits
 *   - Without credits
 * - The company where they has been purchased
 * - The company group of the company where they has been purchased
 * @properties
 * - emptyLabel: The label to displat when there is no filter
 * - filter: The filters
 * - setFilters: A setter to set the filters
 * - companies: The list of the companies of the Franchise
 * - companyGroups: The list of the company groups of the Franchise
 *
 */

const FranchiseConsumerPassFilters: React.FC<Props> = ({
  emptyLabel,
  filters,
  setFilters,
  companies,
  companyGroups,
}) => {
  const { t } = useTranslation('paymentPack');

  const [companiesOptions, setCompaniesOptions] = React.useState<
    CompanyOptionTypeBase[]
  >([]);
  const [companyGroupsOptions, setCompanyGroupsOptions] = React.useState<
    CompanyOptionTypeBase[]
  >([]);
  const [open, setOpen] = React.useState<FranchisePassFiltersOpener>({});

  const setFiltersValue = React.useCallback(
    (filterDict: FranchisePassFilters) => {
      let newFilters = { ...filters };
      for (const [name, value] of Object.entries(filterDict)) {
        if (value === null) {
          newFilters = omit(newFilters, name);
        } else {
          // @ts-expect-error: newFilters[name] and value are of type boolean or number[] depending on the value of name
          newFilters[name as keyof FranchisePassFilters] = value;
        }
      }
      setFilters(newFilters);
    },
    [filters, setFilters],
  );

  const setOpenValue = React.useCallback(
    (name: keyof FranchisePassFiltersOpener) => {
      setOpen({
        ...open,
        [name]: !open[name],
      });
    },
    [open, setOpen],
  );

  const onOpen = React.useCallback(
    (name: keyof FranchisePassFiltersOpener) => () => setOpenValue(name),
    [setOpenValue],
  );

  const onFilterChange = React.useCallback(
    (filterDict: FranchisePassFilters) => () => setFiltersValue(filterDict),
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
          openFunction: onOpen('expiration'),
          label: t('filters.expiration'),
          open: open.expiration,
          subMenu: [
            {
              onClick: onFilterChange({
                is_expired: true,
                is_valid_today: null,
              }),
              onDelete: onFilterChange({ is_expired: null }),
              icon: HourglassFullIcon,
              label: t('filters.isExpired'),
              show: filters.is_expired,
            },
            {
              onClick: onFilterChange({
                is_expired: false,
                is_valid_today: null,
              }),
              onDelete: onFilterChange({ is_expired: null }),
              icon: AccessTimeIcon,
              label: t('filters.isActive'),
              show: filters.is_expired === false,
            },
            {
              onClick: onFilterChange({
                is_valid_today: true,
                is_expired: null,
              }),
              onDelete: onFilterChange({ is_valid_today: null }),
              icon: CheckCircleOutlineIcon,
              label: t('filters.isValidToday'),
              show: filters.is_valid_today === true,
            },
          ],
        },
        {
          openFunction: onOpen('reverted'),
          label: t('filters.invoice'),
          open: open.reverted,
          subMenu: [
            {
              onClick: onFilterChange({ reverted: true }),
              onDelete: onFilterChange({ reverted: null }),
              icon: CancelIcon,
              label: t('filters.reverted'),
              show: filters.reverted,
            },
            {
              onClick: onFilterChange({ reverted: false }),
              onDelete: onFilterChange({ reverted: null }),
              icon: CheckSharpIcon,
              label: t('filters.notReverted'),
              show: filters.reverted === false,
            },
          ],
        },
        {
          openFunction: onOpen('credit_left'),
          label: t('filters.credits'),
          open: open.credit_left,
          subMenu: [
            {
              onClick: onFilterChange({ has_credit_left: true }),
              onDelete: onFilterChange({ has_credit_left: null }),
              icon: AttachMoneyIcon,
              label: t('filters.hasCreditLeft'),
              show: filters.has_credit_left,
            },
            {
              onClick: onFilterChange({ has_credit_left: false }),
              onDelete: onFilterChange({ has_credit_left: null }),
              icon: MoneyOffIcon,
              label: t('filters.hasCreditNull'),
              show: filters.has_credit_left === false,
            },
          ],
        },
        {
          openFunction: onOpen('companies'),
          label: t('filters.company'),
          type: 'company',
          open: open.companies,
          onChangeCompany,
          companies: companies || [],
          selectedCompanies: companiesOptions,
        },
        {
          openFunction: onOpen('company_groups'),
          label: t('filters.companyGroup'),
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

export default React.memo(FranchiseConsumerPassFilters);
