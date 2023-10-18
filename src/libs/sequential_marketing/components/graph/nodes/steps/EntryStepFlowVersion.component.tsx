import React from 'react';

import { Handle, Position } from 'react-flow-renderer';

import EntryStepCard, { EntryStepCardProps } from './EntryStepCard.component';
import {
  RIGHT_HANDLE_STYLE,
  HandleTypeChoices,
} from '#libs/sequential_marketing/constants/steps';
import useConnectToStep from '#libs/sequential_marketing/components/graph/nodes/hooks/useConnectToStep.hook';
import MenuSelectorOnly from '#components/menu/menu-only';
import {
  SequentialMarketingColors,
  TriggerKind,
} from '#libs/sequential_marketing/constants';

type FlowProps = {
  data: {
    onConnectToStep: (destinationId: number, triggerKind: TriggerKind) => void;
  } & EntryStepCardProps;
};

export const EntryStepFlowVersion: React.FC<FlowProps> = ({ data }) => {
  const entryCardRef = React.useRef<HTMLDivElement | null>(null);

  const {
    stepDestinationId,
    triggerChoicesToConnectStepToStep,
    handleConnectStepWithLink,
  } = useConnectToStep(data.onConnectToStep);

  return (
    <>
      <div ref={entryCardRef}>
        <EntryStepCard
          addMarketingAction={data.addMarketingAction}
          addNextStep={data.addNextStep}
          disabled={data.disabled}
          getEmailTemplate={data.getEmailTemplate}
          getSmartlist={data.getSmartlist}
          getTag={data.getTag}
          isSelected={data.isSelected}
          marketingActionList={data.marketingActionList}
          onCardClick={data.onCardClick}
          step={data.step}
          triggerList={data.triggerList}
        />
      </div>
      <Handle
        isConnectable
        onConnect={handleConnectStepWithLink}
        position={Position.Right}
        style={RIGHT_HANDLE_STYLE}
        type={HandleTypeChoices.SOURCE}
      />
      <MenuSelectorOnly
        actionList={triggerChoicesToConnectStepToStep}
        anchorElement={!!stepDestinationId && entryCardRef.current}
        customHoverBackgroundColor={
          SequentialMarketingColors.TRIGGER_BACKGROUND_COLOR
        }
      />
    </>
  );
};

export default React.memo(EntryStepFlowVersion);
