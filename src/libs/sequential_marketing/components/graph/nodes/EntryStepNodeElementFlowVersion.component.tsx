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
        cadence={data.cadence}
        handleSelectStepForSubscription={data.handleSelectStepForSubscription}
        onCardClick={data.onCardClick}
        smartlistById={data.smartlistById}
        step={data.step}
      />
      <Handle
        isConnectable
        isValidConnection={isValidConnection}
        onConnect={(params) => data.onConnectToStep(parseInt(params.target))}
        position={Position.Bottom}
        style={{ background: '#555' }}
        type="source"
      />
    </>
  );
};

export default React.memo(EntryStepNodeElementFlowVersion);
