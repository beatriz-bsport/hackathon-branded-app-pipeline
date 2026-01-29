import React from 'react';
import { useTranslation } from 'react-i18next';

import type {
  MarketingActionEssentials,
  StepMarketingActions,
} from '#src/libs/sequential_marketing/types';

import UniqueMarketingActionForm from '#src/libs/sequential_marketing/components/form/marketing_actions/UniqueMarketingActionForm.component';
import {
  MarketingActions,
  SequentialMarketingColors,
} from '#src/libs/sequential_marketing/constants';
import { getMarketingActionType } from '#src/libs/sequential_marketing/components/form/marketing_actions/utils';
import SmsCostWarningModal from '#src/libs/sequential_marketing/components/form/marketing_actions/communication_forms/SMS/SmsCostWarningModal';
import { marketingActionIconDict } from '#src/libs/sequential_marketing/components/helpers/utils';
import CadenceBubble from './CadenceBubble.component';

type Props = {
  marketingAction?: Partial<StepMarketingActions>;
  onConfirm: (data: Partial<StepMarketingActions>) => void;
  onCancel?: () => void;
  onDelete?: () => void;
} & MarketingActionEssentials;

const UniqueMarketingActionBubble: React.FC<Props> = ({
  marketingAction,
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  resolvedGenericTags,
  tagCategories,
  tagList,
  fetchEmailSummaryList,
  getEmailDetail,
  onConfirm,
  onCancel,
  onDelete,
}) => {
  const { t } = useTranslation('marketing');

  const isEdition = !!marketingAction?.id;

  const [smsCostWarningState, setSmsCostWarningState] = React.useState<
    'dismissed' | 'displayed' | null
  >(null);
  const [updatedMarketingAction, setUpdatedMarketingAction] =
    React.useState<Partial<StepMarketingActions> | null>(null);

  const [isFormValid, setIsFormValid] = React.useState(false);

  const marketingActionType = React.useMemo(
    () => getMarketingActionType(updatedMarketingAction),
    [updatedMarketingAction],
  );

  const updateMarketingAction = React.useCallback(
    (action: StepMarketingActions) => setUpdatedMarketingAction(action),
    [setUpdatedMarketingAction],
  );

  const saveMarketingActions = React.useCallback(() => {
    onConfirm?.(updatedMarketingAction!);
  }, [updatedMarketingAction, onConfirm]);

  const handleSubmit = React.useCallback(() => {
    if (
      !isEdition &&
      marketingActionType === MarketingActions.SMS &&
      smsCostWarningState !== 'dismissed'
    ) {
      setSmsCostWarningState('displayed');
    } else {
      setSmsCostWarningState(null);
      saveMarketingActions();
    }
  }, [
    isEdition,
    marketingActionType,
    smsCostWarningState,
    saveMarketingActions,
  ]);

  const handleUpdateFormValidation = React.useCallback((isValid: boolean) => {
    setIsFormValid(isValid);
  }, []);

  const handleCancel = React.useCallback(() => {
    isEdition ? onDelete?.() : onCancel?.();
  }, [onCancel, onDelete, isEdition]);

  React.useEffect(() => {
    !!marketingAction &&
      !updatedMarketingAction &&
      setUpdatedMarketingAction(marketingAction);
  }, [marketingAction, updatedMarketingAction]);

  return (
    <>
      <CadenceBubble
        minimalIcon
        color={SequentialMarketingColors.INNER_STEP_COLOR}
        icon={marketingActionIconDict[marketingActionType]}
        isSubmissionForbidden={!isFormValid}
        onCancelClick={handleCancel}
        onCancelText={isEdition ? t(`cadence.bubble.delete`) : ''}
        onConfirmClick={handleSubmit}
        onCrossClick={onCancel}
        title={t(`cadence.form.marketing_action.${marketingActionType}`)}
      >
        <UniqueMarketingActionForm
          emailDetailList={emailDetailList}
          emailDetailListLoading={emailDetailListLoading}
          emailSummaryList={emailSummaryList}
          emailSummaryListLoading={emailSummaryListLoading}
          fetchEmailSummaryList={fetchEmailSummaryList}
          getEmailDetail={getEmailDetail}
          marketingAction={updatedMarketingAction}
          resolvedGenericTags={resolvedGenericTags}
          tagCategories={tagCategories}
          tagList={tagList}
          updateFormValidation={handleUpdateFormValidation}
          updateMarketingAction={updateMarketingAction}
        />
      </CadenceBubble>
      {smsCostWarningState === 'displayed' && (
        <SmsCostWarningModal
          handleClose={() => setSmsCostWarningState(null)}
          isOpen={true}
          sendMessageOnClick={() => {
            saveMarketingActions();
          }}
        />
      )}
    </>
  );
};

export default React.memo(UniqueMarketingActionBubble);
