import React from 'react';
import { useTranslation } from 'react-i18next';
import { Handle, Position } from 'react-flow-renderer';
import { Popover } from '@material-ui/core';

import InnerStepCard, {
  type InnerStepCardProps,
} from './InnerStepCard.component';
import StepEditionBubble, {
  type StepEditionBubbleProps,
} from '#libs/sequential_marketing/components/graph/bubbles/StepEditionBubble.component';
import type { StepMarketingActions } from '#libs/sequential_marketing/types';

import {
  LEFT_HANDLE_STYLE,
  RIGHT_HANDLE_STYLE,
  HandleTypeChoices,
} from '#libs/sequential_marketing/constants/steps';
import ConvertIntoExitBubble from '#libs/sequential_marketing/components/graph/bubbles/ConvertIntoExitBubble.component';
import {
  DestinationStatus,
  SequentialMarketingColors,
  TriggerKind,
} from '#libs/sequential_marketing/constants';

import usePopoverBubble from '#libs/sequential_marketing/components/graph/nodes/hooks/usePopoverBubble.hook';
import useConnectToStep from '#libs/sequential_marketing/components/graph/nodes/hooks/useConnectToStep.hook';
import MenuSelectorOnly from '#components/menu/menu-only';

type FlowProps = {
  data: {
    onConnectToStep: (destinationId: number, triggerKind: TriggerKind) => void;
    bubble: StepEditionBubbleProps;
    stepToEditId: number;
    endStepEdition: () => void;
    submitConvertIntoExit: (status: DestinationStatus) => void;
  } & InnerStepCardProps;
};

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

  React.useEffect(() => {
    isStepNew && setAnchorEl(stepCardRef?.current);
  }, [isStepNew, setAnchorEl]);

  const [anchorConvertIntoExit, setAnchorConvertIntoExit] =
    React.useState<HTMLDivElement>(null);

  // ======================= STEP EDITION BUBBLE =======================
  /**
   * @description The handleClick function is used to open the popover step edition bubble on card click
   */
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      data?.onCardClick?.(event);
      setAnchorEl(event?.currentTarget);
    },
    [data, setAnchorEl],
  );

  const handleCloseStepEditionBubble = React.useCallback(() => {
    setAnchorEl(null);
    isStepNew && data?.endStepEdition?.();
  }, [data, isStepNew, setAnchorEl]);
  // ===================================================================

  // ====================== CONVERT INTO EXIT BUBBLE ======================
  const handleOpenConvertIntoExitBubble = React.useCallback(
    () => setAnchorConvertIntoExit(stepCardRef?.current),
    [],
  );

  const handleCloseConvertIntoExitBubble = React.useCallback(
    () => setAnchorConvertIntoExit(null),
    [],
  );
  // ===================================================================

  const handleSubmitForm = React.useCallback(
    (param: { list: StepMarketingActions[]; step: number }) => {
      if (!!data?.bubble?.onConfirm && data?.step?.id)
        data.bubble.onConfirm({
          list:
            param?.list?.map((action) => ({
              ...action,
              cadence_step: data.step.id,
              name: t('cadence.form.marketing_action.defaultName'),
            })) ?? [],
          step: data.step.id,
        });
      isStepNew && data.endStepEdition();
    },
    [data, isStepNew, t],
  );

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
          addMarketingAction={data.addMarketingAction}
          addNextStep={data.addNextStep}
          disableAddMarketingAction={data.disableAddMarketingAction}
          disabled={data.disabled}
          getEmailTemplate={data.getEmailTemplate}
          getTag={data.getTag}
          handleConvertIntoExit={handleOpenConvertIntoExitBubble}
          isSelected={data.isSelected}
          marketingActionList={data.marketingActionList}
          onCardClick={handleClick}
          onDelete={data.onDelete}
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
      />
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        onClose={handleCloseStepEditionBubble}
        open={!!anchorEl}
        PaperProps={popoverStyle}
        transformOrigin={transformOrigin}
      >
        <StepEditionBubble
          emailDetailList={data.bubble.emailDetailList}
          emailDetailListLoading={data.bubble.emailDetailListLoading}
          emailSummaryList={data.bubble.emailSummaryList}
          emailSummaryListLoading={data.bubble.emailSummaryListLoading}
          fetchEmailSummaryList={data.bubble.fetchEmailSummaryList}
          getEmailDetail={data.bubble.getEmailDetail}
          marketingActions={data.marketingActionList}
          onCancel={handleCloseStepEditionBubble}
          onConfirm={handleSubmitForm}
          resolvedGenericTags={data.bubble.resolvedGenericTags}
          step={data.step}
          tagCategories={data.bubble.tagCategories}
          tagList={data.bubble.tagList}
          updateCadenceStepName={data.bubble.updateCadenceStepName}
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
          onConfirm={data.submitConvertIntoExit}
        />
      </Popover>
    </>
  );
};

export default React.memo(InnerStepFlowVersion);
