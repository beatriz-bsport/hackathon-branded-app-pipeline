// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Select from 'react-select';

type Option = { label: string, value: number };
type Props = {
  privateServices: Array<PrivateService>,
  onChange: (Option) => void,
  selectedPrivateService: ?number,
  setSelectedPrivateService: (id: number) => void,
  setSelectedPrivateSlot: (id: number) => void,
  selectedPrivateSlot: (id: number) => void,
  onServiceChange: (value: ?number) => void,

  setSlotEditable: (boolean) => void,
  slotEditable: boolean,

  t: TFunction,
};

const slotOptionsFromServiceOption = (serviceOption, serviceList) => {
  if (serviceOption) {
    const selectedService = serviceList.find(
      (ps) => ps.id === serviceOption.value,
    );
    return selectedService
      ? [...selectedService.slots]
          .filter((s) => !!s)
          .filter((s) => s.available)
          .map((slot) => ({ value: slot.id, label: slot.name }))
      : [];
  }
  return [];
};

export const PrivateSlotSelector = (props: Props) => {
  const privateServiceOptions = [...props.privateServices].map((ps) => ({
    label: ps.name,
    value: ps.id,
  }));

  const privateSlotOptions = slotOptionsFromServiceOption(
    props.selectedPrivateService,
    props.privateServices,
  );

  return (
    <div>
      <Select
        placeholder={props.t('selector.privateService')}
        value={props.selectedPrivateService}
        options={privateServiceOptions}
        onChange={(option) => {
          props.setSlotEditable(true);
          props.setSelectedPrivateService(option);
          const slotOptions = slotOptionsFromServiceOption(
            option,
            props.privateServices,
          );
          if (slotOptions.length === 1) {
            props.setSelectedPrivateSlot(slotOptions[0]);
            props.onChange(slotOptions[0]);
            props.setSlotEditable(false);
            if (props.onServiceChange) props.onServiceChange(option.value);
          } else {
            props.setSelectedPrivateSlot(null);
            props.onChange(null);
            if (props.onServiceChange) props.onServiceChange(option.value);
          }
        }}
      />
      <Select
        placeholder={props.t('selector.privateSlot')}
        options={privateSlotOptions}
        isDisabled={!props.selectedPrivateService || !props.slotEditable}
        value={props.selectedPrivateSlot}
        onChange={(option) => {
          props.setSelectedPrivateSlot(option);
          props.onChange(option);
        }}
      />
    </div>
  );
};

export default compose(
  withNamespaces(['privateService']),
  withState('selectedPrivateService', 'setSelectedPrivateService', null),
  withState('selectedPrivateSlot', 'setSelectedPrivateSlot', null),
  withState('slotEditable', 'setSlotEditable', true),
)(PrivateSlotSelector);
