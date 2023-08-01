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
        addMarketingAction={data.addMarketingAction}
        addNextStep={data.addNextStep}
        disabled={data.disabled}
        getEmailTemplate={data.getEmailTemplate}
        getTag={data.getTag}
        isSelected={data.isSelected}
        marketingActionList={data.marketingActionList}
        onCardClick={data.onCardClick}
        step={data.step}
        triggerList={data.triggerList}
      />
      <Handle
        isConnectable
        onConnect={handleConnect}
        position={Position.Right}
        style={RIGHT_HANDLE_STYLE}
        type={HandleTypeChoices.SOURCE}
      />
    </>
  );
};

export default React.memo(EntryStepFlowVersion);
