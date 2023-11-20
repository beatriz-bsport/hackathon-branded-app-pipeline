import React from 'react';
import { Position } from 'react-flow-renderer';
import Popover from '@material-ui/core/Popover';

import HiddenHandle from '#libs/sequential_marketing/components/graph/handles/HiddenHandle.component';
import CadenceExitCard, {
  CadenceExitCardProps,
} from './CadenceExitCard.component';
import {
  DestinationStatus,
  TRIGGER_LEFT_HANDLE_STYLE,
} from '#libs/sequential_marketing/constants/triggers';
import { HandleTypeChoices } from '#libs/sequential_marketing/constants/steps';
import ConvertIntoStepBubble from '#libs/sequential_marketing/components/graph/bubbles/ConvertIntoStepBubble.component';
import ConvertIntoExitBubble from '#libs/sequential_marketing/components/graph/bubbles/ConvertIntoExitBubble.component';
import usePopoverBubble from '#libs/sequential_marketing/components/graph/nodes/hooks/usePopoverBubble.hook';

type Props = {
  data: {
    submitConvertIntoStep: (stepName: string) => void;
    editCadenceExit: (status: DestinationStatus) => void;
  } & Omit<CadenceExitCardProps, 'onEdit' | 'handleConvertIntoStep'>;
};

export const ExitCardFlowVersion: React.FC<Props> = ({ data }) => {
  const exitCardRef = React.useRef<HTMLDivElement | null>(null);

  // ================== CONVERT INTO STEP BUBBLE ==================
  const { anchorOrigin, popoverStyle, transformOrigin, anchorEl, setAnchorEl } =
    usePopoverBubble();

  const handleOpenConvertIntoStepBubble = React.useCallback(
    () => setAnchorEl(exitCardRef?.current),
    [setAnchorEl],
  );

  const handleCloseConvertIntoStepBubble = React.useCallback(
    () => setAnchorEl(null),
    [setAnchorEl],
  );

  const handleSubmitConvertIntoStep = React.useCallback(
    (stepName: string) => {
      data?.submitConvertIntoStep?.(stepName);
      setAnchorEl(null);
    },
    [data, setAnchorEl],
  );
  // ==============================================================

  // ==================== EXIT EDITION BUBBLE =====================
  const [anchorExitEdition, setAnchorExitEdition] =
    React.useState<HTMLDivElement>(null);

  const handleOpenExitEditionBubble = React.useCallback(
    () => setAnchorExitEdition(exitCardRef?.current),
    [],
  );

  const handleCloseExitEditionBubble = React.useCallback(
    () => setAnchorExitEdition(null),
    [],
  );

  const handleEditCadenceExit = React.useCallback(
    (status: DestinationStatus) => {
      data?.editCadenceExit?.(status);
      handleCloseExitEditionBubble();
    },
    [data, handleCloseExitEditionBubble],
  );
  // ==============================================================

  return (
    <>
      <HiddenHandle
        position={Position.Left}
        style={TRIGGER_LEFT_HANDLE_STYLE}
        type={HandleTypeChoices.TARGET}
      />
      <div ref={exitCardRef}>
        <CadenceExitCard
          handleConvertIntoStep={handleOpenConvertIntoStepBubble}
          isSelected={data.isSelected}
          onDelete={data.onDelete}
          onEdit={handleOpenExitEditionBubble}
          status={data.status}
        />
      </div>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        onClose={handleCloseConvertIntoStepBubble}
        open={!!anchorEl}
        PaperProps={popoverStyle}
        transformOrigin={transformOrigin}
      >
        <ConvertIntoStepBubble
          onCancel={handleCloseConvertIntoStepBubble}
          onConfirm={handleSubmitConvertIntoStep}
        />
      </Popover>
      <Popover
        anchorEl={anchorExitEdition}
        anchorOrigin={anchorOrigin}
        onClose={handleCloseExitEditionBubble}
        open={!!anchorExitEdition}
        PaperProps={popoverStyle}
        transformOrigin={transformOrigin}
      >
        <ConvertIntoExitBubble
          onCancel={handleCloseExitEditionBubble}
          onConfirm={handleEditCadenceExit}
        />
      </Popover>
    </>
  );
};

export default React.memo(ExitCardFlowVersion);
