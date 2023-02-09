import React from 'react';
import { Handle, Position, Connection } from 'react-flow-renderer';

import { NodeIdentifiersEnum } from '../hooks';

import EntryStepNodeElement, {
  EntryStepNodeElementProps,
} from './EntryStepNodeElement.component';

type Props = {
  data: EntryStepNodeElementProps & {
    onConnectToStep: (destination_step_id: number) => void;
  };
};

export const EntryStepNodeElementFlowVersion: React.FC<Props> = ({ data }) => {
  const isValidConnection = React.useCallback((connection: Connection) => {
    if (connection.target !== NodeIdentifiersEnum.EXIT_NODE_IDENTIFIER) {
      return true;
    }
    return false;
  }, []);

  return (
    <>
      <EntryStepNodeElement
        step={data.step}
        cadence={data.cadence}
        onCardClick={data.onCardClick}
        handleSelectStepForSubscription={data.handleSelectStepForSubscription}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555' }}
        onConnect={(params) => data.onConnectToStep(parseInt(params.target))}
        isValidConnection={isValidConnection}
        isConnectable
      />
    </>
  );
};

export default EntryStepNodeElementFlowVersion;
