// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import type { PrivateService, PrivateServiceWithSlots } from '../../types';

type Props = {
  privateServices: Array<PrivateService> | Array<PrivateServiceWithSlots>;
  privateServiceId?: number;
  onChange: (value: number) => void;
  isDisabled?: boolean;
  placeholder?: string;
};

export const PrivateServiceSelector = (props: Props) => {
  const { t } = useTranslation(['privateService']);
  const privateServiceOptions = [...props.privateServices].map((ps) => ({
    label: ps.name,
    value: ps.id,
  }));
  const selectedPrivateServiceOption =
    privateServiceOptions.find((pso) => pso.value === props.privateServiceId) ||
    null;
  return (
    <Select
      menuPortalTarget={document.querySelector('body')}
      placeholder={
        props.placeholder ? props.placeholder : t('selector.privateService')
      }
      value={selectedPrivateServiceOption}
      options={privateServiceOptions}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      isDisabled={props.isDisabled}
      onChange={(option) => {
        props.onChange(option.value);
      }}
    />
  );
};

export default PrivateServiceSelector;
