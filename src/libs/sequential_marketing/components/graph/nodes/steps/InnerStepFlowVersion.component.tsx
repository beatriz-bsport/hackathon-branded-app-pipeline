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
        isConnectable
        position={Position.Left}
        style={LEFT_HANDLE_STYLE}
        type={HandleTypeChoices.TARGET}
      />
      <InnerStepCard
        addMarketingAction={data.addMarketingAction}
        addNextStep={data.addNextStep}
        disableAddMarketingAction={data.disableAddMarketingAction}
        disabled={data.disabled}
        getEmailTemplate={data.getEmailTemplate}
        getTag={data.getTag}
        handleChangeInExit={data.handleChangeInExit}
        isSelected={data.isSelected}
        marketingActionList={data.marketingActionList}
        onCardClick={data.onCardClick}
        onDelete={data.onDelete}
        step={data.step}
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

export default React.memo(InnerStepFlowVersion);
