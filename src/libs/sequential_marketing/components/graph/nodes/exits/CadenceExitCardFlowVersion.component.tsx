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
      position={Position.Left}
      style={TRIGGER_LEFT_HANDLE_STYLE}
      type={HandleTypeChoices.TARGET}
    />
    <CadenceExitCard
      handleChangeInStep={data.handleChangeInStep}
      isSelected={data.isSelected}
      onDelete={data.onDelete}
      status={data.status}
      step={data.step}
    />
  </>
);

export default React.memo(ExitCardFlowVersion);
