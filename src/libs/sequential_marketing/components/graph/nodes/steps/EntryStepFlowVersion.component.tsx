import React from 'react';
import { useTranslation } from 'react-i18next';

import { Handle, Position } from 'react-flow-renderer';
import Popover from '@material-ui/core/Popover';

import EntryStepCard from './EntryStepCard.component';
import EntryActionBubble from '#libs/sequential_marketing/components/graph/bubbles/EntryActionBubble.component';
import EntryTriggerBubble from '#libs/sequential_marketing/components/graph/bubbles/EntryTriggerBubble.component';
import MenuSelectorOnly from '#components/menu/menu-only';
import UniqueMarketingActionBubble from '#libs/sequential_marketing/components/graph/bubbles/UniqueMarketingActionBubble.component';
import useConnectToStep from '#libs/sequential_marketing/components/graph/nodes/hooks/useConnectToStep.hook';
import usePopoverBubble from '#libs/sequential_marketing/components/graph/nodes/hooks/usePopoverBubble.hook';

import {
  HandleTypeChoices,
  InitialConfigurationStep,
  MarketingActions,
  RIGHT_HANDLE_STYLE,
  SequentialMarketingColors,
  TriggerKind,
} from '#libs/sequential_marketing/constants';
import type {
  ConnectedTrigger,
  MarketingActionEssentials,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';
import { getMarketingActionPartialValues } from '#libs/sequential_marketing/components/form/marketing_actions/utils';

type FlowProps = {
  data: {
    isEntryActionBubbleOpen: boolean;
    marketingActionEssentials: MarketingActionEssentials;
    connectedTriggersBubble: Pick<
      React.ComponentProps<typeof EntryTriggerBubble>,
      'onConfirm' | 'smartlists'
    >;
    isEntryFirstConfiguration?: boolean;
    createNewMarketingAction: (value: Partial<StepMarketingActions>) => void;
    upsertMarketingAction: (value: Partial<StepMarketingActions>) => void;
    deleteStepMarketingAction: (data: { id: number; stepId: number }) => void;
    submitMultipleMarketingActions: (data: StepMarketingActions[]) => void;
    onConnectToStep: (destinationId: number, triggerKind: TriggerKind) => void;
    setCurrentStepConfiguration: (
      currentStepConfiguration: InitialConfigurationStep,
    ) => void;
  } & React.ComponentProps<typeof EntryStepCard>;
};

export const EntryStepFlowVersion: React.FC<FlowProps> = ({ data }) => {
  const { t } = useTranslation('marketing');
  const entryCardRef = React.useRef<HTMLDivElement | null>(null);

  const {
    stepDestinationId,
    triggerChoicesToConnectStepToStep,
    handleConnectStepWithLink,
  } = useConnectToStep(data.onConnectToStep);

  // ================= ENTRY CRITERIA & ACTION BUBBLES ON CREATION =================
  const { anchorOrigin, popoverStyle, transformOrigin, anchorEl, setAnchorEl } =
    usePopoverBubble();

  const [anchorActionBubble, setAnchorActionBubble] =
    React.useState<HTMLDivElement | null>(null);

  const openEntryCriteriaBubble = React.useCallback(
    () =>
      setTimeout(() => {
        setAnchorEl(entryCardRef?.current);
      }, 200),
    [setAnchorEl],
  );

  const openEntryActionBubble = React.useCallback(
    () =>
      setTimeout(() => {
        setAnchorActionBubble(entryCardRef?.current);
      }, 200),
    [],
  );

  const handleCloseCriteriaBubble = React.useCallback(() => {
    !data.isFirstConfigurationMode && setAnchorEl(null);
  }, [data.isFirstConfigurationMode, setAnchorEl]);

  const handleConfirmCriteriaBubble = React.useCallback(
    (value: ConnectedTrigger[]) => {
      setAnchorEl(null);
      data.connectedTriggersBubble?.onConfirm?.(value);
      data.isFirstConfigurationMode && openEntryActionBubble();
    },
    [
      data.connectedTriggersBubble,
      data.isFirstConfigurationMode,
      openEntryActionBubble,
      setAnchorEl,
    ],
  );

  const handleCloseActionBubble = React.useCallback(() => {
    !data.isFirstConfigurationMode && setAnchorActionBubble(null);
  }, [data.isFirstConfigurationMode]);

  const handleCancelActionBubble = React.useCallback(
    (value: StepMarketingActions[]) => {
      setAnchorActionBubble(null);
      if (data.isFirstConfigurationMode) {
        openEntryCriteriaBubble();
        data.submitMultipleMarketingActions?.(value);
      }
    },
    [data, openEntryCriteriaBubble],
  );

  const handleConfirmActionBubble = React.useCallback(
    (value: StepMarketingActions[]) => {
      setAnchorActionBubble(null);
      data.submitMultipleMarketingActions?.(value);
      data.isFirstConfigurationMode &&
        data.setCurrentStepConfiguration(
          InitialConfigurationStep.CADENCE_WIN_STEP,
        );
    },
    [data],
  );

  React.useEffect(() => {
    data.isEntryFirstConfiguration && openEntryCriteriaBubble();
  }, [data.isEntryFirstConfiguration, openEntryCriteriaBubble]);

  React.useEffect(() => {
    data.isEntryActionBubbleOpen && openEntryActionBubble();
  }, [data.isEntryActionBubbleOpen, openEntryActionBubble]);
  // ===============================================================================

  // ======================== ENTRY CRITERIA EDITION BUBBLE ========================
  /**
   * @description The handleClick function is used to open the criteria edition bubble on card click
   */
  const handleClick = React.useCallback(() => {
    setAnchorEl(entryCardRef?.current);
  }, [setAnchorEl]);
  // ===============================================================================

  // ===================== ADD UNIQUE MARKETING ACTION BUBBLE ======================
  const [anchorAddMarketingAction, setAnchorAddMarketingAction] =
    React.useState<HTMLDivElement | null>(null);

  const [marketingAction, setMarketingAction] =
    React.useState<Partial<StepMarketingActions> | null>(null);

  const handleCreateMarketingAction = React.useCallback(
    (type: MarketingActions) => {
      setMarketingAction(getMarketingActionPartialValues(type));
      setAnchorAddMarketingAction(entryCardRef?.current);
    },
    [entryCardRef],
  );

  const handleEditMarketingAction = React.useCallback(
    (action: StepMarketingActions) => {
      setMarketingAction(action);
      setAnchorAddMarketingAction(entryCardRef?.current);
    },
    [entryCardRef],
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
  // ===============================================================================

  return (
    <>
      <div ref={entryCardRef}>
        <EntryStepCard
          addMarketingAction={handleCreateMarketingAction}
          addNextStep={data.addNextStep}
          cadenceEditMode={data.cadenceEditMode}
          disabled={data.disabled}
          editMarketingAction={handleEditMarketingAction}
          getEmailTemplate={data.getEmailTemplate}
          getSmartlist={data.getSmartlist}
          getTag={data.getTag}
          isFirstConfigurationMode={data.isFirstConfigurationMode}
          isPushNotificationUpsellActive={data.isPushNotificationUpsellActive}
          isSelected={data.isSelected}
          marketingActionList={data.marketingActionList}
          onCardClick={handleClick}
          step={data.step}
          stepMemberCount={data.stepMemberCount}
          triggerList={data.triggerList}
        />
      </div>
      {!data.isFirstConfigurationMode && (
        <Handle
          isConnectable
          onConnect={handleConnectStepWithLink}
          position={Position.Right}
          style={RIGHT_HANDLE_STYLE}
          type={HandleTypeChoices.SOURCE}
        />
      )}
      <MenuSelectorOnly
        actionList={triggerChoicesToConnectStepToStep}
        anchorElement={!!stepDestinationId && entryCardRef.current}
        customHoverBackgroundColor={
          SequentialMarketingColors.TRIGGER_BACKGROUND_COLOR
        }
        informationText={t('cadence.steps.actions.nextStepTrigger')}
      />
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        onClose={handleCloseCriteriaBubble}
        open={!!anchorEl}
        PaperProps={popoverStyle}
        transformOrigin={transformOrigin}
      >
        <EntryTriggerBubble
          connectedTriggers={data.triggerList}
          entrystepId={data.step?.id}
          isInitial={data.isFirstConfigurationMode}
          onClose={handleCloseCriteriaBubble}
          onConfirm={handleConfirmCriteriaBubble}
          smartlists={data.connectedTriggersBubble?.smartlists}
        />
      </Popover>
      <Popover
        anchorEl={anchorActionBubble}
        anchorOrigin={anchorOrigin}
        onClose={handleCloseActionBubble}
        open={!!anchorActionBubble}
        PaperProps={popoverStyle}
        transformOrigin={transformOrigin}
      >
        <EntryActionBubble
          {...data.marketingActionEssentials}
          isInitial={data.isFirstConfigurationMode}
          marketingActions={data.marketingActionList}
          onCancel={handleCancelActionBubble}
          onConfirm={handleConfirmActionBubble}
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
    </>
  );
};

export default React.memo(EntryStepFlowVersion);
