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
import CadenceUtilityDialog, {
  DialogVariant,
} from '#libs/sequential_marketing/components/dialogs/DialogUtility';

type Props = {
  data: {
    isDeleteExitDialogHidden: boolean;
    doNotDisplayDeleteExitDialogAnymore: () => void;
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

  // ======================= DELETE EXIT DIALOG ========================
  const [isDeleteExitDialogOpen, setIsDeleteExitDialogOpen] =
    React.useState(false);

  const handleCloseDeleteExitDialog = React.useCallback(() => {
    setIsDeleteExitDialogOpen(false);
  }, []);

  const handleDeleteExit = React.useCallback(() => {
    if (data?.isDeleteExitDialogHidden) {
      data?.onDelete();
    } else {
      setIsDeleteExitDialogOpen(true);
    }
  }, [data]);

  const handleConfirmDeleteExitDialog = React.useCallback(
    (isChecked: boolean) => {
      handleCloseDeleteExitDialog();
      isChecked && data?.doNotDisplayDeleteExitDialogAnymore?.();
      data?.onDelete();
    },
    [data, handleCloseDeleteExitDialog],
  );
  // ===================================================================

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
          onDelete={handleDeleteExit}
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
      {isDeleteExitDialogOpen && (
        <CadenceUtilityDialog
          onCancel={handleCloseDeleteExitDialog}
          onConfirm={handleConfirmDeleteExitDialog}
          open={isDeleteExitDialogOpen}
          variant={DialogVariant.DELETE_EXIT}
        />
      )}
    </>
  );
};

export default React.memo(ExitCardFlowVersion);
