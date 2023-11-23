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
import CadencDialogUtility, {
  DialogVariant,
} from '#libs/sequential_marketing/components/dialogs/DialogUtility';
import StepNameEditionBubble from '#libs/sequential_marketing/components/graph/bubbles/StepNameEditionBubble.component';
import UniqueMarketingActionBubble from '#libs/sequential_marketing/components/graph/bubbles/UniqueMarketingActionBubble.component';
import useConnectToStep from '#libs/sequential_marketing/components/graph/nodes/hooks/useConnectToStep.hook';
import usePopoverBubble from '#libs/sequential_marketing/components/graph/nodes/hooks/usePopoverBubble.hook';

type FlowProps = {
  data: {
    marketingActionEssentials: MarketingActionEssentials;
    stepToEditId: number;
    isDeleteStepDialogHidden: boolean;
    isConvertStepIntoExitDialogHidden: boolean;
    createNewMarketingAction: (value: Partial<StepMarketingActions>) => void;
    upsertMarketingAction: (value: Partial<StepMarketingActions>) => void;
    deleteStepMarketingAction: (data: { id: number; stepId: number }) => void;
    endStepEdition: () => void;
    onConnectToStep: (destinationId: number, triggerKind: TriggerKind) => void;
    submitConvertIntoExit: (status: DestinationStatus) => void;
    addHideDeleteStepDialogCadenceIds: () => void;
    addHideConvertStepIntoExitDialogCadenceIds: () => void;
    submitMarketingActionForm: (data: {
      list: StepMarketingActions[];
      stepId: number;
    }) => void;
    updateCadenceStepName: (data: { name: string; stepId: number }) => void;
  } & InnerStepCardProps;
};

const deleteStepDialogVariant: DialogVariant = 'delete-step';
const convertStepIntoExitDialogVariant: DialogVariant =
  'convert-step-into-exit';

export const InnerStepFlowVersion: React.FC<FlowProps> = ({ data }) => {
  const { t } = useTranslation('marketing');

  const stepCardRef = React.useRef<HTMLDivElement | null>(null);

  const { anchorOrigin, popoverStyle, transformOrigin, anchorEl, setAnchorEl } =
    usePopoverBubble();

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
    !!marketingAction?.id &&
      data?.step?.id &&
      data.deleteStepMarketingAction?.({
        stepId: data.step.id,
        id: marketingAction.id,
      });
    setMarketingAction(null);
  }, [data, handleCloseMarketingActionBubble, marketingAction?.id]);

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

  // =============== OPEN DELETE STEP DIALOG ================

  const [openDeleteStepDialog, setOpenDeleteStepDialog] = React.useState(false);

  const handleOpenDeleteStepDialog = React.useCallback(() => {
    if (data?.isDeleteStepDialogHidden) {
      data?.onDelete();
    } else {
      setOpenDeleteStepDialog(true);
    }
  }, [data]);

  const handleCloseDeleteStepDialog = React.useCallback(
    () => setOpenDeleteStepDialog(false),
    [],
  );

  const handleDeleteStep = React.useCallback(
    (isChecked: boolean) => {
      handleCloseDeleteStepDialog();
      isChecked && data?.addHideDeleteStepDialogCadenceIds();
      data?.onDelete();
    },
    [data, handleCloseDeleteStepDialog],
  );

  const handleOnDelete = React.useCallback(() => {
    handleOpenDeleteStepDialog();
  }, [handleOpenDeleteStepDialog]);

  // ===================================================================

  const [openConvertStepIntoExitDialog, setOpenConvertStepIntoExitDialog] =
    React.useState(false);

  const [destinationStatus, setDestinationStatus] =
    React.useState<DestinationStatus | null>(null);

  const handleCloseConvertStepIntoExitDialog = React.useCallback(
    () => setOpenConvertStepIntoExitDialog(false),
    [],
  );

  const handleOpenConvertStepIntoExitDialog = React.useCallback(() => {
    setOpenConvertStepIntoExitDialog(true);
  }, []);

  const handleConvertStepIntoExit = React.useCallback(
    (isChecked: boolean) => {
      handleCloseConvertStepIntoExitDialog();
      isChecked && data?.addHideConvertStepIntoExitDialogCadenceIds();
      data?.submitConvertIntoExit(destinationStatus);
    },
    [data, destinationStatus, handleCloseConvertStepIntoExitDialog],
  );

  const handleSubmitConvertIntoExit = React.useCallback(
    (status: DestinationStatus) => {
      if (data?.step.hasExits && !data?.isConvertStepIntoExitDialogHidden) {
        setDestinationStatus(status);
        handleOpenConvertStepIntoExitDialog();
      } else {
        data?.submitConvertIntoExit(status);
      }
    },
    [data, handleOpenConvertStepIntoExitDialog],
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
          isSelected={data.isSelected}
          marketingActionList={data.marketingActionList}
          onCardClick={handleClick}
          onDelete={handleOnDelete}
          step={data.step}
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
          onConfirm={handleSubmitConvertIntoExit}
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
        />
      </Popover>
      <CadencDialogUtility
        onCancel={handleCloseDeleteStepDialog}
        onConfirm={handleDeleteStep}
        open={openDeleteStepDialog}
        variant={deleteStepDialogVariant}
      />
      <CadencDialogUtility
        onCancel={handleCloseConvertStepIntoExitDialog}
        onConfirm={handleConvertStepIntoExit}
        open={openConvertStepIntoExitDialog}
        variant={convertStepIntoExitDialogVariant}
      />
    </>
  );
};

export default React.memo(InnerStepFlowVersion);
