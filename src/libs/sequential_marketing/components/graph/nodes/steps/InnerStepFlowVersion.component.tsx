import React from 'react';
import { useTranslation } from 'react-i18next';
import { Connection, Handle, Position } from 'react-flow-renderer';
import Popover from '@material-ui/core/Popover';

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
import usePopoverBubble from '#libs/sequential_marketing/components/graph/nodes/usePopoverBubble.hook';
import ChangeInExitBubble from '#libs/sequential_marketing/components/graph/bubbles/ChangeInExitBubble.component';
import { DestinationStatus } from '#libs/sequential_marketing/constants';

type FlowProps = {
  data: {
    bubble: StepEditionBubbleProps;
    stepToEditId: number;
    endStepEdition: () => void;
    onConnectToStep: (destination_step_id: string) => void;
    submitChangeInExit: (status: DestinationStatus) => void;
  } & InnerStepCardProps;
};

export const InnerStepFlowVersion: React.FC<FlowProps> = ({ data }) => {
  const { t } = useTranslation('marketing');

  const stepCardRef = React.useRef<HTMLDivElement | null>(null);

  const { anchorOrigin, popoverStyle, transformOrigin, anchorEl, setAnchorEl } =
    usePopoverBubble();

  const isStepNew = data?.stepToEditId === data?.step?.id;

  React.useEffect(() => {
    isStepNew && setAnchorEl(stepCardRef?.current);
  }, [isStepNew, setAnchorEl]);

  const [anchorChangeInExit, setAnchorChangeInExit] =
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

  // ====================== CHANGE IN EXIT BUBBLE ======================
  const handleOpenChangeInExitBubble = React.useCallback(
    () => setAnchorChangeInExit(stepCardRef?.current),
    [],
  );

  const handleCloseChangeInExitBubble = React.useCallback(
    () => setAnchorChangeInExit(null),
    [],
  );
  // ===================================================================

  const handleConnect = React.useCallback(
    (params: Connection) => data.onConnectToStep?.(params.target),
    [data],
  );

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
          handleChangeInExit={handleOpenChangeInExitBubble}
          isSelected={data.isSelected}
          marketingActionList={data.marketingActionList}
          onCardClick={handleClick}
          onDelete={data.onDelete}
          step={data.step}
        />
      </div>
      <Handle
        isConnectable
        onConnect={handleConnect}
        position={Position.Right}
        style={RIGHT_HANDLE_STYLE}
        type={HandleTypeChoices.SOURCE}
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
        anchorEl={anchorChangeInExit}
        anchorOrigin={anchorOrigin}
        onClose={handleCloseChangeInExitBubble}
        open={!!anchorChangeInExit}
        PaperProps={popoverStyle}
        transformOrigin={transformOrigin}
      >
        <ChangeInExitBubble
          onCancel={handleCloseChangeInExitBubble}
          onConfirm={data.submitChangeInExit}
        />
      </Popover>
    </>
  );
};

export default React.memo(InnerStepFlowVersion);
