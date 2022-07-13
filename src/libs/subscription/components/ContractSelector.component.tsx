// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import type { Contract } from '../types';

type Props = {
  contracts: Array<Contract>;
  contractId?: number;
  onChange: (value: number) => void;
  isDisabled?: boolean;
  placeholder?: string;
};

export const ContractSelector = (props: Props) => {
  const contractOptions = [...(props.contracts || [])].map((c) => ({
    label: c.name,
    value: c.id,
  }));
  const { t } = useTranslation('marketing');
  const selectedContractOption =
    contractOptions.find((pso) => pso.value === props.contractId) || null;
  return (
    <Select
      menuPortalTarget={document.querySelector('body')}
      value={selectedContractOption}
      options={contractOptions}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      placeholder={props.placeholder ?? t('notifications.fabLabels.contract')}
      isDisabled={props.isDisabled}
      onChange={(option) => {
        props.onChange(option.value);
      }}
    />
  );
};

export default ContractSelector;
