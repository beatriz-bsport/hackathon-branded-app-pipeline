import React from 'react';
import { useTranslation } from 'react-i18next';

import type {
  MarketingActionEssentials,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';

import CadenceBubble from './CadenceBubble.component';
import UniqueMarketingActionForm from '#libs/sequential_marketing/components/form/marketing_actions/UniqueMarketingActionForm.component';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';
import { getMarketingActionType } from '#libs/sequential_marketing/components/form/marketing_actions/utils';
import { marketingActionIconDict } from '#libs/sequential_marketing/components/helpers/utils';

type Props = {
  marketingAction?: Partial<StepMarketingActions>;
  onClose?: () => void;
  onConfirm: (data: Partial<StepMarketingActions>) => void;
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
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation('marketing');

  const [updatedMarketingAction, setUpdatedMarketingAction] =
    React.useState<Partial<StepMarketingActions> | null>(null);

  const [isFormValid, setIsFormValid] = React.useState(false);

  const marketingActionType = React.useMemo(
    () => getMarketingActionType(marketingAction),
    [marketingAction],
  );

  const updateMarketingAction = React.useCallback(
    (action: StepMarketingActions) => setUpdatedMarketingAction(action),
    [setUpdatedMarketingAction],
  );

  const handleSubmit = React.useCallback(() => {
    onConfirm?.(updatedMarketingAction);
    onClose?.();
  }, [updatedMarketingAction, onClose, onConfirm]);

  const handleUpdateFormValidation = React.useCallback((isValid: boolean) => {
    setIsFormValid(isValid);
  }, []);

  React.useEffect(() => {
    !!marketingAction &&
      !updatedMarketingAction &&
      setUpdatedMarketingAction(marketingAction);
  }, [marketingAction, updatedMarketingAction]);

  return (
    <CadenceBubble
      minimalIcon
      color={SequentialMarketingColors.INNER_STEP_COLOR}
      icon={marketingActionIconDict[marketingActionType]}
      isSubmissionForbidden={!isFormValid}
      onCancelClick={onClose}
      onConfirmClick={handleSubmit}
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
  );
};

export default React.memo(UniqueMarketingActionBubble);
