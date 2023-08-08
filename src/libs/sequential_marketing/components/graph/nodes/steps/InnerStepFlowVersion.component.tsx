import React from 'react';
import { useTranslation } from 'react-i18next';
import { Connection, Handle, Position } from 'react-flow-renderer';

import { Popover, type PopoverOrigin } from '@material-ui/core';
import InnerStepCard, { InnerStepCardProps } from './InnerStepCard.component';
import {
  LEFT_HANDLE_STYLE,
  RIGHT_HANDLE_STYLE,
  HandleTypeChoices,
} from '#libs/sequential_marketing/constants/steps';
import type { StepMarketingActions } from '#libs/sequential_marketing/types';
import StepEditionBubble, {
  type StepEditionBubbleProps,
} from '../../bubbles/StepEditionBubble.component';

type FlowProps = {
  data: {
    onConnectToStep: (destination_step_id: string) => void;
    bubble: StepEditionBubbleProps;
  } & InnerStepCardProps;
};

const anchorOrigin: PopoverOrigin = {
  vertical: 'center',
  horizontal: 'right',
};

const popoverStyle = {
  style: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
};

const transformOrigin: PopoverOrigin = {
  vertical: 'center',
  horizontal: 'left',
};

export const InnerStepFlowVersion: React.FC<FlowProps> = ({ data }) => {
  const { t } = useTranslation('marketing');
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleConnect = React.useCallback(
    (params: Connection) => data.onConnectToStep?.(params.target),
    [data],
  );

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      data.onCardClick?.(event);
      setAnchorEl(event?.currentTarget);
    },
    [data],
  );

  const handleCloseBubble = React.useCallback(() => setAnchorEl(null), []);

  const handleSubmitForm = React.useCallback(
    (param: { list: StepMarketingActions[]; step: number }) => {
      data.bubble?.onConfirm?.({
        list:
          param?.list?.map((action) => ({
            ...action,
            cadence_step: data.step.id,
            name: t('cadence.form.marketing_action.defaultName'),
          })) ?? [],
        step: data.step.id,
      });
    },
    [data.bubble, data.step.id, t],
  );

  return (
    <>
      <Handle
        isConnectable
        position={Position.Left}
        style={LEFT_HANDLE_STYLE}
        type={HandleTypeChoices.TARGET}
      />
      <InnerStepCard
        addMarketingAction={data.addMarketingAction}
        addNextStep={data.addNextStep}
        disableAddMarketingAction={data.disableAddMarketingAction}
        disabled={data.disabled}
        getEmailTemplate={data.getEmailTemplate}
        getTag={data.getTag}
        handleChangeInExit={data.handleChangeInExit}
        isSelected={data.isSelected}
        marketingActionList={data.marketingActionList}
        onCardClick={handleClick}
        onDelete={data.onDelete}
        step={data.step}
      />
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
        onClose={handleCloseBubble}
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
          onCancel={handleCloseBubble}
          onClose={handleCloseBubble}
          onConfirm={handleSubmitForm}
          resolvedGenericTags={data.bubble.resolvedGenericTags}
          step={data.step}
          tagCategories={data.bubble.tagCategories}
          tagList={data.bubble.tagList}
          updateCadenceStepName={data.bubble.updateCadenceStepName}
        />
      </Popover>
    </>
  );
};

export default React.memo(InnerStepFlowVersion);
