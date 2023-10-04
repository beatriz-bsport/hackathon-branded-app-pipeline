import React from 'react';
import { Position } from 'react-flow-renderer';
import Popover from '@material-ui/core/Popover';

import HiddenHandle from '#libs/sequential_marketing/components/graph/handles/HiddenHandle.component';
import CadenceExitCard, {
  CadenceExitCardProps,
} from './CadenceExitCard.component';
import { TRIGGER_LEFT_HANDLE_STYLE } from '#libs/sequential_marketing/constants/triggers';
import { HandleTypeChoices } from '#libs/sequential_marketing/constants/steps';
import ChangeInStepBubble from '#libs/sequential_marketing/components/graph/bubbles/ChangeInStepBubble.component';
import usePopoverBubble from '../usePopoverBubble.hook';

type Props = {
  data: {
    submitChangeInStep: (stepName: string) => void;
  } & Omit<CadenceExitCardProps, 'handleChangeInStep'>;
};

export const ExitCardFlowVersion: React.FC<Props> = ({ data }) => {
  const exitCardRef = React.useRef<HTMLDivElement | null>(null);

  const { anchorOrigin, popoverStyle, transformOrigin, anchorEl, setAnchorEl } =
    usePopoverBubble();

  const handleOpenChangeInStepBubble = React.useCallback(
    () => setAnchorEl(exitCardRef?.current),
    [setAnchorEl],
  );

  const handleCloseChangeInStepBubble = React.useCallback(
    () => setAnchorEl(null),
    [setAnchorEl],
  );

  const handleSubmitChangeInStep = React.useCallback(
    (stepName: string) => {
      data?.submitChangeInStep?.(stepName);
      setAnchorEl(null);
    },
    [data, setAnchorEl],
  );

  return (
    <>
      <HiddenHandle
        position={Position.Left}
        style={TRIGGER_LEFT_HANDLE_STYLE}
        type={HandleTypeChoices.TARGET}
      />
      <div ref={exitCardRef}>
        <CadenceExitCard
          handleChangeInStep={handleOpenChangeInStepBubble}
          isSelected={data.isSelected}
          onDelete={data.onDelete}
          status={data.status}
        />
      </div>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        onClose={handleCloseChangeInStepBubble}
        open={!!anchorEl}
        PaperProps={popoverStyle}
        transformOrigin={transformOrigin}
      >
        <ChangeInStepBubble
          onCancel={handleCloseChangeInStepBubble}
          onConfirm={handleSubmitChangeInStep}
        />
      </Popover>
    </>
  );
};

export default React.memo(ExitCardFlowVersion);
