import React from 'react';

import { Handle, Position } from 'react-flow-renderer';

import ExitStepNodeElement from './ExitStepNodeElement.component ';

export const ExitStepNodeElementFlowVersion: React.FC = () => {
  return (
    <>
      <Handle
        isConnectable
        position={Position.Top}
        style={{ background: '#555' }}
        type="target"
      />
      <ExitStepNodeElement />
    </>
  );
};

export default React.memo(ExitStepNodeElementFlowVersion);
