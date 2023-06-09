import React from 'react';

import { Handle, Position } from 'react-flow-renderer';

import StepNodeElement, {
  StepNodeElementProps,
} from './StepNodeElement.component';
import { HANDLE_BUTTON_STYLE } from '#libs/sequential_marketingDEPRECATED/constants/index';

type FlowProps = {
  data: {
    onConnectToStep: (destination_step_id: string) => void;
  } & StepNodeElementProps;
};

export const StepNodeElementFlowVersion: React.FC<FlowProps> = ({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable />
      <StepNodeElement
        step={data.step}
        handleSelectStepForSubscription={data.handleSelectStepForSubscription}
        onCardClick={data.onCardClick}
        onDelete={data.onDelete}
        cadenceEditMode={data.cadenceEditMode}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={HANDLE_BUTTON_STYLE}
        onConnect={(params) => data.onConnectToStep(params.target)}
        isConnectable
      />
    </>
  );
};

export default StepNodeElementFlowVersion;
