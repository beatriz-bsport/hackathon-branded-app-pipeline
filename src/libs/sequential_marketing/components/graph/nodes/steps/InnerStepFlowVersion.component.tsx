import React from 'react';

import { Connection, Handle, Position } from 'react-flow-renderer';

import InnerStepCard, { InnerStepCardProps } from './InnerStepCard.component';
import {
  LEFT_HANDLE_STYLE,
  RIGHT_HANDLE_STYLE,
  HandleTypeChoices,
} from '#libs/sequential_marketing/constants/steps';

type FlowProps = {
  data: {
    onConnectToStep: (destination_step_id: string) => void;
  } & InnerStepCardProps;
};

export const InnerStepFlowVersion: React.FC<FlowProps> = ({ data }) => {
  const handleConnect = React.useCallback(
    (params: Connection) => data.onConnectToStep(params.target),
    [data],
  );

  return (
    <>
      <Handle
        type={HandleTypeChoices.TARGET}
        position={Position.Left}
        style={LEFT_HANDLE_STYLE}
        isConnectable
      />
      <InnerStepCard
        step={data.step}
        marketingActionList={data.marketingActionList}
        isSelected={data.isSelected}
        disabled={data.disabled}
        disableAddMarketingAction={data.disableAddMarketingAction}
        onDelete={data.onDelete}
        handleChangeInExit={data.handleChangeInExit}
        onCardClick={data.onCardClick}
        addNextStep={data.addNextStep}
        getTag={data.getTag}
        getEmailTemplate={data.getEmailTemplate}
        addMarketingAction={data.addMarketingAction}
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

export default React.memo(InnerStepFlowVersion);
