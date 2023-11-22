import React from 'react';
import { useTranslation } from 'react-i18next';
import omit from 'lodash/omit';

import { Handle, Position } from 'react-flow-renderer';
import Popover from '@material-ui/core/Popover';

import EntryStepCard from './EntryStepCard.component';
import useConnectToStep from '#libs/sequential_marketing/components/graph/nodes/hooks/useConnectToStep.hook';
import usePopoverBubble from '#libs/sequential_marketing/components/graph/nodes/hooks/usePopoverBubble.hook';
import EntryTriggerBubble from '#libs/sequential_marketing/components/graph/bubbles/EntryTriggerBubble.component';
import EntryActionBubble from '#libs/sequential_marketing/components/graph/bubbles/EntryActionBubble.component';
import MenuSelectorOnly from '#components/menu/menu-only';

import {
  RIGHT_HANDLE_STYLE,
  HandleTypeChoices,
} from '#libs/sequential_marketing/constants/steps';
import {
  InitialConfigurationStep,
  SequentialMarketingColors,
  TriggerKind,
} from '#libs/sequential_marketing/constants';
import type {
  ConnectedTrigger,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';

type FlowProps = {
  data: {
    isEntryActionBubbleOpen: boolean;
    connectedTriggersBubble: Pick<
      React.ComponentProps<typeof EntryTriggerBubble>,
      'onConfirm' | 'smartlists'
    >;
    marketingActionsBubble: Omit<
      React.ComponentProps<typeof EntryActionBubble>,
      'onCancel' | 'isInitial' | 'marketingActions'
    >;
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

  // ================= ENTRY CRITERIA & ACTION BUBBLES ==================
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
        data.marketingActionsBubble?.onConfirm?.(value);
      }
    },
    [
      data.isFirstConfigurationMode,
      data.marketingActionsBubble,
      openEntryCriteriaBubble,
    ],
  );

  const handleConfirmActionBubble = React.useCallback(
    (value: StepMarketingActions[]) => {
      setAnchorActionBubble(null);
      data.marketingActionsBubble?.onConfirm?.(value);
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
  // ====================================================================

  return (
    <>
      <div ref={entryCardRef}>
        <EntryStepCard
          addMarketingAction={data.addMarketingAction}
          addNextStep={data.addNextStep}
          cadenceEditMode={data.cadenceEditMode}
          disabled={data.disabled}
          getEmailTemplate={data.getEmailTemplate}
          getSmartlist={data.getSmartlist}
          getTag={data.getTag}
          isFirstConfigurationMode={data.isFirstConfigurationMode}
          isSelected={data.isSelected}
          marketingActionList={data.marketingActionList}
          onCardClick={data.onCardClick}
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
          {...omit(data.marketingActionsBubble, 'onConfirm')}
          isInitial={data.isFirstConfigurationMode}
          marketingActions={data.marketingActionList}
          onCancel={handleCancelActionBubble}
          onConfirm={handleConfirmActionBubble}
        />
      </Popover>
    </>
  );
};

export default React.memo(EntryStepFlowVersion);
