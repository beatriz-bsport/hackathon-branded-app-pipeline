import React from 'react';

import { Handle, Position, Connection } from 'react-flow-renderer';

import EntryStepCard, { EntryStepCardProps } from './EntryStepCard.component';
import {
  RIGHT_HANDLE_STYLE,
  HandleTypeChoices,
} from '#libs/sequential_marketing/constants/steps';

type FlowProps = {
  data: {
    onConnectToStep: (destination_step_id: string) => void;
  } & EntryStepCardProps;
};

export const EntryStepFlowVersion: React.FC<FlowProps> = ({ data }) => {
  const handleConnect = React.useCallback(
    (params: Connection) => data.onConnectToStep(params.target),
    [data],
  );

  return (
    <>
      <EntryStepCard
        step={data.step}
        triggerList={data.triggerList}
        marketingActionList={data.marketingActionList}
        isSelected={data.isSelected}
        disabled={data.disabled}
        onCardClick={data.onCardClick}
        addNextStep={data.addNextStep}
        addMarketingAction={data.addMarketingAction}
        getTag={data.getTag}
        getEmailTemplate={data.getEmailTemplate}
      />
      <Handle
        type={HandleTypeChoices.SOURCE}
        position={Position.Right}
        style={RIGHT_HANDLE_STYLE}
        onConnect={handleConnect}
        isConnectable
      />
    </>
  );
};

export default React.memo(EntryStepFlowVersion);
