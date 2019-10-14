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

  t: TFunction,
};
export const PrivateSlotSelector = (props: Props) => {
  const privateServiceOptions = props.privateServices.asMutable().map((ps) => ({
    label: ps.name,
    value: ps.id,
  }));
  let privateSlotOptions = [];
  if (props.selectedPrivateService) {
    privateSlotOptions = props.privateServices
      .find((ps) => ps.id === props.selectedPrivateService.value)
      .slots.asMutable()
      .filter((s) => !!s)
      .filter((s) => s.available)
      .map((slot) => ({ value: slot.id, label: slot.name }));
  }
  return (
    <div>
      <Select
        placeholder={props.t('selector.privateService')}
        value={props.selectedPrivateService}
        options={privateServiceOptions}
        onChange={(option) => {
          props.setSelectedPrivateService(option);
          props.setSelectedPrivateSlot(null);
          props.onChange(null);
          if (props.onServiceChange) props.onServiceChange(option.value);
        }}
      />
      <Select
        placeholder={props.t('selector.privateSlot')}
        options={privateSlotOptions}
        isDisabled={!props.selectedPrivateService}
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
)(PrivateSlotSelector);
