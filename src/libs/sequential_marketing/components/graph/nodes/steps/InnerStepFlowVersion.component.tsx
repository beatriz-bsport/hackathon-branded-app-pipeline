import React from 'react';
import { useTranslation } from 'react-i18next';
import { Handle, Position } from 'react-flow-renderer';
import { Popover } from '@material-ui/core';

import InnerStepCard, {
  type InnerStepCardProps,
} from './InnerStepCard.component';
import type {
  MarketingActionEssentials,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';

import {
  LEFT_HANDLE_STYLE,
  RIGHT_HANDLE_STYLE,
  HandleTypeChoices,
} from '#libs/sequential_marketing/constants/steps';
import {
  DestinationStatus,
  MarketingActions,
  SequentialMarketingColors,
  TriggerKind,
} from '#libs/sequential_marketing/constants';
import { getMarketingActionPartialValues } from '#libs/sequential_marketing/components/form/marketing_actions/utils';

import ConvertIntoExitBubble from '#libs/sequential_marketing/components/graph/bubbles/ConvertIntoExitBubble.component';
import MenuSelectorOnly from '#components/menu/menu-only';
import CadenceUtilityDialog, {
  DialogVariant,
} from '#libs/sequential_marketing/components/dialogs/DialogUtility';
import StepNameEditionBubble from '#libs/sequential_marketing/components/graph/bubbles/StepNameEditionBubble.component';
import UniqueMarketingActionBubble from '#libs/sequential_marketing/components/graph/bubbles/UniqueMarketingActionBubble.component';
import useConnectToStep from '#libs/sequential_marketing/components/graph/nodes/hooks/useConnectToStep.hook';
import usePopoverBubble from '#libs/sequential_marketing/components/graph/nodes/hooks/usePopoverBubble.hook';

import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

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
    isPushNotificationUpsellActive: boolean;
    deleteStepMarketingAction: (data: { id: number; stepId: number }) => void;
    doNotDisplayConvertStepIntoExitDialogAnymore: () => void;
    doNotDisplayDeleteStepDialogAnymore: () => void;
    endStepEdition: () => void;
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
  const { anchorOrigin, popoverStyle, transformOrigin, anchorEl, setAnchorEl } =
    usePopoverBubble();

  /**
   * @description The handleClick function is used to open the popover step name edition bubble on card click
   */
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      data?.onCardClick?.(event);
      setAnchorEl(event?.currentTarget);
    },
    [data, setAnchorEl],
  );

  const handleCloseStepNameEditionBubble = React.useCallback(() => {
    setAnchorEl(null);
    isStepNew && data?.endStepEdition?.();
  }, [data, isStepNew, setAnchorEl]);

  const handleEditStepName = React.useCallback(
    (param: { name: string; stepId: number }) => {
      data.updateCadenceStepName?.(param);
      isStepNew && data.endStepEdition();
      setAnchorEl(null);
    },
    [data, isStepNew, setAnchorEl],
  );
  // ===================================================================

  // ==================== CONVERT INTO EXIT BUBBLE =====================
  const [anchorConvertIntoExit, setAnchorConvertIntoExit] =
    React.useState<HTMLDivElement>(null);

  const handleOpenConvertIntoExitBubble = React.useCallback(
    () => setAnchorConvertIntoExit(stepCardRef?.current),
    [],
  );

  const handleCloseConvertIntoExitBubble = React.useCallback(
    () => setAnchorConvertIntoExit(null),
    [],
  );
  // ===================================================================

  // =============== ADD UNIQUE MARKETING ACTION BUBBLE ================
  const [anchorAddMarketingAction, setAnchorAddMarketingAction] =
    React.useState<HTMLDivElement | null>(null);

  const [marketingAction, setMarketingAction] =
    React.useState<Partial<StepMarketingActions> | null>(null);

  const handleCreateMarketingAction = React.useCallback(
    (type: MarketingActions) => {
      setMarketingAction(getMarketingActionPartialValues(type));
      setAnchorAddMarketingAction(stepCardRef?.current);
    },
    [stepCardRef],
  );

  const handleEditMarketingAction = React.useCallback(
    (action: StepMarketingActions) => {
      setMarketingAction(action);
      setAnchorAddMarketingAction(stepCardRef?.current);
    },
    [stepCardRef],
  );

  const handleCloseMarketingActionBubble = React.useCallback(
    () => setAnchorAddMarketingAction(null),
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
    isStepNew && setAnchorEl(stepCardRef?.current);
  }, [isStepNew, setAnchorEl]);

  return (
    <>
      <Handle
        isConnectable
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
          isPushNotificationUpsellActive={data.isPushNotificationUpsellActive}
          isSelected={data.isSelected}
          marketingActionList={data.marketingActionList}
          onCardClick={handleClick}
          onDelete={handleDeleteStep}
          step={data.step}
          stepMemberCount={data.stepMemberCount}
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
        anchorElement={!!stepDestinationId && stepCardRef.current}
        customHoverBackgroundColor={
          SequentialMarketingColors.TRIGGER_BACKGROUND_COLOR
        }
        informationText={t('cadence.steps.actions.nextStepTrigger')}
      />
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        onClose={handleCloseStepNameEditionBubble}
        open={!!anchorEl}
        PaperProps={popoverStyle}
        transformOrigin={transformOrigin}
      >
        <StepNameEditionBubble
          onCancel={handleCloseStepNameEditionBubble}
          onConfirm={handleEditStepName}
          step={data.step}
        />
      </Popover>
      <Popover
        anchorEl={anchorConvertIntoExit}
        anchorOrigin={anchorOrigin}
        onClose={handleCloseConvertIntoExitBubble}
        open={!!anchorConvertIntoExit}
        PaperProps={popoverStyle}
        transformOrigin={transformOrigin}
      >
        <ConvertIntoExitBubble
          onCancel={handleCloseConvertIntoExitBubble}
          onConfirm={handleConvertStepIntoExit}
        />
      </Popover>
      <Popover
        anchorEl={anchorAddMarketingAction}
        anchorOrigin={anchorOrigin}
        onClose={handleCloseMarketingActionBubble}
        open={!!anchorAddMarketingAction}
        PaperProps={popoverStyle}
        transformOrigin={transformOrigin}
      >
        <UniqueMarketingActionBubble
          {...data.marketingActionEssentials}
          marketingAction={marketingAction}
          onCancel={handleCancelMarketingActionBubble}
          onConfirm={handleUpsertMarketingAction}
          onDelete={handleDeleteMarketingAction}
        />
      </Popover>
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
