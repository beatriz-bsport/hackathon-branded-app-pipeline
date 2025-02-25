import React from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import type { Contract } from '../../types';

type Props = {
  contracts: Array<Contract>;
  contractId?: number;
  onChange: (value: number) => void;
  isDisabled?: boolean;
  placeholder?: string;
};

export const ContractSelector = (props: Props) => {
  const contractOptions = [...(props.contracts ?? [])].map((c) => ({
    label: c.name,
    value: c.id,
  }));
  const { t } = useTranslation('marketing');
  const selectedContractOption =
    contractOptions.find((pso) => pso.value === props.contractId) || null;
  return (
    <Select
      isDisabled={props.isDisabled}
      menuPortalTarget={document.querySelector('body')}
      onChange={(option) => {
        // @ts-expect-error
        props.onChange(option.value);
      }}
      options={contractOptions}
      placeholder={props.placeholder ?? t('notifications.fabLabels.contract')}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      value={selectedContractOption}
    />
  );
};

export default ContractSelector;
