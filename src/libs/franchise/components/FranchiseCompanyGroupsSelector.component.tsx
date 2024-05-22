import React from 'react';

import Chip from '@material-ui/core/Chip';
import { useTranslation } from 'react-i18next';
import type { CompanyGroup, CompanyOptionTypeBase } from '../types';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';

export type Props = {
  selectedCompanyGroups: CompanyOptionTypeBase[];
  companyGroups: CompanyGroup[];
  onChange: (companyGroups: CompanyOptionTypeBase[]) => void;
};

const FranchiseCompanyGroupsSelector: React.FC<Props> = ({
  selectedCompanyGroups,
  companyGroups,
  onChange,
}) => {
  const { t } = useTranslation('paymentPack');

  const availableCompanyGroupOptions = React.useMemo(
    () =>
      [...companyGroups]
        .filter((companyGroup) => companyGroup?.companies?.length > 0)
        .map((companyGroup) => ({
          label: companyGroup.name,
          value: `${companyGroup.id}`,
        })),
    [companyGroups],
  );

  const onDelete = React.useCallback(
    (chipDataValue: string) => () => {
      onChange(
        (selectedCompanyGroups || []).filter(
          (companyGroup) => companyGroup.value !== chipDataValue,
        ),
      );
    },
    [onChange, selectedCompanyGroups],
  );

  return (
    <MaterialUISelector
      isMulti
      chipsRenderer={(chip) => (
        <Chip
          label={chip.data?.label ?? ''}
          onDelete={onDelete(chip.data?.value)}
        />
      )}
      defaultNumberShown={Infinity}
      onChange={onChange}
      options={availableCompanyGroupOptions}
      placeholder={t('filters.companyGroupPlaceholder')}
      value={selectedCompanyGroups || []}
    />
  );
};

export default React.memo(FranchiseCompanyGroupsSelector);
