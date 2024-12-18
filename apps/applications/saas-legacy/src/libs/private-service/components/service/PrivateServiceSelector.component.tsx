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
      id="private-service-selector"
      isDisabled={props.isDisabled}
      menuPortalTarget={document.querySelector('body')}
      onChange={(option) => {
        // @ts-expect-error
        props.onChange(option.value);
      }}
      options={privateServiceOptions}
      placeholder={
        props.placeholder ? props.placeholder : t('selector.privateService')
      }
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      value={selectedPrivateServiceOption}
    />
  );
};

export default PrivateServiceSelector;
