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
      <Handle
        isConnectable
        position={Position.Top}
        style={HANDLE_BUTTON_STYLE}
        type="target"
      />
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
        style={HANDLE_BUTTON_STYLE}
        type="source"
      />
    </>
  );
};

export default StepNodeElementFlowVersion;
