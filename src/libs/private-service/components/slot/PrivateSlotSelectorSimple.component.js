// @flow
import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Select from 'react-select';

type Props = {
  privateSlots: Array<PrivateService>,
  onChange: (value: ?number) => void,
  privateSlotId: ?number,
  isDisabled?: boolean,

  t: TFunction,
};
export const PrivateSlotSelectorSimple = (props: Props) => {
  const privateSlotsOptions = props.privateSlots.asMutable().map((ps) => ({
    label: ps.name,
    value: ps.id,
  }));
  const selectedOption =
    privateSlotsOptions.find((pso) => pso.value === props.privateSlotId) ||
    null;
  return (
    <Select
      placeholder={props.t('selector.privateSlot')}
      value={selectedOption}
      options={privateSlotsOptions}
      isDisabled={!!props.isDisabled}
      onChange={(option) => {
        props.onChange(option.value);
      }}
    />
  );
};

export default compose(withTranslation(['privateService']))(
  PrivateSlotSelectorSimple,
);
