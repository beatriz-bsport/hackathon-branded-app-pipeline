import React from 'react';

import { Position } from 'react-flow-renderer';

import HiddenHandle from '#libs/sequential_marketing/components/graph/handles/HiddenHandle.component';
import CadenceExitCard, {
  CadenceExitCardProps,
} from './CadenceExitCard.component';
import { TRIGGER_LEFT_HANDLE_STYLE } from '#libs/sequential_marketing/constants/triggers';
import { HandleTypeChoices } from '#libs/sequential_marketing/constants/steps';

type FlowProps = {
  data: CadenceExitCardProps;
};

export const ExitCardFlowVersion: React.FC<FlowProps> = ({ data }) => (
  <>
    <HiddenHandle
      type={HandleTypeChoices.TARGET}
      position={Position.Left}
      style={TRIGGER_LEFT_HANDLE_STYLE}
    />
    <CadenceExitCard
      step={data.step}
      status={data.status}
      handleChangeInStep={data.handleChangeInStep}
      onDelete={data.onDelete}
      isSelected={data.isSelected}
    />
  </>
);

export default React.memo(ExitCardFlowVersion);
