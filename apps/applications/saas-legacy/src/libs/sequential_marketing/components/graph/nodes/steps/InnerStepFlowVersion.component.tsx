import React from 'react';
import { useTranslation } from 'react-i18next';
import { Handle, Position } from 'react-flow-renderer';

import type {
  MarketingActionEssentials,
  StepMarketingActions,
} from '#src/libs/sequential_marketing/types';

import {
  LEFT_HANDLE_STYLE,
  RIGHT_HANDLE_STYLE,
  HandleTypeChoices,
} from '#src/libs/sequential_marketing/constants/steps';
import {
  DestinationStatus,
  MarketingActions,
  SequentialMarketingColors,
  TriggerKind,
} from '#src/libs/sequential_marketing/constants';
import { getMarketingActionPartialValues } from '#src/libs/sequential_marketing/components/form/marketing_actions/utils';

import ConvertIntoExitBubble from '#src/libs/sequential_marketing/components/graph/bubbles/ConvertIntoExitBubble.component';
import MenuSelectorOnly from '#src/components/menu/menu-only';
import CadenceUtilityDialog, {
  DialogVariant,
} from '#src/libs/sequential_marketing/components/dialogs/DialogUtility';
import StepNameEditionBubble from '#src/libs/sequential_marketing/components/graph/bubbles/StepNameEditionBubble.component';
import UniqueMarketingActionBubble from '#src/libs/sequential_marketing/components/graph/bubbles/UniqueMarketingActionBubble.component';
import useConnectToStep from '#src/libs/sequential_marketing/components/graph/nodes/hooks/useConnectToStep.hook';

import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import InnerStepCard, {
  type InnerStepCardProps,
} from './InnerStepCard.component';
import { CadencePopover } from '../internals/CadencePopover.component';

const { trackFormAdd, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.Audience,
  );

type FlowProps = {
  data: {
    marketingActionEssentials: MarketingActionEssentials;
    stepToEditId: number;
    isDeleteStepDialogHidden: boolean;
    isConvertStepIntoExitDialogHidden: boolean;
    deleteStepMarketingAction: (data: { id: number; stepId: number }) => void;
    doNotDisplayConvertStepIntoExitDialogAnymore: () => void;
    doNotDisplayDeleteStepDialogAnymore: () => void;
    endStepEdition: () => void;
    position: { x: number; y: number };
    onConnectToStep: (destinationId: number, triggerKind: TriggerKind) => void;
    submitConvertIntoExit: (status: DestinationStatus) => void;
    submitMarketingActionForm: (data: {
      list: StepMarketingActions[];
      stepId: number;
    }) => void;
    updateCadenceStepName: (data: { name: string; stepId: number }) => void;
    upsertMarketingAction: (value: Partial<StepMarketingActions>) => void;
  } & InnerStepCardProps;
};

