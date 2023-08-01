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
      position={Position.Left}
      style={TRIGGER_LEFT_HANDLE_STYLE}
      type={HandleTypeChoices.TARGET}
    />
    <TriggerCard
      disabled={data.disabled}
      getSmartlist={data.getSmartlist}
      isSelected={data.isSelected}
      onCardClick={data.onCardClick}
      onDelete={data.onDelete}
      step={data.step}
      trigger={data.trigger}
    />
    <HiddenHandle
      position={Position.Right}
      style={TRIGGER_RIGHT_HANDLE_STYLE}
      type={HandleTypeChoices.SOURCE}
    />
  </>
);

export default React.memo(TriggerCardFlowVersion);
