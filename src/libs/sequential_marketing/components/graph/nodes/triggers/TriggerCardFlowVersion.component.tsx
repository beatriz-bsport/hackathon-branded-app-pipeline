import React from 'react';
import { Position } from 'react-flow-renderer';
import { Popover } from '@material-ui/core';

import HiddenHandle from '#libs/sequential_marketing/components/graph/handles/HiddenHandle.component';
import TriggerCard, { type TriggerCardProps } from './TriggerCard.component';
import {
  TRIGGER_LEFT_HANDLE_STYLE,
  TRIGGER_RIGHT_HANDLE_STYLE,
} from '#libs/sequential_marketing/constants/triggers';
import { HandleTypeChoices } from '#libs/sequential_marketing/constants/steps';
import usePopoverBubble from '#libs/sequential_marketing/components/graph/nodes/usePopoverBubble.hook';
import UniqueTriggerBubble, {
  type Props as UniqueTriggerBubbleProps,
} from '#libs/sequential_marketing/components/graph/bubbles/UniqueTriggerBubble.component';
import { ConnectedTrigger } from '#libs/sequential_marketing/types';

type FlowProps = {
  data: TriggerCardProps & {
    bubble: Pick<UniqueTriggerBubbleProps, 'onConfirm' | 'smartlists'>;
  };
};

export const TriggerCardFlowVersion: React.FC<FlowProps> = ({ data }) => {
  const { anchorOrigin, popoverStyle, transformOrigin, anchorEl, setAnchorEl } =
    usePopoverBubble();

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      data.onCardClick?.(event);
      setAnchorEl(event?.currentTarget);
    },
    [data, setAnchorEl],
  );

  const handleCloseBubble = React.useCallback(
    () => setAnchorEl(null),
    [setAnchorEl],
  );

  const handleSubmitForm = React.useCallback(
    (trigger: ConnectedTrigger) => {
      data.bubble?.onConfirm?.(trigger);
    },
    [data.bubble],
  );

  return (
    <>
      <HiddenHandle
        position={Position.Left}
        style={TRIGGER_LEFT_HANDLE_STYLE}
        type={HandleTypeChoices.TARGET}
      />
      <TriggerCard
        disabled={data.disabled}
        getSmartlist={data.getSmartlist}
        isSelected={data.isSelected}
        onCardClick={handleClick}
        onDelete={data.onDelete}
        step={data.step}
        trigger={data.trigger}
      />
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
          trigger={data.trigger}
        />
      </Popover>
    </>
  );
};

export default React.memo(TriggerCardFlowVersion);
