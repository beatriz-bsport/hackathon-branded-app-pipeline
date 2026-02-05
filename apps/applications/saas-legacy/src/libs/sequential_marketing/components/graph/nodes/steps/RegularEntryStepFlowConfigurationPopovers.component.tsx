import React from 'react';
import { useTranslation } from 'react-i18next';
import { Position } from 'react-flow-renderer';

import EntryActionBubble from '#src/libs/sequential_marketing/components/graph/bubbles/EntryActionBubble.component';
import EntryTriggerBubble from '#src/libs/sequential_marketing/components/graph/bubbles/EntryTriggerBubble.component';
import UniqueMarketingActionBubble from '#src/libs/sequential_marketing/components/graph/bubbles/UniqueMarketingActionBubble.component';
import type {
  ConnectedTrigger,
  StepMarketingActions,
  EntryStepFlowVersionData,
} from '#src/libs/sequential_marketing/types';
import EntryStepCard from './EntryStepCard.component';

import CadencePopover from '../internals/CadencePopover.component';
import ClickAwayContextProvider from '../context/ClickAwayContext.component';

type Props = {
  data: EntryStepFlowVersionData & React.ComponentProps<typeof EntryStepCard>;
  entryCardRef: React.MutableRefObject<HTMLDivElement>;
  isEntryActionBubbleVisible: boolean;
  isEntryTriggerBubbleVisible: boolean;
  isUniqueMarketingActionBubbleVisible: boolean;
  marketingAction: Partial<StepMarketingActions> | null;
  setIsEntryActionBubbleIsVisible: (
    value: React.SetStateAction<boolean>,
  ) => void;
  setIsEntryTriggerBubbleVisible: (
    value: React.SetStateAction<boolean>,
  ) => void;
  setMarketingAction: React.Dispatch<
    React.SetStateAction<Partial<StepMarketingActions>>
  >;
  setIsUniqueMarketingActionBubbleIsVisible: (
    value: React.SetStateAction<boolean>,
  ) => void;
};

const RegularEntryStepFlowConfigurationPopovers: React.FC<Props> = ({
  data,
  entryCardRef,
  isEntryActionBubbleVisible,
  isEntryTriggerBubbleVisible,
  isUniqueMarketingActionBubbleVisible,
  marketingAction,
  setIsEntryActionBubbleIsVisible,
  setIsEntryTriggerBubbleVisible,
  setMarketingAction,
  setIsUniqueMarketingActionBubbleIsVisible,
}) => {
  const { t } = useTranslation('marketing');

  // ===================== METHOD TO HIDE CADENCEPOPOVERS ======================
  const handleHideEntryTriggerBubble = React.useCallback(() => {
    setIsEntryTriggerBubbleVisible(false);
  }, [setIsEntryTriggerBubbleVisible]);

  const handleHideEntryActionBubbleIsVisible = React.useCallback(() => {
    setIsEntryActionBubbleIsVisible(false);
  }, [setIsEntryActionBubbleIsVisible]);

  const handleHideUniqueMarketingActionBubble = React.useCallback(() => {
    setIsUniqueMarketingActionBubbleIsVisible(false);
  }, [setIsUniqueMarketingActionBubbleIsVisible]);

  const handleConfirmActionBubble = React.useCallback(
    (value: StepMarketingActions[]) => {
      setIsEntryActionBubbleIsVisible(null);
      data.submitMultipleMarketingActions?.(value);
    },
    [data, setIsEntryActionBubbleIsVisible],
  );
  // ===============================================================================

  const handleConfirmCriteriaBubble = React.useCallback(
    (value: ConnectedTrigger[]) => {
      setIsEntryTriggerBubbleVisible(false);
      data.connectedTriggersBubble?.onConfirm?.(value);
    },
    [data.connectedTriggersBubble, setIsEntryTriggerBubbleVisible],
  );

  const handleCancelMarketingActionBubble = React.useCallback(() => {
    handleHideUniqueMarketingActionBubble();
    setMarketingAction(null);
  }, [setMarketingAction, handleHideUniqueMarketingActionBubble]);

  const handleDeleteMarketingAction = React.useCallback(() => {
    !!marketingAction?.id &&
      !!data?.step?.id &&
      data.deleteStepMarketingAction?.({
        stepId: data.step.id,
        id: marketingAction.id,
      });
    handleHideUniqueMarketingActionBubble();
  }, [data, handleHideUniqueMarketingActionBubble, marketingAction?.id]);

  const handleUpsertMarketingAction = React.useCallback(
    (action: Partial<StepMarketingActions>) => {
      data.upsertMarketingAction?.({
        ...action,
        cadence_step: action?.cadence_step || data?.step?.id,
        name: t('cadence.form.marketing_action.defaultName'),
      });
      handleHideUniqueMarketingActionBubble();
    },
    [data, handleHideUniqueMarketingActionBubble, t],
  );
  return (
    <ClickAwayContextProvider>
      <CadencePopover
        handleOnClickAway={handleHideEntryTriggerBubble}
        height={entryCardRef?.current?.clientHeight}
        isVisible={isEntryTriggerBubbleVisible}
        nodePosition={data.position}
        position={Position.Right}
        width={entryCardRef?.current?.clientWidth}
      >
        <EntryTriggerBubble
          connectedTriggers={data.triggerList}
          entrystepId={data.step?.id}
          isInitial={data.isFirstConfigurationMode}
          onClose={handleHideEntryTriggerBubble}
          onConfirm={handleConfirmCriteriaBubble}
          smartlists={data.connectedTriggersBubble?.smartlists}
        />
      </CadencePopover>
      <CadencePopover
        handleOnClickAway={handleHideEntryActionBubbleIsVisible}
        height={entryCardRef?.current?.clientHeight}
        isVisible={isEntryActionBubbleVisible}
        nodePosition={data.position}
        position={Position.Right}
        width={entryCardRef?.current?.clientWidth}
      >
        <EntryActionBubble
          {...data.marketingActionEssentials}
          isInitial={data.isFirstConfigurationMode}
          marketingActions={data.marketingActionList}
          onCancel={handleHideEntryActionBubbleIsVisible}
          onConfirm={handleConfirmActionBubble}
        />
      </CadencePopover>
      <CadencePopover
        handleOnClickAway={handleHideUniqueMarketingActionBubble}
        height={entryCardRef?.current?.clientHeight}
        isVisible={isUniqueMarketingActionBubbleVisible}
        nodePosition={data.position}
        position={Position.Right}
        width={entryCardRef?.current?.clientWidth}
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
    </ClickAwayContextProvider>
  );
};

export default React.memo(RegularEntryStepFlowConfigurationPopovers);
