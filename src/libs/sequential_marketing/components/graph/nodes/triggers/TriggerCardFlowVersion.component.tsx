import React from 'react';
import { Position } from 'react-flow-renderer';
import Popover from '@material-ui/core/Popover';

import {
  TRIGGER_LEFT_HANDLE_STYLE,
  TRIGGER_RIGHT_HANDLE_STYLE,
  TriggerKind,
} from '#libs/sequential_marketing/constants/triggers';
import { changeConnectedTriggerKind } from '#libs/sequential_marketing/components/graph/hooks/utils';
import { HandleTypeChoices } from '#libs/sequential_marketing/constants/steps';
import { isTriggerFake } from '#libs/sequential_marketing/components/helpers/utils';
import usePopoverBubble from '#libs/sequential_marketing/components/graph/nodes/hooks/usePopoverBubble.hook';
import HiddenHandle from '#libs/sequential_marketing/components/graph/handles/HiddenHandle.component';

import TriggerCard, { type TriggerCardProps } from './TriggerCard.component';
import UniqueTriggerBubble from '#libs/sequential_marketing/components/graph/bubbles/UniqueTriggerBubble.component';
import type { ConnectedTrigger } from '#libs/sequential_marketing/types';

type FlowProps = {
  data: TriggerCardProps & {
    bubble: Pick<
      React.ComponentProps<typeof UniqueTriggerBubble>,
      'onConfirm' | 'smartlists'
    >;
    resetFakerTrigger: () => void;
  };
};

export const TriggerCardFlowVersion: React.FC<FlowProps> = ({ data }) => {
  const [newTriggerKind, setNewTriggerKind] =
    React.useState<TriggerKind | null>(null);

  const triggerCardRef = React.useRef<HTMLDivElement | null>(null);

  const { anchorOrigin, popoverStyle, transformOrigin, anchorEl, setAnchorEl } =
    usePopoverBubble();

  React.useEffect(() => {
    if (isTriggerFake(data?.trigger)) {
      setAnchorEl(triggerCardRef?.current);
    }
  }, [data?.trigger, setAnchorEl]);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      data.onCardClick?.(event);
      setAnchorEl(event?.currentTarget);
    },
    [data, setAnchorEl],
  );

  const handleCloseBubble = React.useCallback(() => {
    setAnchorEl(null);
    isTriggerFake(data?.trigger) && data?.resetFakerTrigger?.();
  }, [data, setAnchorEl]);

  const handleSubmitForm = React.useCallback(
    (trigger: ConnectedTrigger) => {
      data.bubble?.onConfirm?.(trigger);
      setAnchorEl(null);
    },
    [data.bubble, setAnchorEl],
  );

  const handleChangeConnectedTriggerKind = React.useCallback(
    (triggerKind: TriggerKind) => {
      setNewTriggerKind(triggerKind);
      setAnchorEl(triggerCardRef?.current);
    },
    [setAnchorEl],
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
          changeConnectedTriggerKind={handleChangeConnectedTriggerKind}
          disabled={data.disabled}
          getSmartlist={data.getSmartlist}
          isSelected={data.isSelected}
          onCardClick={handleClick}
          onDelete={data.onDelete}
          step={data.step}
          trigger={data.trigger}
        />
      </div>
      <HiddenHandle
        position={Position.Right}
        style={TRIGGER_RIGHT_HANDLE_STYLE}
        type={HandleTypeChoices.SOURCE}
      />
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        onClose={handleCloseBubble}
        open={!!anchorEl}
        PaperProps={popoverStyle}
        transformOrigin={transformOrigin}
      >
        <UniqueTriggerBubble
          onCancel={handleCloseBubble}
          onConfirm={handleSubmitForm}
          smartlists={data?.bubble?.smartlists}
          trigger={
            newTriggerKind !== null
              ? changeConnectedTriggerKind(data.trigger, newTriggerKind)
              : data.trigger
          }
        />
      </Popover>
    </>
  );
};

export default React.memo(TriggerCardFlowVersion);
