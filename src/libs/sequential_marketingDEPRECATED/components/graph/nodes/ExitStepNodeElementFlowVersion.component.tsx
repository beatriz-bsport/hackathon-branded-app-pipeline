import React from 'react';

import { Handle, Position } from 'react-flow-renderer';

import ExitStepNodeElement from './ExitStepNodeElement.component ';
import { HANDLE_BUTTON_STYLE } from '#libs/sequential_marketingDEPRECATED/constants/index';

export const ExitStepNodeElementFlowVersion: React.FC = () => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={HANDLE_BUTTON_STYLE}
        isConnectable
      />
      <ExitStepNodeElement />
    </>
  );
};

export default ExitStepNodeElementFlowVersion;
