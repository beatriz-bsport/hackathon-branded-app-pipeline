import React from 'react';
import Immutable from 'seamless-immutable';

import type { ConnectedTrigger } from '#src/libs/sequential_marketing/types';
import type { SmartList } from '#src/libs/smart-list/types';

import { TriggerKind } from '#src/libs/sequential_marketing/constants';

import EventForm from './trigger_forms/EventForm.component';
import SmartlistForm from './trigger_forms/SmartlistForm.component';
import EventAndSmartlistForm from './trigger_forms/EventAndSmartlistForm.component';
import TimeoutForm from './trigger_forms/TimeoutForm.component';

type Props = {
  isFromMUIPopover?: boolean;
  trigger: ConnectedTrigger;
  kind: TriggerKind;
  smartlists: Immutable.ImmutableArray<SmartList>;
  updateValue?: (data: ConnectedTrigger) => void;
};

const ConnectedTriggerContent: React.FC<Props> = ({
  isFromMUIPopover,
  trigger,
  kind,
  smartlists,
  updateValue,
}) => {
  switch (kind) {
    case TriggerKind.ONLY_EVENT_TRIGGER:
      return (
        <EventForm
          isFromMUIPopover={isFromMUIPopover}
          trigger={trigger}
          updateValue={updateValue}
        />
      );
    case TriggerKind.ONLY_SMARTLIST_FILTERING:
      return (
        <SmartlistForm
          isFromMUIPopover={isFromMUIPopover}
          smartlists={smartlists}
          trigger={trigger}
          updateValue={updateValue}
        />
      );
    case TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING:
      return (
        <EventAndSmartlistForm
          isFromMUIPopover={isFromMUIPopover}
          smartlists={smartlists}
          trigger={trigger}
          updateValue={updateValue}
        />
      );
    case TriggerKind.ONLY_TIMEOUT:
      return <TimeoutForm trigger={trigger} updateValue={updateValue} />;
    default:
      return null;
  }
};

export default React.memo(ConnectedTriggerContent);
