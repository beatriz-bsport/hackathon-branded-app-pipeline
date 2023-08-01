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
      <Handle isConnectable position={Position.Top} type="target" />
      <StepNodeElement
        cadenceEditMode={data.cadenceEditMode}
        handleSelectStepForSubscription={data.handleSelectStepForSubscription}
        onCardClick={data.onCardClick}
        onDelete={data.onDelete}
        step={data.step}
      />
      <Handle
        isConnectable
        onConnect={(params) => data.onConnectToStep(params.target)}
        position={Position.Bottom}
        style={{ background: '#555' }}
        type="source"
      />
    </>
  );
};

export default React.memo(StepNodeElementFlowVersion);
