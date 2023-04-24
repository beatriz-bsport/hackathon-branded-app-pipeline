// @ts-nocheck
import React from 'react';

import { Handle, Position } from 'react-flow-renderer';

import ExitStepNodeElement from './ExitStepNodeElement.component ';

export const ExitStepNodeElementFlowVersion: React.FC = () => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
        isConnectable
      />
      <ExitStepNodeElement />
    </>
  );
};

export default ExitStepNodeElementFlowVersion;
