import React from 'react';
import { useTranslation } from 'react-i18next';

import Popover, { PopoverOrigin } from '@material-ui/core/Popover';

import EntryActionBubble from '#src/libs/sequential_marketing/components/graph/bubbles/EntryActionBubble.component';
import EntryTriggerBubble from '#src/libs/sequential_marketing/components/graph/bubbles/EntryTriggerBubble.component';
import UniqueMarketingActionBubble from '#src/libs/sequential_marketing/components/graph/bubbles/UniqueMarketingActionBubble.component';

import type {
  ConnectedTrigger,
  EntryStepFlowVersionData,
  StepMarketingActions,
} from '#src/libs/sequential_marketing/types';

import { InitialConfigurationStep } from '#src/libs/sequential_marketing/constants';
import { CADENCE_DETAIL_MAIN_PANEL_ID } from '#src/libs/sequential_marketing/constants/keywords';
import EntryStepCard from './EntryStepCard.component';

type Props = {
  anchorActionBubble: HTMLDivElement | null;
  anchorEl: HTMLButtonElement | HTMLDivElement | null;
  anchorOrigin: PopoverOrigin;
  anchorAddMarketingAction: HTMLDivElement | null;
  data: EntryStepFlowVersionData & React.ComponentProps<typeof EntryStepCard>;
  marketingAction: Partial<StepMarketingActions> | null;
  openEntryActionBubble: () => void;
  openEntryCriteriaBubble: () => void;
  popoverStyle: { style: React.CSSProperties };
  setAnchorActionBubble: (value: React.SetStateAction<HTMLDivElement>) => void;
  setAnchorEl: (
    value: React.SetStateAction<HTMLDivElement | HTMLButtonElement>,
  ) => void;
  setAnchorAddMarketingAction: (
    value: React.SetStateAction<HTMLDivElement>,
  ) => void;
  setMarketingAction: React.Dispatch<
    React.SetStateAction<Partial<StepMarketingActions>>
  >;
  transformOrigin: PopoverOrigin;
};

const FirstEntryStepFlowConfigurationPopovers: React.FC<Props> = ({
  anchorActionBubble,
  anchorAddMarketingAction,
  anchorEl,
  anchorOrigin,
  data,
  marketingAction,
  openEntryActionBubble,
  openEntryCriteriaBubble,
  popoverStyle,
  setAnchorActionBubble,
  setAnchorAddMarketingAction,
  setAnchorEl,
  setMarketingAction,
  transformOrigin,
}) => {
  const { t } = useTranslation('marketing');

  const container = document?.getElementById(CADENCE_DETAIL_MAIN_PANEL_ID);

  const handleConfirmCriteriaBubble = React.useCallback(
    (value: ConnectedTrigger[]) => {
      setAnchorEl(null);
      data.connectedTriggersBubble?.onConfirm?.(value);
      openEntryActionBubble();
    },
    [data.connectedTriggersBubble, openEntryActionBubble, setAnchorEl],
  );

  const handleCancelActionBubble = React.useCallback(
    (value: StepMarketingActions[]) => {
      setAnchorActionBubble(null);
      if (data.isFirstConfigurationMode) {
        openEntryCriteriaBubble();
        data.submitMultipleMarketingActions?.(value);
      }
    },
    [data, openEntryCriteriaBubble, setAnchorActionBubble],
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
    [data, setAnchorActionBubble],
  );

  const handleCloseMarketingActionBubble = React.useCallback(
    () => setAnchorAddMarketingAction(null),
    [setAnchorAddMarketingAction],
  );
  const handleCancelMarketingActionBubble = React.useCallback(() => {
    handleCloseMarketingActionBubble();
    setMarketingAction(null);
  }, [handleCloseMarketingActionBubble, setMarketingAction]);

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

  return (
    <>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        container={container}
        open={!!anchorEl}
        PaperProps={popoverStyle}
        transformOrigin={transformOrigin}
      >
        <EntryTriggerBubble
          isInitial
          connectedTriggers={data.triggerList}
          entrystepId={data.step?.id}
          onConfirm={handleConfirmCriteriaBubble}
          smartlists={data.connectedTriggersBubble?.smartlists}
        />
      </Popover>
      <Popover
        anchorEl={anchorActionBubble}
        anchorOrigin={anchorOrigin}
        container={container}
        open={!!anchorActionBubble}
        PaperProps={popoverStyle}
        transformOrigin={transformOrigin}
      >
        <EntryActionBubble
          {...data.marketingActionEssentials}
          isInitial
          marketingActions={data.marketingActionList}
          onCancel={handleCancelActionBubble}
          onConfirm={handleConfirmActionBubble}
        />
      </Popover>
      <Popover
        anchorEl={anchorAddMarketingAction}
        anchorOrigin={anchorOrigin}
        container={container}
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
    </>
  );
};

export default React.memo(FirstEntryStepFlowConfigurationPopovers);
