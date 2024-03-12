import React from 'react';
import { Position } from 'react-flow-renderer';

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
import { CadencePopover } from '../internals/CadencePopover.component';

type Props = {
  data: {
    submitConvertIntoStep: (stepName: string) => void;
    editCadenceExit: (status: DestinationStatus) => void;
    position: { x: number; y: number };
  } & Omit<CadenceExitCardProps, 'onEdit' | 'handleConvertIntoStep'>;
};

export const ExitCardFlowVersion: React.FC<Props> = ({ data }) => {
  const exitCardRef = React.useRef<HTMLDivElement | null>(null);

  // ================== CONVERT INTO STEP BUBBLE ==================
  const [isConvertIntoStepBubbleVisible, setIsConvertIntoStepBubbleVisible] =
    React.useState(false);

  const handleOpenConvertIntoStepBubble = React.useCallback(
    () => setIsConvertIntoStepBubbleVisible(true),
    [setIsConvertIntoStepBubbleVisible],
  );

  const handleCloseConvertIntoStepBubble = React.useCallback(
    () => setIsConvertIntoStepBubbleVisible(false),
    [setIsConvertIntoStepBubbleVisible],
  );

  const handleSubmitConvertIntoStep = React.useCallback(
    (stepName: string) => {
      data?.submitConvertIntoStep?.(stepName);
      setIsConvertIntoStepBubbleVisible(false);
    },
    [data, setIsConvertIntoStepBubbleVisible],
  );
  // ==============================================================

  // ==================== EXIT EDITION BUBBLE =====================
  const [isExitEditionVisible, setisExitEditionVisible] = React.useState(false);

  const handleOpenExitEditionBubble = React.useCallback(
    () => setisExitEditionVisible(true),
    [],
  );

  const handleCloseExitEditionBubble = React.useCallback(
    () => setisExitEditionVisible(false),
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
      <CadencePopover
        handleOnClickAway={handleCloseConvertIntoStepBubble}
        height={exitCardRef?.current?.clientHeight}
        isVisible={isConvertIntoStepBubbleVisible}
        nodePosition={data.position}
        position={Position.Right}
        width={exitCardRef?.current?.clientWidth}
      >
        <ConvertIntoStepBubble
          onCancel={handleCloseConvertIntoStepBubble}
          onConfirm={handleSubmitConvertIntoStep}
        />
      </CadencePopover>
      <CadencePopover
        handleOnClickAway={handleCloseExitEditionBubble}
        height={exitCardRef?.current?.clientHeight}
        isVisible={isExitEditionVisible}
        nodePosition={data.position}
        position={Position.Right}
        width={exitCardRef?.current?.clientWidth}
      >
        <ConvertIntoExitBubble
          onCancel={handleCloseExitEditionBubble}
          onConfirm={handleEditCadenceExit}
        />
      </CadencePopover>
    </>
  );
};

export default React.memo(ExitCardFlowVersion);
