import React from 'react';
import { Position } from 'react-flow-renderer';

import {
  TRIGGER_LEFT_HANDLE_STYLE,
  TRIGGER_RIGHT_HANDLE_STYLE,
  TriggerKind,
} from '#libs/sequential_marketing/constants/triggers';
import { changeConnectedTriggerKind } from '#libs/sequential_marketing/components/graph/hooks/utils';
import { HandleTypeChoices } from '#libs/sequential_marketing/constants/steps';
import { isTriggerFake } from '#libs/sequential_marketing/components/helpers/utils';
import HiddenHandle from '#libs/sequential_marketing/components/graph/handles/HiddenHandle.component';

import TriggerCard, { type TriggerCardProps } from './TriggerCard.component';
import UniqueTriggerBubble from '#libs/sequential_marketing/components/graph/bubbles/UniqueTriggerBubble.component';
import type { ConnectedTrigger } from '#libs/sequential_marketing/types';
import { CadencePopover } from '../internals/CadencePopover.component';

type FlowProps = {
  data: TriggerCardProps & {
    bubble: Pick<
      React.ComponentProps<typeof UniqueTriggerBubble>,
      'onConfirm' | 'smartlists'
    >;
    canBeDeleted: boolean;
    resetFakerTrigger: () => void;
    position: { x: number; y: number };
  };
};

export const TriggerCardFlowVersion: React.FC<FlowProps> = ({ data }) => {
  const [newTriggerKind, setNewTriggerKind] =
    React.useState<TriggerKind | null>(null);

  const triggerCardRef = React.useRef<HTMLDivElement | null>(null);

  const [isUniqueTriggerBubbleVisible, setIsUniqueTriggerBubbleVisible] =
    React.useState(false);
  React.useEffect(() => {
    if (isTriggerFake(data?.trigger)) {
      setIsUniqueTriggerBubbleVisible(true);
    }
  }, [data?.trigger, setIsUniqueTriggerBubbleVisible]);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      data?.onCardClick?.(event);
      setIsUniqueTriggerBubbleVisible(true);
    },
    [data, setIsUniqueTriggerBubbleVisible],
  );

  const handleCloseBubble = React.useCallback(() => {
    setIsUniqueTriggerBubbleVisible(false);
    isTriggerFake(data?.trigger) && data?.resetFakerTrigger?.();
  }, [data, setIsUniqueTriggerBubbleVisible]);

  const handleSubmitForm = React.useCallback(
    (trigger: ConnectedTrigger) => {
      data?.bubble?.onConfirm?.(trigger);
      setIsUniqueTriggerBubbleVisible(false);
    },
    [data?.bubble, setIsUniqueTriggerBubbleVisible],
  );

  const handleChangeConnectedTriggerKind = React.useCallback(
    (triggerKind: TriggerKind) => {
      setNewTriggerKind(triggerKind);
      setIsUniqueTriggerBubbleVisible(true);
    },
    [setIsUniqueTriggerBubbleVisible],
  );

  return (
    <>
      <HiddenHandle
        position={Position.Left}
        style={TRIGGER_LEFT_HANDLE_STYLE}
        type={HandleTypeChoices.TARGET}
      />
      <div ref={triggerCardRef}>
        <TriggerCard
          canBeDeleted={data?.canBeDeleted}
          changeConnectedTriggerKind={handleChangeConnectedTriggerKind}
          disabled={data?.disabled}
          getSmartlist={data?.getSmartlist}
          isSelected={data?.isSelected}
          onCardClick={handleClick}
          onDelete={data?.onDelete}
          step={data?.step}
          trigger={data?.trigger}
        />
      </div>
      <HiddenHandle
        position={Position.Right}
        style={TRIGGER_RIGHT_HANDLE_STYLE}
        type={HandleTypeChoices.SOURCE}
      />
      <CadencePopover
        handleOnClickAway={handleCloseBubble}
        height={triggerCardRef?.current?.clientHeight}
        isVisible={isUniqueTriggerBubbleVisible}
        nodePosition={data.position}
        position={Position.Right}
        width={triggerCardRef?.current?.clientWidth}
      >
        <UniqueTriggerBubble
          onCancel={handleCloseBubble}
          onConfirm={handleSubmitForm}
          smartlists={data?.bubble?.smartlists}
          trigger={
            newTriggerKind !== null
              ? changeConnectedTriggerKind(data?.trigger, newTriggerKind)
              : data?.trigger
          }
        />
      </CadencePopover>
    </>
  );
};

export default React.memo(TriggerCardFlowVersion);
