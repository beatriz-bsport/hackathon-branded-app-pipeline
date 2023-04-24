// @ts-nocheck
import React from 'react';

import { Handle, Position } from 'react-flow-renderer';

import StepNodeElement, {
  StepNodeElementProps,
} from './StepNodeElement.component';

type FlowProps = {
  data: {
    onConnectToStep: (destination_step_id: string) => void;
  } & StepNodeElementProps;
};

export const StepNodeElementFlowVersion: React.FC<FlowProps> = ({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <StepNodeElement
        step={data.step}
        handleSelectStepForSubscription={data.handleSelectStepForSubscription}
        onCardClick={data.onCardClick}
        onDelete={data.onDelete}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555' }}
        onConnect={(params) => data.onConnectToStep(params.target)}
        isConnectable
      />
    </>
  );
};

export default StepNodeElementFlowVersion;
