import React from 'react';

import { Position } from 'react-flow-renderer';

import HiddenHandle from '#libs/sequential_marketing/components/graph/handles/HiddenHandle.component';
import TriggerCard, { TriggerCardProps } from './TriggerCard.component';
import {
  TRIGGER_LEFT_HANDLE_STYLE,
  TRIGGER_RIGHT_HANDLE_STYLE,
} from '#libs/sequential_marketing/constants/triggers';
import { HandleTypeChoices } from '#libs/sequential_marketing/constants/steps';

type FlowProps = {
  data: TriggerCardProps;
};

export const TriggerCardFlowVersion: React.FC<FlowProps> = ({ data }) => (
  <>
    <HiddenHandle
      type={HandleTypeChoices.TARGET}
      position={Position.Left}
      style={TRIGGER_LEFT_HANDLE_STYLE}
    />
    <TriggerCard
      step={data.step}
      trigger={data.trigger}
      isSelected={data.isSelected}
      disabled={data.disabled}
      onDelete={data.onDelete}
      getSmartlist={data.getSmartlist}
      onCardClick={data.onCardClick}
    />
    <HiddenHandle
      type={HandleTypeChoices.SOURCE}
      position={Position.Right}
      style={TRIGGER_RIGHT_HANDLE_STYLE}
    />
  </>
);

export default React.memo(TriggerCardFlowVersion);
