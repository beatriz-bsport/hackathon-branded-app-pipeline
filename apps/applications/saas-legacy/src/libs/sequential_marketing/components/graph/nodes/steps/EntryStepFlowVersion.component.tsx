import React from 'react';
import { useTranslation } from 'react-i18next';

import { Handle, Position } from 'react-flow-renderer';

import MenuSelectorOnly from '#src/components/menu/menu-only';
import useConnectToStep from '#src/libs/sequential_marketing/components/graph/nodes/hooks/useConnectToStep.hook';
import usePopoverBubble from '#src/libs/sequential_marketing/components/graph/nodes/hooks/usePopoverBubble.hook';

import {
  HandleTypeChoices,
  MarketingActions,
  RIGHT_HANDLE_STYLE,
  SequentialMarketingColors,
} from '#src/libs/sequential_marketing/constants';
import { getMarketingActionPartialValues } from '#src/libs/sequential_marketing/components/form/marketing_actions/utils';

import type {
  StepMarketingActions,
  EntryStepFlowVersionData,
} from '#src/libs/sequential_marketing/types';
import RegularEntryStepFlowConfigurationPopovers from './RegularEntryStepFlowConfigurationPopovers.component';
import FirstEntryStepFlowConfigurationPopovers from './FirstEntryStepFlowConfigurationPopovers.component';
import EntryStepCard from './EntryStepCard.component';

export type FlowProps = {
  data: EntryStepFlowVersionData & React.ComponentProps<typeof EntryStepCard>;
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
  const { anchorEl, anchorOrigin, popoverStyle, setAnchorEl, transformOrigin } =
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

  const openEntryActionBubble = React.useCallback(() => {
    data?.isFirstConfigurationMode
      ? setAnchorActionBubble(entryCardRef?.current)
      : setIsEntryActionBubbleIsVisible(true);
  }, [data?.isFirstConfigurationMode]);

  React.useEffect(() => {
    data.isEntryFirstConfiguration && openEntryCriteriaBubble();
  }, [data.isEntryFirstConfiguration, openEntryCriteriaBubble]);

  React.useEffect(() => {
    data.isEntryActionBubbleOpen && openEntryActionBubble();
  }, [data.isEntryActionBubbleOpen, openEntryActionBubble]);
  // ===============================================================================

  // ===================== ADD UNIQUE MARKETING ACTION BUBBLE ======================
  const [anchorAddMarketingAction, setAnchorAddMarketingAction] =
    React.useState<HTMLDivElement | null>(null);

  const [marketingAction, setMarketingAction] =
    React.useState<Partial<StepMarketingActions> | null>(null);

  const [isEntryTriggerBubbleVisible, setIsEntryTriggerBubbleVisible] =
    React.useState(false);

  const [isEntryActionBubbleVisible, setIsEntryActionBubbleIsVisible] =
    React.useState(false);

  const [
    isUniqueMarketingActionBubbleVisible,
    setIsUniqueMarketingActionBubbleIsVisible,
  ] = React.useState(false);

  // ======================== ENTRY CRITERIA EDITION BUBBLE ========================
  /**
   * @description The handleClick function is used to open the criteria edition bubble on card click
   */
  const handleClick = React.useCallback(() => {
    setIsEntryTriggerBubbleVisible((prevState) => !prevState);
  }, [setIsEntryTriggerBubbleVisible]);
  // ===============================================================================

  const handleCreateMarketingAction = React.useCallback(
    (type: MarketingActions) => {
      setMarketingAction(getMarketingActionPartialValues(type));
      setIsUniqueMarketingActionBubbleIsVisible(true);
    },
    [setIsUniqueMarketingActionBubbleIsVisible],
  );

  const handleEditMarketingAction = React.useCallback(
    (action: StepMarketingActions) => {
      setMarketingAction(action);
      setIsUniqueMarketingActionBubbleIsVisible(true);
    },
    [setIsUniqueMarketingActionBubbleIsVisible],
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
      {data.isFirstConfigurationMode ? (
        <FirstEntryStepFlowConfigurationPopovers
          anchorActionBubble={anchorActionBubble}
          anchorAddMarketingAction={anchorAddMarketingAction}
          anchorEl={anchorEl}
          anchorOrigin={anchorOrigin}
          data={data}
          marketingAction={marketingAction}
          openEntryActionBubble={openEntryActionBubble}
          openEntryCriteriaBubble={openEntryCriteriaBubble}
          popoverStyle={popoverStyle}
          setAnchorActionBubble={setAnchorActionBubble}
          setAnchorAddMarketingAction={setAnchorAddMarketingAction}
          setAnchorEl={setAnchorEl}
          setMarketingAction={setMarketingAction}
          transformOrigin={transformOrigin}
        />
      ) : (
        <RegularEntryStepFlowConfigurationPopovers
          data={data}
          entryCardRef={entryCardRef}
          isEntryActionBubbleVisible={isEntryActionBubbleVisible}
          isEntryTriggerBubbleVisible={isEntryTriggerBubbleVisible}
          isUniqueMarketingActionBubbleVisible={
            isUniqueMarketingActionBubbleVisible
          }
          marketingAction={marketingAction}
          setIsEntryActionBubbleIsVisible={setIsEntryActionBubbleIsVisible}
          setIsEntryTriggerBubbleVisible={setIsEntryTriggerBubbleVisible}
          setIsUniqueMarketingActionBubbleIsVisible={
            setIsUniqueMarketingActionBubbleIsVisible
          }
          setMarketingAction={setMarketingAction}
        />
      )}
    </>
  );
};

export default React.memo(EntryStepFlowVersion);