export const InnerStepFlowVersion: React.FC<FlowProps> = ({ data }) => {
  const { t } = useTranslation('marketing');

  const stepCardRef = React.useRef<HTMLDivElement | null>(null);

  const {
    stepDestinationId,
    triggerChoicesToConnectStepToStep,
    handleConnectStepWithLink,
  } = useConnectToStep(data.onConnectToStep);

  const isStepNew =
    !!data?.stepToEditId &&
    !!data.step?.id &&
    data.stepToEditId === data.step.id;

  // ==================== STEP NAME EDITION BUBBLE =====================
  const [isStepNameEditionBubbleVisible, setIsStepNameEditionBubble] =
    React.useState(false);
  /**
   * @description The handleClick function is used to open the popover step name edition bubble on card click
   */
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      data?.onCardClick?.(event);
      setIsStepNameEditionBubble((prevState) => !prevState);
    },
    [data, setIsStepNameEditionBubble],
  );

  const handleCloseStepNameEditionBubble = React.useCallback(() => {
    setIsStepNameEditionBubble(false);
    isStepNew && data?.endStepEdition?.();
  }, [data, isStepNew, setIsStepNameEditionBubble]);

  const handleEditStepName = React.useCallback(
    (param: { name: string; stepId: number }) => {
      data.updateCadenceStepName?.(param);
      isStepNew && data.endStepEdition();
      setIsStepNameEditionBubble(false);
    },
    [data, isStepNew, setIsStepNameEditionBubble],
  );
  // ===================================================================

  // ==================== CONVERT INTO EXIT BUBBLE =====================
  const [isConvertIntoExitBubbleVisible, setIsConvertIntoExitBubbleVisible] =
    React.useState(false);

  const handleOpenConvertIntoExitBubble = React.useCallback(
    () => setIsConvertIntoExitBubbleVisible(true),
    [],
  );

  const handleCloseConvertIntoExitBubble = React.useCallback(
    () => setIsConvertIntoExitBubbleVisible(false),
    [],
  );
  // ===================================================================

  // =============== ADD UNIQUE MARKETING ACTION BUBBLE ================
  const [
    isAddMarketingActionBubbleVisible,
    setIsAddMarketingActionBubbleVisible,
  ] = React.useState(false);

  const [marketingAction, setMarketingAction] =
    React.useState<Partial<StepMarketingActions> | null>(null);

  const handleCreateMarketingAction = React.useCallback(
    (type: MarketingActions) => {
      setMarketingAction(getMarketingActionPartialValues(type));
      setIsAddMarketingActionBubbleVisible(true);
    },
    [setIsAddMarketingActionBubbleVisible],
  );

  const handleEditMarketingAction = React.useCallback(
    (action: StepMarketingActions) => {
      setMarketingAction(action);
      setIsAddMarketingActionBubbleVisible(true);
    },
    [setIsAddMarketingActionBubbleVisible],
  );

  const handleCloseMarketingActionBubble = React.useCallback(
    () => setIsAddMarketingActionBubbleVisible(false),
    [],
  );

  const handleCancelMarketingActionBubble = React.useCallback(() => {
    handleCloseMarketingActionBubble();
    setMarketingAction(null);
  }, [handleCloseMarketingActionBubble]);

  const handleDeleteMarketingAction = React.useCallback(() => {
    !!marketingAction?.id &&
      !!data?.step?.id &&
      data.deleteStepMarketingAction?.({
        stepId: data.step.id,
        id: marketingAction.id,
      });
    handleCancelMarketingActionBubble();
  }, [data, handleCancelMarketingActionBubble, marketingAction?.id]);

  const handleUpsertMarketingAction = React.useCallback(
    (action: Partial<StepMarketingActions>) => {
      data.upsertMarketingAction?.({
        ...action,
        cadence_step: action?.cadence_step || data?.step?.id,
        name: t('cadence.form.marketing_action.defaultName'),
      });
      handleCloseMarketingActionBubble();
    },
    [data, handleCloseMarketingActionBubble, t],
  );
  // ===================================================================

  // ======================= DELETE STEP DIALOG ========================
  const [openDeleteStepDialog, setOpenDeleteStepDialog] = React.useState(false);

  const handleCloseDeleteStepDialog = React.useCallback(() => {
    trackFormCancel(data?.step?.cadence, {
      step_id: data?.step?.id,
      info: 'User closed the delete step dialog',
    });
    setOpenDeleteStepDialog(false);
  }, [data?.step?.cadence, data?.step.id]);

  const handleDeleteStep = React.useCallback(() => {
    if (data?.isDeleteStepDialogHidden) {
      data?.onDelete();
    } else {
      trackFormAdd(data?.step?.cadence, {
        step_id: data?.step.id,
        info: 'User opened the delete step dialog',
      });
      setOpenDeleteStepDialog(true);
    }
  }, [data]);

  const handleConfirmDeleteStepDialog = React.useCallback(
    (isChecked: boolean) => {
      handleCloseDeleteStepDialog();
      isChecked && data?.doNotDisplayDeleteStepDialogAnymore?.();
      data?.onDelete();
    },
    [data, handleCloseDeleteStepDialog],
  );
  // ===================================================================

  // ================== CONVERT STEP INTO EXIT DIALOG ==================
  const [openConvertStepIntoExitDialog, setOpenConvertStepIntoExitDialog] =
    React.useState(false);

  const [destinationStatus, setDestinationStatus] =
    React.useState<DestinationStatus | null>(null);

  const handleCloseConvertStepIntoExitDialog = React.useCallback(
    () => setOpenConvertStepIntoExitDialog(false),
    [],
  );

  const handleConvertStepIntoExit = React.useCallback(
    (status: DestinationStatus) => {
      handleCloseConvertIntoExitBubble();
      if (data?.step.hasExits && !data?.isConvertStepIntoExitDialogHidden) {
        setDestinationStatus(status);
        setOpenConvertStepIntoExitDialog(true);
      } else {
        data?.submitConvertIntoExit(status);
      }
    },
    [data, handleCloseConvertIntoExitBubble],
  );

  const handleConfirmConvertStepIntoExitDialog = React.useCallback(
    (isChecked: boolean) => {
      handleCloseConvertStepIntoExitDialog();
      isChecked && data?.doNotDisplayConvertStepIntoExitDialogAnymore?.();
      data?.submitConvertIntoExit(destinationStatus);
    },
    [data, destinationStatus, handleCloseConvertStepIntoExitDialog],
  );
  // ===================================================================

  React.useEffect(() => {
    isStepNew && setIsStepNameEditionBubble(true);
  }, [isStepNew, setIsStepNameEditionBubble]);

  return (
    <>
      <Handle
        isConnectable={!data.disabled}
        position={Position.Left}
        style={LEFT_HANDLE_STYLE}
        type={HandleTypeChoices.TARGET}
      />
      <div ref={stepCardRef}>
        <InnerStepCard
          addMarketingAction={handleCreateMarketingAction}
          addNextStep={data.addNextStep}
          disableAddMarketingAction={data.disableAddMarketingAction}
          disabled={data.disabled}
          editMarketingAction={handleEditMarketingAction}
          getEmailTemplate={data.getEmailTemplate}
          getTag={data.getTag}
          handleConvertIntoExit={handleOpenConvertIntoExitBubble}
          isSelected={data.isSelected}
          marketingActionList={data.marketingActionList}
          onCardClick={handleClick}
          onDelete={handleDeleteStep}
          step={data.step}
          stepMemberCount={data.stepMemberCount}
        />
      </div>
      <Handle
        isConnectable={!data.disabled}
        onConnect={handleConnectStepWithLink}
        position={Position.Right}
        style={RIGHT_HANDLE_STYLE}
        type={HandleTypeChoices.SOURCE}
      />
      <MenuSelectorOnly
        actionList={triggerChoicesToConnectStepToStep}
        anchorElement={!!stepDestinationId && stepCardRef.current}
        customHoverBackgroundColor={
          SequentialMarketingColors.TRIGGER_BACKGROUND_COLOR
        }
        informationText={t('cadence.steps.actions.nextStepTrigger')}
      />
      <CadencePopover
        handleOnClickAway={handleCloseConvertIntoExitBubble}
        height={stepCardRef?.current?.clientHeight}
        isVisible={isConvertIntoExitBubbleVisible}
        nodePosition={data.position}
        position={Position.Right}
        width={stepCardRef?.current?.clientWidth}
      >
        <ConvertIntoExitBubble
          onCancel={handleCloseConvertIntoExitBubble}
          onConfirm={handleConvertStepIntoExit}
        />
      </CadencePopover>
      <CadencePopover
        handleOnClickAway={handleCloseStepNameEditionBubble}
        height={stepCardRef?.current?.clientHeight}
        isVisible={isStepNameEditionBubbleVisible}
        nodePosition={data.position}
        position={Position.Right}
        width={stepCardRef?.current?.clientWidth}
      >
        <StepNameEditionBubble
          onCancel={handleCloseStepNameEditionBubble}
          onConfirm={handleEditStepName}
          step={data.step}
        />
      </CadencePopover>
      <CadencePopover
        handleOnClickAway={handleCloseMarketingActionBubble}
        height={stepCardRef?.current?.clientHeight}
        isVisible={isAddMarketingActionBubbleVisible}
        nodePosition={data.position}
        position={Position.Right}
        width={stepCardRef?.current?.clientWidth}
      >
        <UniqueMarketingActionBubble
          {...data.marketingActionEssentials}
          marketingAction={marketingAction}
          marketingActionList={data.marketingActionList}
          onCancel={handleCancelMarketingActionBubble}
          onConfirm={handleUpsertMarketingAction}
          onDelete={handleDeleteMarketingAction}
        />
      </CadencePopover>
      <CadenceUtilityDialog
        onCancel={handleCloseDeleteStepDialog}
        onConfirm={handleConfirmDeleteStepDialog}
        open={openDeleteStepDialog}
        variant={DialogVariant.DELETE_STEP}
      />
      <CadenceUtilityDialog
        onCancel={handleCloseConvertStepIntoExitDialog}
        onConfirm={handleConfirmConvertStepIntoExitDialog}
        open={openConvertStepIntoExitDialog}
        variant={DialogVariant.CONVERT_STEP_INTO_EXIT}
      />
    </>
  );
};

export default React.memo(InnerStepFlowVersion);
