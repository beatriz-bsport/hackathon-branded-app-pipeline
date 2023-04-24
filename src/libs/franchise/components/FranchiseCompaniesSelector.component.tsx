// @ts-nocheck
import React from 'react';

import { compose } from 'recompose';
import { Chip } from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';
import { FranchiseCompany } from '../types';
import MaterialUISelector, {
  OptionTypeBase,
} from '../../../components/Selector/MaterialUISelector.component';
import CompanyChip from '../../../components/franchise/CompanyChip.component';

export type OwnProps = {
  selectedCompanies: OptionTypeBase[];
  companyDic: Record<number, FranchiseCompany>;
  companies?: FranchiseCompany[];
  withAllCompaniesTag?: boolean;
  menuPortalTarget?: HTMLElement;
  unclearable?: boolean;
  onChange: (companies: OptionTypeBase[]) => void;
};

type Props = OwnProps & WithTranslation;

const FranchiseCompaniesSelector = (props: Props) => {
  const {
    selectedCompanies,
    companyDic,
    companies,
    withAllCompaniesTag,
    menuPortalTarget,
    unclearable,
    onChange,
    t,
  } = props;
  const availableCompanies = React.useMemo(
    () =>
      [...companies]
        .filter((company) => company.isAllowed)
        .map((company) => ({
          label: company.name,
          value: `${company.id}`,
        })),
    [companies],
  );
  return (
    <MaterialUISelector
      options={availableCompanies}
      isMulti
      isClearable={!unclearable}
      value={selectedCompanies}
      onChange={onChange}
      placeholder={t('editor.selectorPlaceholder')}
      chipsRenderer={(chip) => {
        if (
          withAllCompaniesTag &&
          selectedCompanies.length === companies?.length
        ) {
          // Only display it once
          if (parseInt(chip.data?.value ?? '') === companies[0].id)
            return (
              <Chip
                color="primary"
                label={t('allCompanies')}
                onDelete={() => {
                  onChange([]);
                }}
              />
            );
          return null;
        }

        return (
          <CompanyChip
            company={companyDic[parseInt(chip.data?.value ?? '')]}
            onDelete={chip.onDelete}
          />
        );
      }}
      menuPortalTarget={menuPortalTarget}
      defaultNumberShown={Infinity}
    />
  );
};

export default compose<any, OwnProps>(
  withTranslation(['emailTemplate', 'notificationRule']),
)(FranchiseCompaniesSelector);
